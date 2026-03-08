// ============================================================
// src/data/portfolio.ts
// ⭐ 所有個人資料集中在這裡，改這裡就能更新整個網站
// ============================================================

export const siteData = {
  // ---------- 基本資訊 ----------
  name: "黃予岑",
  nameEn: "Ken",
  title: "資訊管理學系 大四生",
  institution: "輔仁大學",
  email: "a03111006@gmail.com",
  phone: "0939-160-311",
  location: "基隆市安樂區",
  tagline: "NLP · Fraud Detection · Web Development",
  bio: [
    "輔仁大學資訊管理系大四生，即將升讀中央大學資訊管理研究所。",
    "專注於 NLP、機器學習與全端開發，熱衷於將技術應用於真實社會問題。目前進行國科會大專生研究計畫，研究以 AI 整合技術提升詐騙辨識精確度。",
    "喜歡從頭打造系統、解決複雜問題，在開發過程中培養了快速調適與持續學習的習慣。",
  ],

  // ---------- 社群連結 ----------
  links: {
    github: "",      // 填入 "https://github.com/你的帳號"
    linkedin: "",    // 填入你的 LinkedIn URL
    email: "mailto:a03111006@gmail.com",
  },

  // ---------- 學歷 ----------
  education: [
    {
      school: "國立中央大學",
      dept: "資訊管理研究所",
      degree: "碩士（甄試錄取）",
      period: "2025 — 預計",
      badge: "甄試錄取",
    },
    {
      school: "輔仁大學",
      dept: "資訊管理學系",
      degree: "學士",
      period: "2021 — 2025",
      badge: "班排前十 / 書卷獎",
    },
    {
      school: "臺北市立成功高中",
      dept: "",
      degree: "高中",
      period: "2018 — 2021",
      badge: "",
    },
  ],

  // ---------- 研究 / 專案 ----------
  projects: [
    {
      id: "fraud-radar",
      title: "騙局雷達 Fraud Radar",
      subtitle: "詐騙辨識系統 — 畢業專題",
      period: "2024 — 2025",
      type: "project" as const,
      tags: ["BERT", "OCR", "NLP", "React", "Python Flask", "Firebase"],
      description:
        "結合 AI、NLP、OCR 與爬蟲技術，開發多模態詐騙辨識平台。可處理文字、網址、圖片、檔案等輸入，輸出詐騙相似度百分比、關鍵字分析與情緒操控指標，並附帶沉浸式防詐教育小遊戲。",
      highlights: [
        "BERT fine-tuning 詐騙文字分類",
        "PaddleOCR + 影像預處理提升辨識率",
        "CLIP 語意匹配篩選詐騙內容",
        "Gemini 模型自動萃取關鍵字與詐騙類型",
        "育秀盃創意獎佳作 / 專題發表優秀組別",
      ],
      link: "https://drive.google.com/drive/folders/1_G7nwt538wlxG21TaQK8OMSoWe3znhS9?usp=sharing",
    },
    {
      id: "nsc",
      title: "國科會大專生研究計畫",
      subtitle: "計畫編號：114-2813-C-030-031-E",
      period: "2024 — 2025",
      type: "research" as const,
      tags: ["BERT", "CLIP", "PaddleOCR", "TF-IDF", "NLP"],
      description:
        "結合 AI 整合技術以提升詐騙辨識精確度。針對現有 OCR 辨識不足問題，透過影像預處理（NLM降噪、Otsu閾值化）與 CLIP 語意篩選，改善 BERT 分類模型輸入品質，AUC-ROC 從 0.873 提升至 0.929。",
      highlights: [
        "AUC-ROC: 0.873 → 0.929",
        "NLM denoising + Otsu thresholding 預處理",
        "CLIP 零樣本語意篩選",
        "指導教授：許文錦",
      ],
      link: "",
    },
    {
      id: "waf",
      title: "AI 輔助 WAF 攻擊偵測系統",
      subtitle: "研究計畫 — 資訊安全",
      period: "2025",
      type: "research" as const,
      tags: ["XAI", "SHAP", "Machine Learning", "WAF", "Incremental Learning"],
      description:
        "提出 AI 強化 WAF 框架，結合 TF-IDF / Transformer embedding 與 HTTP 行為特徵，使用 PyTAIL 實作 Human-in-the-Loop 增量學習，並以 XAI/SHAP 提供可解釋規則建議。",
      highlights: [
        "偵測 SQL Injection、XSS 等變形攻擊",
        "SHAP 可解釋特徵分析",
        "Human-in-the-Loop 增量訓練",
        "自動生成 WAF 規則建議",
      ],
      link: "",
    },
    {
      id: "leave-system",
      title: "學生線上請假系統",
      subtitle: "系統分析與設計 — 課程專題",
      period: "2023",
      type: "project" as const,
      tags: ["PHP", "MySQL", "HTML/CSS", "JavaScript"],
      description:
        "解決學校缺乏統一請假系統問題，自動帶入課表、Email 通知教師、出席統計及助教帳號等完整功能。",
      highlights: [
        "自動帶入個人課表",
        "Email 自動通知機制",
        "教師 / 學生 / 助教多角色權限",
        "即時回報對話框",
      ],
      link: "",
    },
    {
      id: "gift-roulette",
      title: "轉盤禮物選擇系統",
      subtitle: "進階 Web 程式設計 — 課程專題",
      period: "2023",
      type: "project" as const,
      tags: ["React", "JavaScript"],
      description:
        "協助使用者從候選禮物清單透過轉盤決策，整合圖片、價格、購買連結，一鍵跳轉購買頁面。",
      highlights: ["React SPA 架構", "動態轉盤動畫", "購物清單篩選功能"],
      link: "",
    },
  ],

  // ---------- 技能 ----------
  skills: {
    "程式語言": ["Python", "JavaScript", "TypeScript", "PHP", "Java", "SQL"],
    "前端框架": ["React", "Next.js", "HTML/CSS"],
    "AI / ML": ["BERT", "CLIP", "PaddleOCR", "Hugging Face", "Scikit-learn"],
    "後端 / 資料庫": ["Flask", "Node.js", "MySQL", "Firebase"],
    "雲端 / 工具": ["AWS Cloud Architecting", "Git", "Excel"],
  },

  // ---------- 獎項 / 榮譽 ----------
  awards: [
    { year: "2025", title: "管理學院學術獎章", org: "輔仁大學" },
    { year: "2025", title: "專題發表優秀組別（第 42 屆）", org: "輔仁大學資訊管理系" },
    { year: "2025", title: "第 30 屆資訊應用服務創新競賽 — 校內推薦", org: "輔仁大學" },
    { year: "2024", title: "第 22 屆育秀盃創意獎佳作", org: "育秀盃" },
    { year: "2024", title: "113 學年度第 2 學期書卷獎", org: "輔仁大學" },
    { year: "2024", title: "AWS Academy Graduate — Cloud Architecting", org: "AWS" },
    { year: "2024", title: "AI 微學程結業", org: "輔仁大學" },
    { year: "2023", title: "班級代表", org: "輔仁大學資訊管理系" },
  ],

  // ---------- 工作經驗 ----------
  experience: [
    {
      role: "解題老師",
      company: "文城教育學院",
      period: "2023.11 — 2024.06",
      desc: "負責國三數學及自然科目解題教學",
    },
    {
      role: "時薪人員",
      company: "達美樂披薩",
      period: "2024.01 — 至今",
      desc: "內外場事務、外送",
    },
    {
      role: "暑期工讀",
      company: "金格食品",
      period: "2024.07 — 2024.09",
      desc: "拜訪客戶、店內事務協助",
    },
    {
      role: "後場人員",
      company: "圓圓堂純米麻糬",
      period: "2024.01 — 2024.02",
      desc: "食材處理、產品製作與封裝出貨",
    },
  ],
} as const
