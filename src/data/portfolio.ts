export const siteData = {
  name: "黃予岑",
  nameEn: "Ken",
  title: "資訊管理學系 大四",
  institution: "輔仁大學",
  email: "a03111006@gmail.com",
  phone: "0939-160-311",
  location: "基隆市安樂區",

  photo: '/personal_web/1.jpg',

  taglines: [
    'ML & CV Researcher',
    'Full-Stack Developer',
    'Incoming M.S. Student @ NCU (2026)',
  ],

  homeSkills: ['React', 'Next.js', 'Python', 'OCR', 'YOLO', 'BERT', 'NLP'],

  bio: [
    "輔仁大學資訊管理系大四",
    "專注於機器學習、電腦視覺、NLP 與全端開發，熱衷於將技術應用於真實社會問題。目前進行國科會大專生研究計畫，研究以 AI 整合技術提升詐騙辨識精確度。",
    "喜歡從頭打造系統、訓練模型、解決複雜問題，在開發過程中培養了快速調適與持續學習的習慣。",
  ],

  links: {
    github: "",
    linkedin: "",
    email: "mailto:a03111006@gmail.com",
    instagram: "https://www.instagram.com/ken._.yuuuu/",
    line: "https://line.me/ti/p/-QSe-xEn3K",
  },

  education: [
    {
      school: "國立中央大學",
      dept: "資訊管理研究所",
      degree: "碩士",
      period: "2026 — 2028",
      badge: "推甄錄取",
      highlights: [
        { label: "研究方向", items: ["電腦視覺", "機器學習應用", "情緒辨識"] },
      ],
    },
    {
      school: "輔仁大學",
      dept: "資訊管理學系",
      degree: "學士",
      period: "2022 — 2026",
      badge: "班排前十 / 書卷獎",
      highlights: [
        { label: "學術", items: ["管理學院學術獎章 ×2", "書卷獎 / 班排10%", "AI微學程 / 雲端學程"] },
        { label: "專題", items: ["騙局雷達 Fraud Radar", "第 22 屆育秀盃創意獎佳作", "第 42 屆專題發表優秀組別"] },
        { label: "職務", items: ["班級代表*2", "副班級代表*1"] },
        { label: "活動", items: ["舉辦制服趴", "資管系羽毛球隊", "永續淨灘活動"] },

      ],
    },
    {
      school: "臺北市立成功高中",
      dept: "",
      degree: "高中",
      period: "2019 — 2022",
      badge: "",
      highlights: [
        { label: "職務", items: ["班級代表", "圍棋社公關"] },
        { label: "證照", items: ["MTA(微軟專業應用國際認證) ", "GLAD(人工智能素養國際認證) "] },
        { label: "競賽", items: ["APCS(大學程式設計先修檢定)", "教育盃圍棋錦標賽團體組"] },
        { label: "活動", items: ["舉辦圍棋社寒訓"] },
      ],
    },
  ],

  projects: [
    {
      id: "fraud-radar",
      title: "騙局雷達 Fraud Radar",
      subtitle: "詐騙辨識系統 — 畢業專題",
      period: "2024 — 2025",
      type: "project" as const,
      tags: ["BERT", "OCR", "NLP", "React", "Python Flask", "Firebase"],
      description: "結合 AI、NLP、OCR 與爬蟲技術，開發多模態詐騙辨識平台。可處理文字、網址、圖片、檔案等輸入，輸出詐騙相似度百分比、關鍵字分析與情緒操控指標，並附帶沉浸式防詐教育小遊戲。",
      highlights: ["BERT fine-tuning 詐騙文字分類", "PaddleOCR + 影像預處理提升辨識率", "CLIP 語意匹配篩選詐騙內容", "Gemini 模型自動萃取關鍵字與詐騙類型", "育秀盃創意獎佳作 / 專題發表優秀組別"],
      image: '/personal_web/projects/fraud-radar.jpg',
      link: "https://drive.google.com/drive/folders/1_G7nwt538wlxG21TaQK8OMSoWe3znhS9?usp=sharing",
    },
    {
      id: "nsc",
      title: "國科會大專生研究計畫",
      subtitle: "計畫編號：114-2813-C-030-031-E",
      period: "2025 — 2026",
      type: "research" as const,
      tags: ["BERT", "CLIP", "PaddleOCR", "TF-IDF", "NLP"],
      description: "結合 AI 整合技術以提升詐騙辨識精確度。針對現有 OCR 辨識不足問題，透過影像預處理（NLM降噪、Otsu閾值化）與 CLIP 語意篩選，改善 BERT 分類模型輸入品質，AUC-ROC 從 0.873 提升至 0.929。",
      highlights: ["AUC-ROC: 0.873 → 0.929", "NLM denoising + Otsu thresholding 預處理", "CLIP 零樣本語意篩選", "指導教授：廖建翔"],
      image: '/personal_web/projects/nsc-research.jpg',
      link: "",
    },
    {
      id: "waf",
      title: "AI 輔助 WAF 攻擊偵測系統",
      subtitle: "研究計畫 — 資訊安全",
      period: "2025",
      type: "research" as const,
      tags: ["XAI", "SHAP", "Machine Learning", "WAF", "Incremental Learning"],
      description: "提出 AI 強化 WAF 框架，結合 TF-IDF / Transformer embedding 與 HTTP 行為特徵，使用 PyTAIL 實作 Human-in-the-Loop 增量學習，並以 XAI/SHAP 提供可解釋規則建議。",
      highlights: ["偵測 SQL Injection、XSS 等變形攻擊", "SHAP 可解釋特徵分析", "Human-in-the-Loop 增量訓練", "自動生成 WAF 規則建議"],
      image: '/personal_web/projects/waf-detection.jpg',
      link: "",
    },
    {
      id: "leave-system",
      title: "學生線上請假系統",
      subtitle: "系統分析與設計 — 課程專題",
      period: "2023",
      type: "project" as const,
      tags: ["PHP", "MySQL", "HTML/CSS", "JavaScript"],
      description: "解決學校缺乏統一請假系統問題，自動帶入課表、Email 通知教師、出席統計及助教帳號等完整功能。",
      highlights: ["自動帶入個人課表", "Email 自動通知機制", "教師 / 學生 / 助教多角色權限", "即時回報對話框"],
      image: '/personal_web/projects/leave-system.jpg',
      link: "",
    },
    {
      id: "gift-roulette",
      title: "轉盤禮物選擇系統",
      subtitle: "進階 Web 程式設計 — 課程專題",
      period: "2023",
      type: "project" as const,
      tags: ["React", "JavaScript"],
      description: "協助使用者從候選禮物清單透過轉盤決策，整合圖片、價格、購買連結，一鍵跳轉購買頁面。",
      highlights: ["React SPA 架構", "動態轉盤動畫", "購物清單篩選功能"],
      image: '/personal_web/projects/gift-roulette.jpg',
      link: "",
    },
  ],

  skills: {
    "程式語言": ["Python", "JavaScript", "TypeScript", "PHP", "Java", "SQL"],
    "前端框架": ["React", "Next.js", "HTML/CSS"],
    "AI / ML": ["BERT", "PaddleOCR", "YOLO", "Scikit-learn", "Pytorch"],
    "後端": ["Flask", "Node.js", "Laravel"],
    "雲端 / 工具": ["AWS Cloud Architecting", "Git", "Excel"],
    "資料庫": ["MySQL", "Firebase"],
  },


 certifications: [
  { name: 'AWS Academy Cloud Architecting', issuer: 'AWS', date: '2024.05', image: '/personal_web/skills/AWS.png', objectPosition: '10% 80%' },
  { name: 'AI 微學程', issuer: '輔仁大學', date: '2025', image: '/personal_web/skills/AI微學程.png', objectPosition: '10% 6%' },
  { name: '雲端服務趨勢學程', issuer: '輔仁大學', date: '進行中', image: '', objectPosition: 'center' },
],
  coursework: [
    { name: '機器學習', tag: 'ML' },
    { name: '大型語言模型（LLM）', tag: 'AI' },
    { name: '網頁設計', tag: 'Web' },
    { name: '雲端應用', tag: 'Cloud' },
    { name: '資料庫管理', tag: 'Data' },
    { name: '系統分析與設計', tag: 'System' },
    { name: '電腦視覺', tag: 'CV' },
    { name: '計算機概論', tag: 'CS' },
    { name: '資料結構', tag: 'CS' },
  ],

  languages: [
  { name: 'Mandarin', level: 'Native' },
  { name: 'English',  level: 'TOEIC 750', scoreImage: '/personal_web/skills/toeic.jpg' },
],

  interests: [
  { emoji: '🎮', name: '電玩' },
  { emoji: '🎸', name: '吉他' },
  { emoji: '🏎️', name: 'F1' },
  { emoji: '🎳', name: '保齡球' },
  { emoji: '⛸️', name: '溜冰' },
  { emoji: '⚫', name: '圍棋' },
  { emoji: '🏸', name: '羽毛球' },
  { emoji: '🏑', name: '曲棍球' },
  { emoji: '🛌', name: '睡覺' },
  { emoji: '🌊', name: '海洋' },
],

  awards: [
    { year: '2025', title: '第 22 屆育秀盃創意獎佳作',                 org: '育秀盃',             category: 'competition', image: '/personal_web/awards/育秀杯.jpg',         link: '' },
    { year: '2025', title: '專題發表優秀組別（第 42 屆）',              org: '輔仁大學資訊管理系', category: 'competition', image: '/personal_web/awards/專題發表.jpg',    link: '' },

    { year: '2025', title: '113 學年度第 2 學期書卷獎',                 org: '輔仁大學',           category: 'school',      image: '/personal_web/awards/書卷獎.png',         link: '' },
    { year: '2025', title: '管理學院學術獎章1',                       org: '輔仁大學',           category: 'school',      image: '/personal_web/awards/獎章1.jpg',    link: '' },
    { year: '2025', title: '管理學院學術獎章2',                       org: '輔仁大學',           category: 'school',      image: '/personal_web/awards/獎章2.jpg',    link: '' },
    { year: '2025', title: '班級代表',                                  org: '輔仁大學資訊管理系', category: 'school',      image: '',                                            link: '' },
    { year: '2023', title: '班級代表',                                  org: '輔仁大學資訊管理系', category: 'school',      image: '',                                            link: '' },
  ] as const,

  contactLinks: [
    { label: 'Email',     value: 'a03111006@gmail.com',  href: 'mailto:a03111006@gmail.com',            icon: 'gmail'  },
    { label: 'Instagram', value: '@mintguesss',           href: 'https://www.instagram.com/ken._.yuuuu/', icon: 'ig'     },
    { label: 'Line',      value: 'mintguesss',            href: 'https://line.me/ti/p/-QSe-xEn3K',       icon: 'line'   },
    { label: 'GitHub',    value: 'github.com/mintguesss', href: 'https://github.com/mintguesss',          icon: 'github' },
  ],

  experience: [
    {
      role: "解題老師",
      company: "文城教育學院",
      period: "2023.11 — 2024.06",
      desc: "負責國三數學及自然科目解題教學",
      tags: ["教學", "數學", "自然"],
    },
    {
      role: "暑期工讀",
      company: "金格食品",
      period: "2024.07 — 2024.09",
      desc: "拜訪客戶、店內事務協助",
      tags: ["業務", "客戶服務"],
    },
    {
      role: "後場人員",
      company: "圓圓堂純米麻糬",
      period: "2024.01 — 2024.02",
      desc: "食材處理、產品製作與封裝出貨",
      tags: ["生產", "食品"],
    },
    {
      role: "時薪人員",
      company: "達美樂披薩",
      period: "2025.01 — 2025.09",
      desc: "內外場事務",
      tags: ["餐飲", "服務"],
    },
  ],
} as const