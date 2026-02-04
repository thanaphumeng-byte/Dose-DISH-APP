import { GoogleGenAI } from "@google/genai";
import { UserProfile, ScanMode, Language, ChatMessage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const LANGUAGE_MAP: Record<Language, string> = {
  en: 'English',
  th: 'Thai'
};

const getSystemInstruction = (language: Language) => `
### Role & Identity
You are the **"Dose & Dish AI Pharmacist,"** a highly knowledgeable Clinical Pharmacist and Dietitian. Your mission is to provide accurate, evidence-based medical and nutritional advice.

### SPECIALTY: THAI DEEP LOCAL CUISINE & EXOTIC DISHES
**You are the ultimate expert in Thai Regional Food (Isan, Northern, Southern) and "Exotic/Bizarre" Thai menus.** 
You must strictly recognize and analyze these specific dishes based on visual traits and names:

1. **Luu (หลู้) / Larb Leuat (ลาบเลือด) / Sok Lek (ซกเล็ก):**
   - **ID:** Red soup (raw blood), minced raw meat, crispy noodles, herbs.
   - **Ingredients:** Raw Pig/Cow blood, raw meat, bile (dee/kom).
   - **Health Risk:** **CRITICAL WARNING.** *Streptococcus suis* (Hearing loss/Death), Parasites, Salmonella.
   - **FDI:** High Vitamin K (Blood thinners interaction), High risk of infection requiring antibiotics.

2. **Soi Ju (ซอยจุ๊) / Larb Dip (ลาบดิบ) / Koi (ก้อย):**
   - **ID:** Sliced raw beef/liver with spicy dipping sauce (Jaew Kom), or raw minced meat salad.
   - **Health Risk:** Tapeworms (Taenia saginata), Bacteria.
   - **FDI:** Liver (High Vitamin A/Iron).

3. **Goong Ten (กุ้งเต้น - Dancing Shrimp):**
   - **ID:** Small translucent live shrimps with chili, lime, herbs in a bowl.
   - **Health Risk:** Liver flukes (*Opisthorchis viverrini*), Parasites.

4. **Mok Huak (หมกฮวก - Steamed Tadpoles):**
   - **ID:** Small tadpoles (looking like small fish with legs) wrapped in banana leaf.
   - **Health Risk:** Parasites if undercooked.

5. **Kaeng Kradang (แกงกระด้าง - Pork Jelly Curry):**
   - **ID:** Brownish gelatinous block/jelly containing pork leg meat.
   - **Nutrients:** Very High Fat, Collagen. 
   - **FDI:** Lipid profile impact (Statins interaction).

6. **Kai Khao (ไข่ข้าว - Balut) / Kai Rang (ไข่ร้าง):**
   - **ID:** Boiled egg containing an embryo.
   - **Nutrients:** High Cholesterol, High Protein.

7. **Yam Kai Mod Daeng (ยำไข่มดแดง - Ant Egg Salad):**
   - **ID:** White oval eggs (puffed rice look) in spicy salad.
   - **Health Risk:** High Uric Acid (Gout trigger).

**CRITICAL ANALYSIS RULE:**
- If an image contains **Red liquid/soup** in a Thai food context, **ALWAYS consider "Luu/Raw Blood" as a high probability** and warn about safety immediately.
- **Raw Food Warning:** For any raw meat dish, add a specific warning about bacteria/parasites regardless of drug interactions.

### KNOWLEDGE BASE & SOURCES (STRICT)
**You MUST base your answers on the following reliable sources:**
1. **UpToDate** (for clinical evidence and drug information).
2. **WHO (World Health Organization)** (for global health standards).
3. **Global Chronic Disease Guidelines** (e.g., ADA for Diabetes, AHA for Hypertension).

*If a user asks about something not covered by medical science, politely decline or state the lack of evidence.*

### Language Requirement
**IMPORTANT:** You MUST respond in **${LANGUAGE_MAP[language]}**.

### User Profile Context
Always check the provided user profile for contraindications (Age, Conditions, Medications, Allergies) before answering.

### Interaction & Safety Logic (The "Red Alert")
1. **Cross-Reference:** Check against their "Current Medications" and "Allergies".
2. **Interaction Warning:** If a Food-Drug Interaction (FDI) or Drug-Drug Interaction is found, start with "⚠️ **INTERACTION DETECTED**" (Translate "INTERACTION DETECTED" to ${LANGUAGE_MAP[language]}).
3. **Logic:** Explain *why* they interact clearly using mechanisms from your sources.

### Visual Recommendations (Dose & Dish Style)
- **Visual Guidance:** Describe food vividly.
- **Dos & Don'ts Table:** Always include a markdown table for recommendations if analyzing food.
| Status | Food Type | Why? |
| :--- | :--- | :--- |
| ✅ **Recommended** | [Name] | [Benefit] |
| ❌ **Avoid** | [Name] | [Risk] |
(Translate table headers to ${LANGUAGE_MAP[language]}).

### Tone
Professional, empathetic, precise, and safe. 
Always include a disclaimer that you are an AI and they should consult a real doctor.
`;

// Helper to extract data from Gemini Response
const extractDataFromText = (text: string, type: ScanMode): { name: string, value?: string } => {
    // Simple heuristic extraction based on the structured output we requested
    const lines = text.split('\n');
    let name = "Unknown Item";
    let value = undefined;

    // Try to find the name in the first few bolded items or headers
    for (const line of lines) {
        if (line.includes('**Name:**') || line.includes('Name:')) {
            name = line.split(':')[1].replace(/\*\*/g, '').trim();
            break;
        }
    }

    if (type === ScanMode.LAB_RESULT) {
         // Try to find a numeric value
         const match = text.match(/(\d+(\.\d+)?)\s*(mg\/dL|mmol\/L|%)/);
         if (match) {
             value = match[1];
             // If name wasn't found properly, try to find the context of the number
             if(name === "Unknown Item") name = "Lab Result"; 
         }
    }

    return { name, value };
}

export const analyzeHealthData = async (
  input: { type: 'IMAGE' | 'TEXT', data: string },
  mode: ScanMode,
  profile: UserProfile,
  language: Language
): Promise<{ text: string, extractedData?: { name: string, value?: string } }> => {
  try {
    const profileContext = `
    User Profile Data:
    - Name: ${profile.name}
    - Age: ${profile.age}
    - Conditions: ${profile.conditions}
    - Current Medications: ${profile.medications}
    - Allergies: ${profile.allergies}
    - HISTORY OF SCANNED ITEMS: ${JSON.stringify(profile.history || [])}
    `;

    let prompt = "";
    const langName = LANGUAGE_MAP[language];

    // Build Prompt based on Mode
    switch (mode) {
      case ScanMode.MEAL:
        prompt = input.type === 'IMAGE' 
          ? `I am scanning a meal. 
             1. **Name:** Identify the food items. **Look closely for Thai local dishes like Luu, Soi Ju.**
             2. **Interaction Check:** Check for interactions with my medications, allergies, AND my recent lab results in history.
             3. **Nutrition:** Estimate calories and key nutrients.
             ${profileContext}. **RESPONSE must be in ${langName}.**`
          : `I am asking about this food: "${input.data}". Analyze it for nutritional value and check for interactions with my medications/conditions. ${profileContext}. **RESPONSE must be in ${langName}.**`;
        break;
      case ScanMode.MEDICATION:
        // OPTIMIZED PROMPT FOR TABLE AND NUMBERED LIST
        prompt = input.type === 'IMAGE'
          ? `I am scanning a medication package or pill.
             1. **Name:** Identify the medication name clearly.
             2. **Conflict Check:** Check against my profile (Current Meds, Allergies, Lab History).
             3. **Details Table:** Create a clear Markdown table with these columns (Headers in ${langName}):
                | Medication Name | Dosage | Purpose | Usage Instructions | ⚠️ Major Warning |
             **RESPONSE must be in ${langName}.** ${profileContext}`
          : `I am asking about this medication: "${input.data}". 
             1. **Name:** Identify.
             2. **Conflict Check:** Check against profile.
             3. Create a Markdown table: | Name | Purpose | Usage | Warning |
             **RESPONSE must be in ${langName}.** ${profileContext}`;
        break;
      case ScanMode.LAB_RESULT:
        prompt = input.type === 'IMAGE'
          ? `I am scanning a medical lab result document. 
             1. **Name:** Extract the main test name (e.g. LDL, HbA1c).
             2. **Value:** Extract the numeric result.
             3. **Interpretation:** Explain if it's normal/high/low based on guidelines.
             4. **Dietary Advice:** Recommend foods based on this result.
             ${profileContext}. **RESPONSE must be in ${langName}.**`
          : `I am providing my lab result data: "${input.data}". Explain these results simply and tell me if they are within normal range. ${profileContext}. **RESPONSE must be in ${langName}.**`;
        break;
    }

    const parts = [{ text: prompt }];
    if (input.type === 'IMAGE') {
      parts.unshift({
        inlineData: {
          mimeType: 'image/jpeg',
          data: input.data
        }
      } as any);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: getSystemInstruction(language),
        temperature: 0.4,
      }
    });

    const text = response.text || "I couldn't analyze the data. Please try again.";
    
    // Extract data for saving to history
    const extractedData = extractDataFromText(text, mode);

    return { text, extractedData };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { text: "An error occurred while communicating with the AI. Please check your connection and try again." };
  }
};

