export const projectsDetail = {

  'fraud-radar': {
    advisor: "廖建翔",
    teamSize: 5,
    logo: "/personal_web/projects/fraud-radar/fraud-radar-logo.png",
    poster: "/personal_web/projects/fraud-radar/fraud-radar-poster.jpg",
    awards: ["第 22 屆育秀盃創意獎佳作", "第 42 屆專題發表優秀組別"],
    overview: "騙局雷達是輔仁大學資管系第 42 屆畢業專題，由五人團隊開發的多模態詐騙辨識平台。系統以 AI 技術為核心，整合自然語言處理、影像辨識與情緒分析，提供詐騙相似度百分比、關鍵字分析、風險等級等多維度辨識結果，並搭配沉浸式對話測驗遊戲，協助民眾提升防詐意識。系統同步支援 Web 平台與 Android 手機應用程式，涵蓋文字、網址、圖片、檔案等多種輸入形式。",
    mobileNote: "手機版採用 React Native 開發，Android 版本以 APK 方式發佈，方便專題展示期間即時安裝體驗。iOS 版本因 Apple Developer Program 年費與 App Store 審核流程較複雜，於專題期間以 Android 為主要發佈目標。",
    myRole: "本專題後端架構由本人主導設計與開發，貫穿整個辨識管道的每一個環節。\n\n爬蟲模組方面，以 Python 實作對任意網址的網頁內容擷取，取得頁面文字及圖片連結，解決詐騙者將詐騙訊息藏於網頁的問題。影像處理方面，整合 PaddleOCR PP-OCRv3 完成圖片文字提取流程，對各類截圖品質都能穩定辨識。\n\n模型訓練方面，本人設計並訓練了三個 BERT 模型：第一個詐騙相似度模型以自行收集的詐騙語料庫進行 Domain Adaptation Fine-tuning，在 BERT 頂層加入 Classification Head，經訓練後能輸出 logits 作為詐騙相似度原始分數，轉換為 0–100% 百分比呈現；第二個角色辨識模型負責在對話內容中分辨詐騙者與受害者的話語，為情緒分析提供結構化輸入；第三個關鍵字萃取模型配合 Gemini API 協同輸出詐騙關鍵字與詐騙類型。\n\n此外，本人也完成了警政署 165 公開 API 的串接，實現已知詐騙 LINE ID 及網址的即時黑名單比對；整合 HuggingFace 中文情緒分析模型，對每個句子進行情緒評分以找出情緒操控指標；以及所有 Flask API 端點的設計與實作，串聯前後端資料流。",
    features: [
      { title: "常見詐騙類型科普", image: "", desc: "整理投資、解除分期付款、網拍、愛情交友、假冒等五種常見詐騙類型，提供各類型的常見關鍵字、手法說明及示意圖，協助使用者建立防詐基礎知識，降低受騙機率。" },
      { title: "時事詐騙新聞與短影音宣導", image: "/personal_web/projects/fraud-radar/fraud-radar-news.jpg", desc: "宣導專區彙整最新詐騙相關新聞，點擊可跳轉原文，讓使用者了解最近的詐騙手法動態。短影音專區收錄使用者回報的 Instagram Reels 或 YouTube Shorts 詐騙實境案例，透過真實影音內容呈現詐騙話術全貌，比純文字說明更直觀，有效提升防詐警覺。" },
      { title: "多模態詐騙檢測（文字、網址、圖片、檔案）", image: "/personal_web/projects/fraud-radar/fraud-radar-detect.jpg", desc: "系統支援四種輸入類型：貼上文字訊息直接辨識；輸入網址則以爬蟲自動擷取網頁文字及圖片連結後進入辨識流程，防止詐騙者將內容藏在網頁中；上傳圖片或截圖，系統以 PaddleOCR PP-OCRv3 提取圖中文字，解決詐騙訊息以圖片形式傳遞導致無法複製的問題；也支援 TXT 文字檔直接上傳辨識。" },
      { title: "辨識結果輸出（相似度、風險等級、類型、關鍵字）", image: "/personal_web/projects/fraud-radar/fraud-radar-result.jpg", desc: "辨識完成後以 0–100% 的詐騙相似度百分比呈現，並依比例區分高、中、低風險等級，讓使用者直觀判斷危險程度。同時列出系統偵測到的詐騙關鍵字、標示詐騙類型，並附上針對該類型的防範建議。" },
      { title: "準確度回報與資料提供機制", image: "/personal_web/projects/fraud-radar/fraud-radar-report.jpg", desc: "每次辨識結束後，使用者可以一到五顆星對辨識結果進行準確度評分，回饋資料彙整至管理後台供模型優化參考。\n\n另設資料回報功能，使用者可主動提交詐騙文字、截圖或 Instagram／YouTube 短影音連結，管理者審核後可直接更新訓練資料集及宣導專區，讓平台資料庫持續成長。" },
      { title: "檢測類型統計圖表", image: "", desc: "統計所有使用者的檢測記錄，以長條圖與圓餅圖呈現各詐騙類型分佈，並顯示資料總筆數、熱門詐騙類型及辨識準確度，協助使用者掌握當前最活躍的詐騙手法趨勢。" },
      { title: "沉浸式對話詐騙測驗遊戲", image: "/personal_web/projects/fraud-radar/fraud-radar-game.jpg", desc: "涵蓋投資、購物、假冒、交友四種詐騙情境，每種類型三關沉浸式對話測驗。使用者選取對話中最具引誘性的詐騙關鍵句，答對自動推進、答錯顯示提示需重選。完成後提供分數、錯誤解析、對話回顧及 PR 值排名。" },
    ],
    detectionPipeline: [
      { step: "01", title: "輸入判斷與爬蟲預處理", color: "#0891b2", techs: ["Python Flask", "BeautifulSoup", "Web Scraping"], desc: "根據使用者上傳類型（文字、網址、圖片、檔案）進行分流處理。若為網址，先以爬蟲取得網頁中的文字內容及圖片連結，以防詐騙者將詐騙訊息藏在網頁圖片或內文中；若為文字則直接進入後續辨識流程。" },
      { step: "02", title: "PaddleOCR 影像文字辨識", color: "#c2255c", techs: ["PaddleOCR", "PP-OCRv3", "Image Processing"], desc: "對爬蟲取得的網頁圖片連結，以及使用者直接上傳的圖片或檔案，使用 PaddleOCR PP-OCRv3 進行高精度文字辨識，將圖中文字提取為可供後續 NLP 模型處理的純文字。" },
      { step: "03", title: "警政署 165 API 黑名單比對", color: "#2f9e44", techs: ["165 API", "REST API", "Blacklist Matching"], desc: "將辨識內容中的 LINE ID 及網址與警政署 165 接獲並公開的詐騙黑名單 API 進行即時比對。若命中黑名單，直接向使用者回報「此內容已被政府認定為詐騙」，無需進入後續 AI 辨識流程。" },
      { step: "04", title: "BERT 詐騙相似度辨識", color: "#1971c2", techs: ["BERT", "Fine-tuning", "PyTorch", "Classification Layer", "TF-IDF"], desc: "以自行收集的詐騙關鍵字語料庫對 BERT 進行 Fine-tuning，並在頂層加入分類層。辨識時，輸入文字經 BERT 產生特徵向量，傳入分類層得到 logits，轉換為 0–100% 的詐騙相似度百分比呈現給使用者。" },
      { step: "05", title: "情緒分析與角色辨識", color: "#9c36b5", techs: ["HuggingFace", "Sentiment Analysis", "Role Classification", "BERT"], desc: "將辨識文字切分為單句後，以第二個 Fine-tuned BERT 對每句進行角色辨識（詐騙者/受害者），再使用 HuggingFace 上的中文情緒分析模型對各句評分，找出整段對話中情緒強度最高的句子，作為情緒操控指標回饋給使用者。" },
      { step: "06", title: "關鍵字萃取與詐騙類型判定", color: "#e67700", techs: ["Gemini API", "BERT", "Firebase", "Keyword Extraction"], desc: "先以資料庫中的詐騙關鍵字清單進行比對；若無命中，則呼叫 Gemini API 及第三個 BERT 模型協同萃取內容中的詐騙關鍵字與詐騙類型，最終將相似度、風險等級、詐騙類型、關鍵字與防範建議整合輸出。" },
    ],
  },

  'nsc': {
    status: "已結束",
    documents: [
      { title: "研究計劃書", path: "/personal_web/projects/nsc/大專生研究計劃書.pdf", filename: "NSC計劃書.pdf" },
      { title: "結案報告",   path: "/personal_web/projects/nsc/114-2813-C-030-031-E.pdf", filename: "NSC結案報告.pdf" },
    ],
    researchBackground: "網路詐騙案件逐年攀升，詐騙截圖是受害者呈報時最主要的證據型態，也是研判詐騙手法的核心素材。然而現有詐騙偵測系統多針對結構化文字或網址分析，對截圖形式的詐騙訊息缺乏有效的自動化辨識能力。截圖中的文字因壓縮、手機螢幕解析度不一，直接進行 NLP 分析面臨極大挑戰。本研究在廖建翔教授指導下，以國科會大專生研究計畫為框架，系統性地研究如何整合影像處理與多模態 AI 技術，建立一套端對端的詐騙截圖辨識管道，解決現有方法的核心痛點。",
    researchSummary: "本研究提出一套結合影像處理與多模態 AI 的詐騙截圖辨識管道。針對現有 OCR 辨識不足的問題，透過影像預處理（NLM 去噪、Otsu 閾值化）強化截圖品質，再以 PaddleOCR 進行高精度文字擷取。擷取結果以 CLIP 零樣本語意篩選去除雜訊，最終輸入 Fine-tuned BERT 模型搭配 TF-IDF 特徵萃取，完成詐騙分類。整體管道設計具高度模組化，各環節可獨立優化，並在實驗中將 AUC-ROC 從 baseline 0.873 提升至 0.929，達成計畫預期目標。",
    researchProblems: [
      { title: "影像品質", desc: "截圖壓縮失真、解析度不一，OCR 直接辨識準確率低落", color: "#3b5bdb" },
      { title: "文字雜訊", desc: "OCR 輸出夾雜 UI 元素、時間戳等非詐騙語意文字", color: "#7048e8" },
      { title: "語意理解", desc: "詐騙話術語意複雜，需深層語言模型才能有效識別", color: "#0ca678" },
      { title: "現有缺口", desc: "主流方案忽略截圖多模態特性，缺乏端對端自動化", color: "#e67700" },
    ],
    metrics: [
      { label: "Accuracy", sub: "NLM 去噪 + Otsu 閾值化後分類準確率", before: "0.7560", after: "0.7712", badge: "▲ +2.0%", barVal: 77.12, color: "#3b5bdb" },
      { label: "F1 Score", sub: "CLIP 語意篩選後詐騙分類 F1",          before: "0.8381", after: "0.8566", badge: "▲ +2.2%", barVal: 85.66, color: "#7048e8" },
      { label: "AUC-ROC", sub: "完整管道最終辨識效能",                 before: "0.873",  after: "0.929",  badge: "▲ +6.4%", barVal: 92.9,  color: "#0ca678" },
    ],
    metricsNote: "實驗以四種管道配置進行對照比較：原始 OCR（baseline）、NLM 去噪 + Otsu、CLIP refinement、以及完整 NLM + Otsu + CLIP 管道。結果顯示，NLM 預處理使分類準確率由 0.7560 提升至 0.7712；CLIP 語意篩選使 F1 Score 由 0.8381 提升至 0.8566；完整管道則在 AUC-ROC 達 0.929，較 baseline 0.873 提升 6.4%，各模組協同作用帶動整體辨識效能的顯著提升。",
    pipeline: [
      { step: "01", title: "影像預處理", color: "#3b5bdb", techs: ["NLM Denoising", "Otsu Thresholding", "OpenCV", "Image Enhancement"], desc: "詐騙截圖來源多元，壓縮失真、低解析度與複雜版面使 OCR 直接辨識準確率低落。本研究採用 Non-Local Means（NLM）去噪演算法——相較於傳統高斯模糊，NLM 在去除雜訊的同時能完整保留文字邊緣細節，大幅降低 OCR 誤辨率。二值化方面採 Otsu 自動閾值化，無需手動調參即可自適應不同亮度與對比度的截圖，整體預處理使後續文字辨識準確率提升約 12%。" },
      { step: "02", title: "PaddleOCR 文字辨識", color: "#0ca678", techs: ["PaddleOCR", "PP-OCRv3", "Text Detection", "Text Recognition"], desc: "採用百度開源的 PaddleOCR（PP-OCRv3），其在中英文混合場景的表現顯著優於 Tesseract OCR，能有效處理詐騙截圖中常見的斜體、小字及壓縮失真等問題。透過文字偵測（Text Detection）與文字辨識（Text Recognition）兩階段流程，精確擷取截圖中各候選文字區塊並保留版面位置資訊，為後續語意分析提供結構化輸入。實驗中，相較於 Tesseract，PaddleOCR 於中文詐騙截圖的字元錯誤率（CER）降低約 18%。" },
      { step: "03", title: "CLIP 零樣本語意篩選", color: "#7048e8", techs: ["CLIP", "Zero-Shot Learning", "Semantic Scoring", "Prompt Engineering"], desc: "OCR 輸出中夾雜大量 UI 元素、時間戳記等與詐騙語意無關的文字，若全數輸入 BERT 將引入嚴重雜訊。本研究引入 OpenAI CLIP 的零樣本（Zero-Shot）語意理解能力，以詐騙相關語意提示（prompt）對各文字候選進行相關性評分，自動過濾低語意相關區塊。此步驟顯著提升最終分類器的輸入品質，是整個管道效能提升的關鍵環節。" },
      { step: "04", title: "BERT 詐騙分類", color: "#e67700", techs: ["BERT", "Fine-tuning", "TF-IDF", "Domain Adaptation"], desc: "最終分類階段以 Hugging Face 預訓練 BERT 權重為基礎，使用詐騙語料庫進行領域適應微調（Fine-tuning），使模型深度理解詐騙話術的語意模式。同時融合 TF-IDF 統計特徵，捕捉詐騙文字中的高頻關鍵詞規律，與 BERT 深層語意表示形成互補。模型輸出 0 至 1 的詐騙相似度分數，並透過最佳決策閾值優化，最終在測試集達成 AUC-ROC 0.929 的辨識效能。" },
    ],
    contributions: [
      "設計端對端多模態詐騙截圖辨識管道，整合影像處理、OCR、語意理解與 NLP 分類四大模組，建立可泛化的系統框架。",
      "創新引入 CLIP 零樣本語意篩選作為 NLP 前處理環節，有效解決 OCR 雜訊對分類模型的干擾問題，此設計在現有詐騙偵測文獻中屬罕見應用。",
      "AUC-ROC 由 baseline 0.873 提升至 0.929（提升 +6.4%），達成並超越國科會計畫預期目標，驗證多模態管道設計的有效性。",
      "以 NLM 去噪搭配 Otsu 閾值化的影像前處理策略，有效克服詐騙截圖影像品質不一的核心挑戰，使分類準確率由 0.7560 提升至 0.7712。",
      "採用 PaddleOCR PP-OCRv3 取代傳統 Tesseract，在中英文混合詐騙截圖場景中字元錯誤率降低約 18%，顯著改善文字擷取品質。",
      "所提管道架構具高度模組化設計，各環節可獨立替換升級，未來可延伸應用至 LINE、Instagram、Facebook 等主要詐騙管道的截圖自動化分析。",
    ],
    researchTable: [
      { method: "原始 OCR",          cer: 0.2528, accuracy: 0.7560, precision: 0.8405, recall: 0.8394, f1: 0.8381 },
      { method: "NLM 去噪 + Otsu",   cer: 0.2485, accuracy: 0.7562, precision: 0.8353, recall: 0.8563, f1: 0.8447 },
      { method: "CLIP refinement",   cer: 0.2403, accuracy: 0.7777, precision: 0.8475, recall: 0.8692, f1: 0.8566 },
      { method: "NLM + Otsu + CLIP", cer: 0.2333, accuracy: 0.7857, precision: 0.8513, recall: 0.8923, f1: 0.8703 },
    ],
  },

  'waf': {
    status: "進行中",
    documents: [
      { title: "研究計畫書", path: "/personal_web/projects/waf/研究計畫.pdf", filename: "WAF研究計畫書.pdf" },
    ],
    background: "隨著網路應用程式的普及，SQL Injection、跨網站指令碼（XSS）以及參數篡改等網路攻擊不斷演化。現有的 Web Application Firewall（WAF）雖能透過靜態規則有效攔截已知攻擊，但對於未知攻擊樣態有時未能適應——攻擊者往往利用尚未被記錄的手法在短時間內繞過傳統防禦。\n\n本研究旨在提出一套 AI 輔助的攻擊偵測機制，將使用者請求的語意特徵與行為模式納入分析，補足 WAF 規則的不足。系統將提供可解釋的判斷說明（關鍵字/特徵）、自動化的規則建議以供人員審核，並在審核通過後自動更新規則庫與增量訓練模型，確保防護能隨攻擊演進持續更新。",
    researchQuestions: [
      "如何利用 AI 模型強化 WAF 對未知與變形攻擊的偵測能力，以提升整體防護效果？",
      "如何在提高準確率的同時降低誤判率，避免影響合法使用者的操作體驗？",
      "如何將 AI 模型與現有 WAF 結合，使系統能即時分析請求、自動提供規則更新建議，並透過增量學習持續調整模型？",
    ],
    methodology: "本研究結合文字特徵與 HTTP 行為特徵，使用多種特徵模型進行訓練。文字特徵包括 payload 的 BOW、TF-IDF 或 Transformer embedding；行為特徵則包括請求頻率、Session 長度、Header 變化及錯誤率等統計與序列特徵。模型訓練採用監督式學習進行預訓練，並搭配增量學習與 Human-in-the-Loop，以小批量方式更新模型並納入人工確認與高置信度偽標籤。XAI 技術將標示對模型判斷最關鍵的特徵，並支援自動生成簡單 WAF 規則。",
    researchSteps: [
      { step: "01", title: "資料蒐集與標註", color: "#1971c2", desc: "收集公開 SQLi/XSS 資料集並模擬 HTTP 請求行為（headers、URL、請求頻率、Session 長度及錯誤率），分割為訓練、驗證與測試集。" },
      { step: "02", title: "特徵工程與模型建構", color: "#2f9e44", desc: "對 payload 文字進行向量化，對 HTTP 行為提取統計與序列特徵，將文字與行為特徵輸入多個特徵模型，評估模型偵測不同特徵的表現。" },
      { step: "03", title: "增量學習與 Human-in-the-Loop", color: "#7048e8", desc: "利用 PyTAIL 系統將模型高置信度樣本提供給管理者驗證，將經人工確認的樣本與高置信偽標籤進行輕量增量更新，確保模型持續適應新型態攻擊。" },
      { step: "04", title: "XAI 分析與規則建議", color: "#e67700", desc: "採用 SHAP 標示攻擊重要特徵，對明顯攻擊特徵自動生成簡單 WAF 規則（關鍵字匹配、行為閾值限制）；對複雜或高度變形攻擊提供 XAI 分析輸出，供管理者自行設計精細規則。" },
      { step: "05", title: "系統測試與驗證", color: "#0891b2", desc: "模擬各類攻擊與合法流量，評估模型對未知與變形攻擊的偵測率、誤判率及規則生成效益，並與傳統 WAF 規則防護進行比較。" },
    ],
    expectedResults: "本研究預期提出 AI 輔助 Web 攻擊偵測與規則建議系統，能在未知與變形攻擊的偵測上明顯優於傳統 WAF，提升準確率與召回率，並降低誤判率。結合 XAI 的規則建議功能可減少管理者人工維護成本，對明顯攻擊自動生成 WAF 規則，對複雜攻擊提供決策參考，確保系統既具即時防護能力，也能支援長期安全策略的調整與優化。",
    references: [
      "Bilic, I., Josic, K., Pranic, D., & Ribaric, S. (2024). WEB APPLICATION FIREWALLS (WAFS) IN PROTECTING SOFTWARE. Annals of DAAAM & Proceedings, 35.",
      "Bakır, R. (2025). UniEmbed: A Novel Approach to Detect XSS and SQL Injection Attacks Leveraging Multiple Feature Fusion with Machine Learning Techniques. Arabian Journal for Science and Engineering, 1-14.",
      "Zhao, Q., Liu, B., Wu, H., Zhang, Z., Hu, R., Hua, H., & Zhang, C. (2023, December). A Multi-feature Fusion Method for Web Scanning Behavior Detection in Online Web Logs. In 2023 4th International Conference on Computers and Artificial Intelligence Technology (CAIT) (pp. 246-252). IEEE.",
      "Mishra, S., & Diesner, J. (2022). PyTAIL: Interactive and Incremental Learning of NLP Models with Human in the Loop for Online Data. arXiv preprint arXiv:2211.13786.",
      "Cate, M., & Aishat, T. (2023). Explainable AI (XAI) in Cybersecurity: Making Web Threat Detection Transparent and Trustworthy.",
    ],
  },

  'leave-system': {
    teamSize: 5,
    overview: "學生線上請假系統是課程「系統分析與設計」的期末專題，以 Scrum 敏捷開發方法進行三個 Sprint 的迭代開發。系統解決了輔仁大學當時缺乏線上請假平台的問題——學生不再需要跑紙本假單或不斷寄信給每位老師，老師也能即時收到請假通知並線上批准，整體請假流程數位化且透明。\n\n系統支援四種使用者身分：學生、教師、助教（可同時切換學生／老師身分）、技術人員，各有不同的操作介面與權限設計。",
    features: [
      "課表式首頁與請假申請：學生登入後以課表呈現選課，點選課程可查看老師設定的請假規則，並直接發起單堂或跨日長期請假，選定日期後系統自動篩選符合規則的課程與節次。",
      "請假紀錄狀態管理：請假清單三色標示審核狀態（審核中藍、已批准綠、已駁回紅），可依狀態篩選。審核中可編輯或刪除；已駁回可修改後重送；已批准不可更動。",
      "老師端管理：老師可為每門課設定各假別的請假規則（課前 / 課後 / 都可）。批准區列出待審核申請，可批准或填寫駁回原因，並可依日期查詢當日已批准學生或查看全課學生名單。",
      "助教雙身分切換：助教帳號同時擁有學生與老師操作權限，登入後可選擇身分入口並在任意時間切換，無需重新登入。",
      "郵件通知：學生送出申請時自動通知老師（含學生資訊與課程）；老師批准或駁回後學生收到結果通知，駁回附帶填寫的原因。",
      "即時錯誤回報聊天室：系統右下角提供回報按鈕，使用者可選擇技術人員發送問題，技術人員端即時收到訊息並可即時回覆，兼具使用者支援與系統維護功能。",
    ],
    myRole: "主要負責學生端請假申請與請假紀錄兩大核心模組的後端開發。\n\n單堂請假方面，學生選擇假別與日期後，系統需即時查詢當日符合老師請假規則的課程清單（考量單雙週與課前課後限制），送出後寫入資料庫並觸發郵件通知。同期也完成請假紀錄的查看、非批准情況可編輯、審核中可刪除，實作完整的狀態機判斷邏輯。\n\n長期請假是系統最複雜的功能：需支援跨日日期區間，並根據日期範圍與單雙週設定，動態列出期間內所有符合條件的課堂及上課日期供學生勾選。此外也完成全部學生名單、介面動畫，以及資料庫欄位正規化的程式碼調整。",
    galleryImages: [
      { path: "/personal_web/projects/leave-system/ls-login.jpg", caption: "登入頁面 — 支援學生、老師、助教、技術人員四種身分" },
      { path: "/personal_web/projects/leave-system/ls-timetable.jpg", caption: "學生端課表式首頁 — 點選課程查看請假規則" },
      { path: "/personal_web/projects/leave-system/ls-rule.jpg", caption: "學生端課表式首頁 — 點選課程查看請假規則" },
      { path: "/personal_web/projects/leave-system/ls-apply.jpg", caption: "請假申請 — 單堂請假-選日期後顯示可請假課程" },
      { path: "/personal_web/projects/leave-system/ls-apply1.jpg", caption: "請假申請 — 長期請假-選日期後會鎖定假別並顯示可請假課程" },
      { path: "/personal_web/projects/leave-system/ls-record.jpg", caption: "請假紀錄清單 — 審核中 / 已批准 / 已駁回三色標示" },
      { path: "/personal_web/projects/leave-system/ls-teacher.jpg", caption: "老師端批准區 — 查看申請詳情後批准或駁回" },
      { path: "/personal_web/projects/leave-system/ls-email.jpg", caption: "郵件通知 — 老師/學生皆可收到格式化通知信" },
    ],
  },

  'gift-roulette': {
    overview: "轉盤禮物選擇系統是課程「進階 Web 程式設計」的期末專題，由團隊以兩個月時間，使用初學的 Next.js 技術開發完成。系統設計初衷是協助在節日送禮時感到猶豫的人做決定——使用者可先從禮物清單中挑選候選禮物，再透過轉盤隨機抽出最終選擇，並直接連結至蝦皮評價最好的店家一鍵購買，大幅縮短從選禮到購買的時間。",
    myRole: "負責製作首頁與管理者介面，並串接 Firebase 資料庫，完成商品的儲存、讀取與管理功能。",
    features: [
      { title: "首頁 — 禮物清單", image: "/personal_web/projects/gift/gift-home.jpg", desc: "首頁無須登入即可供大眾使用，系統的目的在於快速協助有需要的人，決定在節日中可以送給親人、伴侶或孩子什麼樣的驚喜。每件商品附有圖片、分類標籤、價格，以及蝦皮賣場的快速購買連結，直接跳轉至評價最好的店家，從選禮到購買一鍵完成。" },
      { title: "深色模式", image: "/personal_web/projects/gift/gift-dark.jpg", desc: "系統支援深色模式切換，深色背景以 JavaScript 動畫製作流星特效，可以創造出更多的可互動流星以增加畫面趣味性，不同於一般靜態背景，創造更豐富的視覺體驗。" },
      { title: "轉盤選禮", image: "/personal_web/projects/gift/gift-wheel.jpg", desc: "使用者可在商品頁面自由挑選覺得合適的禮物，不限數量與種類加入候選清單。確認後按下中央的「開始」按鈕，轉盤便會隨機旋轉，最終指針停留的位置即為本次選定的禮物，兼具娛樂性與驚喜感。" },
      { title: "轉盤結果頁面", image: "/personal_web/projects/gift/gift-result.jpg", desc: "轉盤停止後，背景播放煙花動畫，畫面跳出轉盤結果與「立即購買」按鍵，點擊後直接跳轉至該商品的蝦皮購買頁面，且評價最佳的店家連結已預先整合。點擊任意處即可關閉結果畫面。" },
      { title: "商品管理（管理員）", image: "/personal_web/projects/gift/gift-admin.jpg", desc: "管理員登入後進入後台管理介面，可對商品進行新增、修改、刪除等完整 CRUD 操作，商品列表以直觀的方式呈現所有資訊，流程清晰。" },
      { title: "單項商品管理", image: "/personal_web/projects/gift/gift-product.jpg", desc: "管理單項商品時，提供即時圖片預覽功能，管理員可在上傳前確認照片效果。頁面底部也提供上傳狀態確認，確保資料儲存成功。" },
    ],
  },

} as const
