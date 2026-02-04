import { Language } from './types';

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    nav: { home: "Home", profile: "Profile", fdi: "FDI Check", chat: "Chat" },
    scanner: {
      title: "New Entry",
      medication: "Medication",
      meal: "Meal",
      lab: "Lab Result",
      camera: "Camera",
      text: "Text",
      tapToScan: "Tap to Scan",
      orUpload: "or upload file",
      analyzing: "Analyzing...",
      retake: "Retake",
      typePlaceholder: "Type details about your {mode} here...",
      analyzeBtn: "Analyze"
    },
    profile: {
      title: "Health Profile",
      subtitle: "Help Dose & Dish keep you safe",
      name: "Full Name",
      age: "Age",
      conditions: "Chronic Conditions",
      meds: "Current Medications",
      allergies: "Allergies",
      save: "Save Profile",
      placeholderName: "Jane Doe",
      placeholderConditions: "e.g., Hypertension",
      placeholderMeds: "e.g., Atorvastatin 20mg",
      placeholderAllergies: "e.g., Peanuts"
    },
    fdi: {
      title: "Quick Interaction Check",
      subtitle: "Instantly check if a food clashes with a drug.",
      foodLabel: "Food Item",
      drugLabel: "Medication",
      checkBtn: "Check Interaction",
      checking: "Checking Safety...",
      identifying: "Identifying Item...",
      placeholderFood: "e.g. Grapefruit",
      placeholderDrug: "e.g. Atorvastatin"
    },
    chat: {
      title: "Pharmacist Chat",
      subtitle: "Ask about meds, chronic diseases, or diet.",
      placeholder: "Ask me anything (e.g., side effects)...",
      send: "Send",
      pharmacist: "Pharmacist AI",
      you: "You",
      typing: "Pharmacist is typing...",
      welcome: "Hello! I am your AI Pharmacist. I can answer questions based on UpToDate, WHO, and chronic disease guidelines. How can I help?"
    },
    dashboard: {
      hello: "Hi,",
      guest: "Guest",
      subtitle: "What would you like to check today?",
      tagAllergies: "Allergies Active",
      tagMeds: "Meds Loaded",
      noLabData: "No lab data recorded yet.",
      labTitle: "LDL Cholesterol Trend"
    },
    analysis: {
      safetyAlert: "Safety Alert",
      caution: "Caution",
      safe: "Safe Choice",
      result: "Analysis Result",
      disclaimer: "AI-generated advice. Consult a doctor."
    },
    common: {
      alertProfile: "Please complete your profile first."
    }
  },
  th: {
    nav: { home: "หน้าหลัก", profile: "ข้อมูลส่วนตัว", fdi: "เช็คยา/อาหาร", chat: "แชท" },
    scanner: {
      title: "บันทึกข้อมูลใหม่",
      medication: "ยา",
      meal: "อาหาร",
      lab: "ผลแล็บ",
      camera: "กล้อง",
      text: "พิมพ์",
      tapToScan: "แตะเพื่อสแกน",
      orUpload: "หรืออัปโหลดรูป",
      analyzing: "กำลังวิเคราะห์...",
      retake: "ถ่ายใหม่",
      typePlaceholder: "พิมพ์รายละเอียดเกี่ยวกับ {mode} ที่นี่...",
      analyzeBtn: "วิเคราะห์"
    },
    profile: {
      title: "ข้อมูลสุขภาพ",
      subtitle: "ช่วยให้ Dose & Dish ดูแลคุณได้ดียิ่งขึ้น",
      name: "ชื่อ-นามสกุล",
      age: "อายุ",
      conditions: "โรคประจำตัว",
      meds: "ยาที่ทานอยู่",
      allergies: "ประวัติแพ้ยา/อาหาร",
      save: "บันทึกข้อมูล",
      placeholderName: "สมชาย ใจดี",
      placeholderConditions: "เช่น ความดันโลหิตสูง",
      placeholderMeds: "เช่น Atorvastatin 20mg",
      placeholderAllergies: "เช่น ถั่วลิสง"
    },
    fdi: {
      title: "เช็คยาตีกัน",
      subtitle: "ตรวจสอบว่าอาหารและยาของคุณทานร่วมกันได้หรือไม่",
      foodLabel: "อาหาร",
      drugLabel: "ยา",
      checkBtn: "ตรวจสอบ",
      checking: "กำลังตรวจสอบ...",
      identifying: "กำลังระบุชื่อ...",
      placeholderFood: "เช่น น้ำเกรปฟรุต",
      placeholderDrug: "เช่น ยาลดไขมัน"
    },
    chat: {
      title: "ปรึกษาเภสัชกร",
      subtitle: "สอบถามเรื่องยา โรคเรื้อรัง หรือโภชนาการ",
      placeholder: "พิมพ์คำถามของคุณ (เช่น ผลข้างเคียงยา)...",
      send: "ส่ง",
      pharmacist: "เภสัชกร AI",
      you: "คุณ",
      typing: "เภสัชกรกำลังพิมพ์...",
      welcome: "สวัสดีครับ! ผมคือเภสัชกร AI ยินดีให้คำปรึกษาโดยอ้างอิงจาก UpToDate และ WHO ครับ มีอะไรให้ช่วยไหมครับ?"
    },
    dashboard: {
      hello: "สวัสดี,",
      guest: "ผู้มาเยือน",
      subtitle: "วันนี้คุณต้องการเช็คอะไร?",
      tagAllergies: "ระบบเช็คภูมิแพ้",
      tagMeds: "ข้อมูลยาพร้อม",
      noLabData: "ยังไม่มีข้อมูลผลแล็บ",
      labTitle: "แนวโน้มคอเลสเตอรอล (LDL)"
    },
    analysis: {
      safetyAlert: "เตือนภัยความเสี่ยง",
      caution: "ข้อควรระวัง",
      safe: "ปลอดภัย",
      result: "ผลการวิเคราะห์",
      disclaimer: "คำแนะนำจาก AI ควรปรึกษาแพทย์ก่อนตัดสินใจ"
    },
    common: {
      alertProfile: "กรุณากรอกข้อมูลส่วนตัวก่อนเริ่มใช้งาน"
    }
  }
};