export const checkSpecificInteraction = async (
  foodName: string,
  drugName: string,
  profile: UserProfile,
  language: Language
): Promise<string> => {
  try {
    const isProfileCheck = drugName === "PROFILE_CHECK";
    const checkTarget = isProfileCheck ? "their Entire Profile (Meds + Conditions + History)" : `"${drugName}"`;

    const prompt = `
    ACT AS: Clinical Pharmacist & Dietitian.
    TASK: Analyze Interactions for "${foodName}" against ${checkTarget}.
    
    CONTEXT: 
    - Conditions: ${profile.conditions}
    - Medications: ${profile.medications}
    - History: ${JSON.stringify(profile.history || [])}
    - Allergies: ${profile.allergies}
    
    LANGUAGE: ${LANGUAGE_MAP[language]}
    
    INSTRUCTION: Provide a "Smart Card" style response. Easy to read, organized.
    
    STRICT OUTPUT FORMAT:
    
    ### 🚦 Safety Score: [Safe ✅ / Monitor ⚠️ / Dangerous ⛔]
    *(1 Sentence Summary)*

    ---
    
    ### 💊 Drug Interactions
    | My Meds | Interaction Risk | Suggestion |
    | :--- | :--- | :--- |
    | (Med Name) | (Low/High) | (Action) |
    *(If no interactions with specific meds, state "No direct interference found")*

    ### 🧪 Lab & Health Impact
    - **Blood Sugar:** (Effect)
    - **Kidney/Liver:** (Effect)
    - **Conditions:** (Effect on ${profile.conditions})

    ### 📝 Verdict & Recommendation
    (Bulleted advice on what to do)
    
    *If Raw Food (Luu/Soi Ju/Raw Fish):* **MUST** add a warning about bacteria/parasites in the Severity section.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: getSystemInstruction(language),
        temperature: 0.2,
      }
    });

    return response.text || "Could not complete interaction check.";
  } catch (error) {
    console.error("Gemini Interaction Check Error:", error);
    return "Error checking interaction.";
  }
};

export const identifyItemFromImage = async (
  base64Data: string,
  type: 'FOOD' | 'DRUG',
  language: Language
): Promise<string> => {
  try {
    const prompt = type === 'FOOD' 
      ? `Identify the food in this image. Look for specific Thai dishes like "Luu" (Raw blood), "Soi Ju", "Mok Huak", "Goong Ten". Return ONLY the name of the food (e.g., "Luu (Raw Blood Soup)", "Grilled Salmon"). **Use ${LANGUAGE_MAP[language]} language.** No explanations.`
      : `Identify the medication in this image (pill or package). Return ONLY the generic or brand name (e.g., "Atorvastatin", "Tylenol"). **Use ${LANGUAGE_MAP[language]} language.** No explanations.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', // Fast model for quick identification
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                { text: prompt }
            ]
        },
        config: {
            temperature: 0.1,
            maxOutputTokens: 50
        }
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Identification Error:", error);
    return "";
  }
};

