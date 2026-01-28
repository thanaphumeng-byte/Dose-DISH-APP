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
  },
  cn: {
    nav: { home: "首页", profile: "个人资料", fdi: "相互作用", chat: "咨询" },
    scanner: {
      title: "新条目",
      medication: "药物",
      meal: "膳食",
      lab: "化验单",
      camera: "相机",
      text: "输入",
      tapToScan: "点击扫描",
      orUpload: "或上传图片",
      analyzing: "分析中...",
      retake: "重拍",
      typePlaceholder: "在此输入关于 {mode} 的详细信息...",
      analyzeBtn: "分析"
    },
    profile: {
      title: "健康档案",
      subtitle: "帮助 Dose & Dish 更好地保护您",
      name: "全名",
      age: "年龄",
      conditions: "慢性疾病",
      meds: "当前用药",
      allergies: "过敏史",
      save: "保存资料",
      placeholderName: "张三",
      placeholderConditions: "例如：高血压",
      placeholderMeds: "例如：阿托伐他汀 20mg",
      placeholderAllergies: "例如：花生"
    },
    fdi: {
      title: "快速交互检查",
      subtitle: "即时检查食物是否与药物冲突。",
      foodLabel: "食物",
      drugLabel: "药物",
      checkBtn: "检查相互作用",
      checking: "正在检查...",
      placeholderFood: "例如：葡萄柚",
      placeholderDrug: "例如：他汀类药物"
    },
    chat: {
      title: "药剂师咨询",
      subtitle: "询问有关药物、慢性病或饮食的问题。",
      placeholder: "请输入您的问题（例如：副作用）...",
      send: "发送",
      pharmacist: "AI 药剂师",
      you: "您",
      typing: "药剂师正在输入...",
      welcome: "您好！我是您的 AI 药剂师。我可以根据 UpToDate 和 WHO 指南为您解答。有什么可以帮您？"
    },
    dashboard: {
      hello: "你好，",
      guest: "访客",
      subtitle: "今天想查点什么？",
      tagAllergies: "过敏监控开启",
      tagMeds: "药物数据已加载",
      noLabData: "暂无化验数据",
      labTitle: "LDL 胆固醇趋势"
    },
    analysis: {
      safetyAlert: "安全警报",
      caution: "注意",
      safe: "安全选择",
      result: "分析结果",
      disclaimer: "AI 生成的建议。请咨询医生。"
    },
    common: {
      alertProfile: "请先完善您的个人资料。"
    }
  }
};