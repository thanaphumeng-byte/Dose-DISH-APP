import { GoogleGenAI } from "@google/genai";
import { UserProfile, ScanMode, Language, ChatMessage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const LANGUAGE_MAP: Record<Language, string> = {
  en: 'English',
  th: 'Thai',
  cn: 'Simplified Chinese'
};

const getSystemInstruction = (language: Language) => `
### Role & Identity
You are the **"Dose & Dish AI Pharmacist,"** a highly knowledgeable Clinical Pharmacist and Dietitian. Your mission is to provide accurate, evidence-based medical and nutritional advice.

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

export const analyzeHealthData = async (
  input: { type: 'IMAGE' | 'TEXT', data: string },
  mode: ScanMode,
  profile: UserProfile,
  language: Language
): Promise<string> => {
  try {
    const profileContext = `
    User Profile Data:
    - Name: ${profile.name}
    - Age: ${profile.age}
    - Conditions: ${profile.conditions}
    - Current Medications: ${profile.medications}
    - Allergies: ${profile.allergies}
    `;

    let prompt = "";
    // Build Prompt based on Mode
    switch (mode) {
      case ScanMode.MEAL:
        prompt = input.type === 'IMAGE' 
          ? `I am scanning a meal. Identify the food items. Check for interactions with my medications or conditions using UpToDate/WHO guidelines. ${profileContext}`
          : `I am asking about this food: "${input.data}". Analyze it for nutritional value and check for interactions with my medications/conditions. ${profileContext}`;
        break;
      case ScanMode.MEDICATION:
        prompt = input.type === 'IMAGE'
          ? `I am scanning a medication package or pill. Identify the drug. Check for interactions with my current medications or allergies using reliable pharmaceutical sources. Tell me the usage instructions if visible. ${profileContext}`
          : `I am asking about this medication: "${input.data}". Explain what it is and check for interactions with my current medications or allergies. ${profileContext}`;
        break;
      case ScanMode.LAB_RESULT:
        prompt = input.type === 'IMAGE'
          ? `I am scanning a medical lab result document. Extract the key findings, explain them simply using chronic disease guidelines, and tell me if they are within normal range. ${profileContext}`
          : `I am providing my lab result data: "${input.data}". Explain these results simply and tell me if they are within normal range. ${profileContext}`;
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

    return response.text || "I couldn't analyze the data. Please try again.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "An error occurred while communicating with the AI. Please check your connection and try again.";
  }
};

export const checkSpecificInteraction = async (
  foodName: string,
  drugName: string,
  profile: UserProfile,
  language: Language
): Promise<string> => {
  try {
    const prompt = `
    ACT AS: Clinical Pharmacist & Dietitian.
    TASK: Check for Food-Drug Interactions (FDI).
    SOURCE: UpToDate, WHO.
    LANGUAGE: ${LANGUAGE_MAP[language]}
    
    INPUTS:
    1. Food: "${foodName}"
    2. Drug: "${drugName}"
    3. Patient Profile: 
       - Conditions: ${profile.conditions}
       - Other Meds: ${profile.medications}
       - Allergies: ${profile.allergies}

    OUTPUT FORMAT:
    - Start with a clear header.
    - Risk Level: [Safe / Caution / Dangerous] (Translate to ${LANGUAGE_MAP[language]})
    - Explanation: Scientific mechanism.
    - Recommendation: What should the user do?
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

export const sendChatMessage = async (
  history: ChatMessage[],
  newMessage: string,
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
    `;

    // Construct the conversation history for the prompt
    // Note: We use generateContent for simplicity here, creating a conversational prompt.
    // In a production app with persistent sessions, ai.chats.create would be used.
    let conversationText = "";
    history.forEach(msg => {
      conversationText += `${msg.role === 'user' ? 'Patient' : 'Pharmacist'}: ${msg.text}\n`;
    });
    conversationText += `Patient: ${newMessage}\nPharmacist:`;

    const prompt = `
    ${profileContext}

    PREVIOUS CONVERSATION:
    ${conversationText}

    INSTRUCTION:
    Respond to the Patient's last message as the "Dose & Dish AI Pharmacist".
    - Be concise but thorough.
    - Cite sources (UpToDate, WHO) if explaining medical facts.
    - Check for interactions with the profile above.
    - Language: ${LANGUAGE_MAP[language]}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: getSystemInstruction(language),
        temperature: 0.5,
      }
    });

    return response.text || "I am unable to answer at the moment.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Connection error. Please try again.";
  }
};