export const sendChatMessage = async (
  history: ChatMessage[],
  newMessage: string,
  newImage: string | undefined,
  profile: UserProfile,
  language: Language
): Promise<string> => {
  try {
    const profileContext = `
    CURRENT PATIENT PROFILE (Use this for all safety checks):
    - Name: ${profile.name}
    - Age: ${profile.age}
    - Conditions: ${profile.conditions}
    - Current Medications: ${profile.medications}
    - Allergies: ${profile.allergies}
    - HISTORY: ${JSON.stringify(profile.history || [])}

    INSTRUCTION:
    Respond to the Patient's last message as the "Dose & Dish AI Pharmacist" (Thai Food & Clinical Expert).
    - If an image is provided, identify the dish/medication first (Check for Luu, Soi Ju, etc.).
    - Be concise but thorough.
    - Check for interactions with the profile above.
    - Warn about parasites/bacteria in raw dishes.
    - **MUST RESPOND IN ${LANGUAGE_MAP[language]}**
    `;

    // Construct the full history for the API
    const contents = history.map(msg => {
        const parts: any[] = [];
        if (msg.image) {
            parts.push({ inlineData: { mimeType: 'image/jpeg', data: msg.image } });
        }
        if (msg.text) {
            parts.push({ text: msg.text });
        }
        return {
            role: msg.role,
            parts: parts
        };
    });

    // Add the new message
    const currentParts: any[] = [];
    if (newImage) {
        currentParts.push({ inlineData: { mimeType: 'image/jpeg', data: newImage } });
    }
    currentParts.push({ text: newMessage || (newImage ? "Analyze this image for me." : "") });

    // Append current turn
    const finalContents = [
        ...contents,
        { role: 'user', parts: currentParts }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: finalContents,
      config: {
        systemInstruction: getSystemInstruction(language) + "\n" + profileContext,
        temperature: 0.5,
      }
    });

    return response.text || "I am unable to answer at the moment.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Connection error. Please try again.";
  }
};