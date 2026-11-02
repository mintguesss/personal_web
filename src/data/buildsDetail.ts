export const buildsDetail = {

  'nobook': {
    oneLiner: "手機當錄音端、自己的筆電當推論伺服器，課堂上即時產出逐字稿、段落摘要與能直接照抄的手抄版筆記。ASR 與 LLM 全部在一張 8GB 顯卡上輪流執行，不呼叫任何雲端 API，錄音與逐字稿不離開自己的機器。",
    metadata: [
      { label: "角色", value: "獨立開發、已用於真實課堂" },
      { label: "技術主軸", value: "本地 ASR + LLM · VRAM 資源管理" },
      { label: "平台", value: "手機 PWA + 筆電 GPU（Tailscale）" },
    ],
    links: {
      github: "https://github.com/mintguesss/nobook",
      demo: "",
    },
    highlights: [
      { title: "約 1 秒出字", desc: "說完一句，逐字稿中位數 0.88 秒出現（P95 1.66 秒）", detail: "三小時連續運轉實測：1701 段、RTF 平均 0.236、端到端延遲中位數 0.88 秒，記憶體穩態下幾乎不成長。", color: "#2E6E93" },
      { title: "8GB 塞下兩種模型", desc: "Breeze-ASR-25 + Qwen3 4B / 8B 輪流共用顯卡", detail: "課中用 Qwen3-4B 做段落摘要、課後切到 8B 重新整理；切換約 4.6 秒，ASR 卸載可釋放 1.5GB。", color: "#7048e8" },
      { title: "術語表 +46.4%", desc: "課程術語當 initial_prompt，真實錄音正確率大幅提升", detail: "同樣的比較在合成 TTS 音檔上只有 +6.2%——乾淨音檔有天花板效應，所以驗收一律以真實課堂錄音為準。", color: "#3F8869" },
      { title: "閘門式驗收", desc: "G0–G4 閘門與 109 項自檢全數通過", detail: "環境、即時逐字稿、分段摘要、模型切換、混沌測試各有獨立的驗證腳本，前一關沒過就不進下一個里程碑。", color: "#e67700" },
    ],
    problem: [
      "有些課要邊聽邊在紙上寫筆記，一下課就得交。我需要的不是「課後產一份漂亮的整理」，而是課還在上的時候，就有一份能直接照著抄、而且抄得完的東西。",
      "市面上的轉錄服務大多要把錄音上傳雲端，我不想讓整學期的上課錄音離開自己的電腦。手邊剛好有一台 RTX 4060 筆電，於是決定把 ASR 和 LLM 都搬到本地，挑戰在 8GB 顯卡上把即時轉錄和摘要同時跑起來。",
    ],
    features: [
      { title: "🎙️ 即時逐字稿", summary: "說完一句約 1 秒出現", detail: "手機或平板透過 WebSocket 串流音訊，筆電端經 VAD 切段後送 faster-whisper（Breeze-ASR-25）辨識，逐字稿即時回傳。斷線時前端最多本地累積 60 秒，重連後補送。" },
      { title: "📝 分段整理與手抄版", summary: "按一下就整理，錄音不中斷", detail: "上課中按一次，把「上次按到現在」整理成一則段落筆記；隨時可把目前為止的段落彙整成能直接抄到紙上的手抄版。" },
      { title: "📋 學習單模式", summary: "照固定欄位產出，每欄多給幾則挑", detail: "有些課要填「今天上課內容 / 印象深刻 / 想法 / 反思」這類固定欄位，可以在課程設定裡定義欄位，系統照欄位產出。" },
      { title: "🔍 接地檢查與術語修正", summary: "標出逐字稿找不到依據的內容", detail: "筆記中的數字與專有名詞若在逐字稿裡找不到依據會被標出，避免把模型自己補的東西抄上去交；另用課程術語表與拼音把讀音相近的錯字改回來。" },
      { title: "📄 課後完整筆記與匯出", summary: "切大模型重整、匯出 Word", detail: "下課後切到較大的模型重新整理，同時產出手抄版與完整版；可匯出 Markdown 與使用 Word 原生樣式的 .docx，同一天多段錄音也能合併重產。" },
    ],
    decisions: [
      {
        tab: "逐字稿優先",
        title: "資源衝突時，永遠犧牲摘要保逐字稿",
        body: [
          "逐字稿是核心、摘要是加值。ASR 推論前先檢查 VRAM 餘量，不足就推入延遲佇列而不是直接 OOM；真的遇到 CUDA OOM 時先卸載摘要模型再重試 ASR。llama-server 掛掉或磁碟寫入失敗，都不會中斷逐字稿。",
        ],
        tradeoff: "摘要可能晚一點或暫時降級，但上課內容一句都不會漏。",
      },
      {
        tab: "上課小、課後大",
        title: "用模型生命週期管理換品質",
        body: [
          "8GB 顯卡同時放不下 ASR 和 8B 模型，所以上課時用 4B 做即時段落摘要，下課後卸載 ASR、切到 8B 重新整理。期末總結由段落摘要合成，不直接餵含錯字與口語贅詞的原始逐字稿。",
        ],
        tradeoff: "課中摘要品質略遜，換來即時性與穩定度；完整品質留給課後。",
      },
      {
        tab: "先量測再實作",
        title: "能量的就不要推估",
        body: [
          "所有 VRAM、延遲參數都從實機量測的 bench.json 推導，不寫死在程式裡。過程中抓到好幾個「數字看起來合理、其實量錯對象」的錯誤，例如殘留的 llama-server 汙染整份量測、用 max_tokens 上限推估耗時導致誤差 12 倍，都改成直接量真實情境。",
        ],
        tradeoff: "前期多花時間在量測腳本，但後續的模型選型都有依據。",
      },
      {
        tab: "Windows 工程細節",
        title: "讓 CUDA 在 Windows 上真的能推論",
        body: [
          "CTranslate2 用裸檔名延遲載入 cuBLAS / cuDNN，只加 DLL 目錄時模型載得起來、一推論就崩潰。解法是依相依順序以絕對路徑預載 DLL；另用 Job Object 確保 llama-server 子行程一定跟著主程式結束。",
        ],
      },
    ],
    architecture: [
      "手機 / 平板（PWA，錄音端）",
      "  ↓ WebSocket over Tailscale",
      "筆電（FastAPI 推論伺服器）",
      "  ├─ 音訊管線：ring buffer → silero-vad 切段 → ASR 佇列",
      "  ├─ ASR：faster-whisper（Breeze-ASR-25, int8_float16）",
      "  ├─ 摘要：llama-server 子行程（Qwen3 4B 課中 / 8B 課後）",
      "  │    └─ VRAM 監控、OOM 時卸載摘要模型保 ASR",
      "  ├─ 後處理：術語近似音修正、接地檢查",
      "  └─ 儲存與匯出：SQLite · Markdown · Word（.docx）",
    ],
    techStack: ["Python", "FastAPI", "WebSocket", "faster-whisper / CTranslate2", "silero-vad", "llama.cpp", "Qwen3", "SQLite", "Tailscale", "PWA"],
  },

  'claude-quota': {
    oneLiner: "給 Claude Pro / Max 使用者的 Windows 系統匣小工具：隨時顯示 5 小時與每週用量，以及各自什麼時候重置。數字只取官方來源，取不到就直說，不做推估。",
    metadata: [
      { label: "角色", value: "獨立開發、開源發佈" },
      { label: "技術主軸", value: "桌面 UI · 系統整合" },
      { label: "平台", value: "Windows 10 / 11（單一 exe）" },
    ],
    links: {
      github: "https://github.com/mintguesss/ClaudeQuota",
      demo: "https://github.com/mintguesss/ClaudeQuota/releases/latest",
    },
    highlights: [
      { title: "只用官方數字", desc: "讀官方用量端點，失敗改讀桌面版本機快取", detail: "約每 2 分鐘向官方用量端點取一次；取不到時改讀 Claude 桌面版的本機快取；兩者都沒有就明確顯示讀不到，不自己估算。", color: "#2E6E93" },
      { title: "三種顯示方式", desc: "系統匣圖示、置頂卡片、工作列迷你橫條", detail: "圖示有 6 種樣式、顏色隨用量變紅；卡片顯示兩種額度與重置時間；也能縮成橫條貼在工作列上，各自記住位置。", color: "#7048e8" },
      { title: "不擋路", desc: "Win+D、切換虛擬桌面都不會消失，全螢幕自動讓開", detail: "卡片在顯示桌面與切換虛擬桌面時維持在原位；偵測到全螢幕遊戲或影片時自動隱藏，結束後再回來。", color: "#3F8869" },
      { title: "CI 建置發佈", desc: "exe 由 GitHub Actions 建置並附 SHA-256", detail: "每個版本的 exe 都由 GitHub Actions 從原始碼建置，附上校驗碼，使用者不需要安裝 Python。", color: "#e67700" },
    ],
    problem: [
      "我每天都在用 Claude Code，最常遇到的狀況是做到一半突然被告知「已達用量上限」，而且不知道還要等多久才會重置。官方雖然有用量頁面，但要特地打開才看得到。",
      "所以想要一個不用打開任何東西、瞄一眼工作列就知道還剩多少額度的小工具，順便練習 Windows 桌面程式在多螢幕、虛擬桌面、全螢幕等情境下的行為處理。",
    ],
    features: [
      { title: "📊 用量卡片", summary: "兩種額度、進度條、重置時間", detail: "顯示 5 小時與每週額度的用量與進度條，以及剩多久重置、確切的重置時間（每週額度會標星期幾）。" },
      { title: "🎨 系統匣圖示", summary: "6 種樣式，快用完時變紅", detail: "星芒、已用數字、剩餘數字、進度環、圓餅、雙條六種樣式，在淺色與深色工作列上都清楚；滑鼠停留可看摘要。" },
      { title: "⚡ 手動起算 5 小時視窗", summary: "一鍵送出極小請求開始計時", detail: "可以提早開始 5 小時視窗；另有預設關閉的「重置後自動起算」，開啟前會說明每次約花掉 1–2% 的額度。" },
      { title: "🌐 中英文介面", summary: "跟隨 Windows 語言", detail: "介面依 Windows 語言自動切換中英文，也可以從系統匣選單手動切換；選單內建使用說明。" },
    ],
    decisions: [
      {
        tab: "不猜數字",
        title: "資料來源不可靠時，寧可說讀不到",
        body: [
          "用量端點有速率限制，也可能因 token 過期而失敗。與其根據對話紀錄自行推算用量，不如分層取用官方資料：先查端點、失敗再讀桌面版快取，兩者都沒有就明確顯示讀不到。",
        ],
        tradeoff: "偶爾會看到「讀不到」，但看到的數字一定是官方的。",
      },
      {
        tab: "有代價的功能預設關閉",
        title: "會花額度或影響登入的設定，先說明再詢問",
        body: [
          "「重置後自動起算」每次會用掉約 1–2% 的 5 小時額度；「自動換發過期 token」可能讓正在執行的 Claude Code 要求重新登入。這兩項都預設關閉，開啟前會先說明代價並取得同意。",
        ],
      },
      {
        tab: "隱私",
        title: "只連官方端點、不讀對話內容",
        body: [
          "只讀取本機 OAuth token 查詢自己帳號的用量，並讀對話紀錄的時間戳（不讀內容）推算視窗起點。除了官方端點不連任何地方，沒有遙測。",
        ],
      },
    ],
    architecture: [
      "Windows 系統匣（pystray）",
      "  ├─ 置頂卡片 / 工作列迷你橫條（Tkinter）",
      "  └─ 圖示繪製：Pillow，6 種樣式",
      "資料來源（依序嘗試）：",
      "  ├─ 官方用量端點（約每 2 分鐘）",
      "  ├─ Claude 桌面版本機快取",
      "  └─ 都失敗 → 顯示讀不到",
      "發佈：GitHub Actions 建置 exe + SHA-256",
    ],
    techStack: ["Python", "pystray", "Pillow", "Tkinter", "Win32 API", "GitHub Actions"],
  },

  'clean-contributors': {
    oneLiner: "Claude Code plugin：把 Claude（或任何不想要的帳號）從 GitHub repo 的 Contributors 名單移除，而且不會再跑回來。先診斷原因，再視情況清理 commit 歷史，最後強制 GitHub 重新計算快取。",
    metadata: [
      { label: "角色", value: "獨立開發、開源發佈" },
      { label: "技術主軸", value: "Claude Code Plugin · Git / GitHub API" },
      { label: "平台", value: "Claude Code / Bash / PowerShell" },
    ],
    links: {
      github: "https://github.com/mintguesss/Clean-Contributors",
      demo: "",
    },
    highlights: [
      { title: "三個 Skill 分工", desc: "診斷 → 清理歷史 → 刷新快取", detail: "check-contributors 唯讀診斷；strip-coauthors 改寫歷史移除 Co-authored-by；refresh-contributors-cache 強制 GitHub 重算名單。", color: "#2E6E93" },
      { title: "失敗自動回復", desc: "任何一步出錯就把分支與設定還原", detail: "刷新流程會暫時切換預設分支並改名，任何一步失敗都會回復原狀，commit、tag、開著的 PR 都不受影響。", color: "#7048e8" },
      { title: "不用 Claude Code 也能用", desc: "附獨立的 refresh.sh / refresh.ps1", detail: "刷新步驟只呼叫 GitHub API，不需要 clone；macOS / Linux / Windows 都有對應腳本。", color: "#3F8869" },
      { title: "模擬 GitHub 的測試", desc: "fake gh 注入錯誤，連回復路徑都測", detail: "CI 用假的 gh 指令模擬 GitHub API 並故意注入失敗，確認兩支腳本在各步驟出錯時都能正確回復。", color: "#e67700" },
    ],
    problem: [
      "用 Claude Code 寫程式時，commit 會自動加上 Co-authored-by: Claude，於是 Claude 出現在 repo 的 Contributors 名單上。就算把那幾行刪掉、甚至改寫 commit，GitHub 仍然照樣顯示，因為那份名單是快取，不會因為歷史改變就重新計算。",
      "網路上的建議多半是「等它自己更新」，實際上並不會。查清楚 GitHub 在預設分支變更時才會重算之後，就把整套流程做成 plugin，讓自己和其他人都能一句話解決。",
    ],
    features: [
      { title: "🔍 check-contributors", summary: "唯讀診斷名單為何出現", detail: "判斷原因是歷史裡還有 trailer、帳號本身有 commit，還是單純快取過期，再建議下一步。" },
      { title: "✂️ strip-coauthors", summary: "改寫歷史、移除 trailer", detail: "用 git-filter-repo 只移除符合的 Co-authored-by 行並 force push；執行前先建立備份 bundle，並另外取得明確同意。" },
      { title: "🔄 refresh-contributors-cache", summary: "強制 GitHub 重算名單", detail: "建立暫時分支設為預設、把真正的預設分支改名再改回、最後切回並刪除暫時分支，觸發 GitHub 重新計算。" },
    ],
    decisions: [
      {
        tab: "破壞性操作分級",
        title: "唯讀、可回復、不可回復分開處理",
        body: [
          "診斷完全唯讀；刷新只暫時改設定、失敗會回復；改寫歷史是唯一無法回復的步驟，因此獨立成一個 skill、先備份，並且額外確認一次。",
        ],
      },
      {
        tab: "先修歷史再刷新",
        title: "找到真正原因，而不是直接刷新",
        body: [
          "如果歷史裡還留著 trailer，刷新後帳號一樣會回來。所以流程從診斷開始，確定原因後才決定要不要改寫歷史。",
        ],
        tradeoff: "多一個步驟，但避免刷新完發現沒用。",
      },
    ],
    architecture: [
      "Claude Code Plugin（marketplace 安裝）",
      "  ├─ check-contributors：GitHub API 唯讀查詢",
      "  ├─ strip-coauthors：git-filter-repo + force push（先備份）",
      "  └─ refresh-contributors-cache",
      "       └─ refresh.sh / refresh.ps1（gh CLI，失敗自動回復）",
      "測試：fake gh 模擬 API + 錯誤注入，CI 每次 push 執行",
    ],
    techStack: ["Claude Code Plugin", "Bash", "PowerShell", "GitHub CLI", "GitHub REST API", "git-filter-repo", "GitHub Actions"],
  },

  'personal-assistant': {
    oneLiner: "用筆電鏡頭即時偵測專注、姿勢、情緒與喝水，背景常駐並在適當時機提醒。整合 MediaPipe 關鍵點、YOLOv11 物件偵測與 ViT 情緒辨識多個模型，再用時間窗、多訊號投票與領域知識校正，讓辨識在真實光線與鏡頭下依然可靠。",
    metadata: [
      { label: "角色", value: "獨立開發" },
      { label: "技術主軸", value: "即時電腦視覺 · 多模型整合" },
      { label: "平台", value: "Windows 桌面背景程式" },
    ],
    links: {
      github: "https://github.com/mintguesss/personal-assistant",
      demo: "",
    },
    highlights: [
      { title: "4 套即時偵測", desc: "專注 / 姿勢 / 情緒 / 喝水，單一鏡頭同時運作", detail: "一支筆電鏡頭同時跑四種偵測，彼此共用同一份影像串流，不需多開程式或外接裝置。", color: "#2E6E93" },
      { title: "3 個 ML 模型整合", desc: "MediaPipe 關鍵點、YOLOv11 物件、ViT 情緒辨識", detail: "三個來自不同框架的模型在同一條管線裡協作：MediaPipe 出臉部 / 姿態關鍵點、YOLOv11 偵測嘴邊物體、ViT 判斷情緒。", color: "#7048e8" },
      { title: "模組化可開關", desc: "關閉的功能不載入模型，啟動更快", detail: "每個偵測器是獨立模組，關掉的功能連模型都不會載入，省記憶體也加快啟動。", color: "#3F8869" },
      { title: "背景常駐", desc: "無視窗背景執行，系統通知＋冷卻機制", detail: "可開機自動啟動、無黑窗在背景跑，提醒走 Windows 系統通知並有冷卻避免短時間內連續轟炸。", color: "#e67700" },
    ],
    problem: [
      "我自己長時間用電腦有一堆壞習慣：寫程式寫到忘我就會越坐越前面、臉貼近螢幕，不知不覺駝起背來，還常常一整天幾乎沒喝水。這些事我都知道不好，但光靠自己根本記不住、也撐不久。與其靠意志力，不如讓電腦用鏡頭幫我盯著，在我又離螢幕太近、駝背或太久沒喝水時主動提醒。",
      "另一個動機是想藉這個專案，實際把幾個我還沒用過的電腦視覺技術串起來——MediaPipe 的臉部與姿態關鍵點、YOLOv11 的物件偵測、ViT 的情緒辨識，讓它們在同一支鏡頭、同一條 pipeline 裡一起運作。比起跑單一模型的範例，把這些模型整合成一個真的能背景常駐、會在對的時機提醒我的工具，對我來說更有意思、也更有挑戰。",
    ],
    features: [
      { title: "🎯 專注與番茄鐘", summary: "判斷你有沒有在看螢幕", detail: "透過頭部姿態（yaw / pitch）、閉眼與虹膜視線方向判斷是否看著螢幕，分心或離開過久會提醒；專注滿 25 分鐘（可調）提示休息 5 分鐘。" },
      { title: "🧍 姿勢偵測", summary: "個人化校正後揪出駝背", detail: "啟動時以前幾秒坐姿做個人化基準校正，之後以頭前傾、頭部下沉、身體前傾、左右側傾等多重訊號判定駝背，另偵測臉部過於靠近螢幕。" },
      { title: "💧 喝水提醒", summary: "偵測到喝水就自動重置", detail: "每 15 分鐘（可調）提醒喝水；偵測到喝水動作（手舉到嘴邊且嘴邊有物體）會自動重置計時。" },
      { title: "😊 情緒記錄", summary: "記時段平均、畫每日佔比", detail: "持續辨識七種情緒，每 5 分鐘記錄該時段的平均情緒分佈（而非單一瞬間），並可產生每日情緒佔比長條圖。" },
      { title: "🔔 通知與常駐", summary: "背景常駐、開機自啟、不轟炸", detail: "所有提醒走 Windows 系統通知並有冷卻機制避免轟炸；可背景常駐執行（無黑窗）與開機自動啟動；各偵測功能可獨立開關。" },
    ],
    decisions: [
      {
        tab: "情緒辨識校正",
        title: "不盲信模型輸出，用領域知識校正偏差",
        body: [
          "不直接採用單一瞬間的辨識結果，而是每 5 分鐘記錄「該時段的平均情緒分佈」以稀釋偶發誤判；針對模型已知偏差用 EMOTION_CLASS_WEIGHTS 補償（sad / angry 不敏感 → 加權、happy 過敏 → 降權、fear 易與 surprise 混淆 → 降權）；再用幾何特徵（偵測到嘟嘴 / 嘴角下垂時）額外加倍 sad / angry。",
        ],
        tradeoff: "犧牲即時性換取穩定度，因為提醒場景不需要毫秒級反應。",
      },
      {
        tab: "喝水偵測重定義",
        title: "把偵測目標重新定義成更可靠的代理訊號",
        body: [
          "與其要 YOLO 精準分類「水杯 vs 水瓶」（容易認不出），不如把判斷重新定義為「嘴邊有任何物體 + 手停留在嘴邊一段時間」。因此刻意調低 YOLO 信心門檻（只需偵測到物體、不限類別），並用時間窗過濾雜訊：停留下限濾掉揮手經過、上限濾掉托下巴，放下的瞬間才算喝一次水。",
        ],
        tradeoff: "「重新框定問題比硬調模型更有效」的典型例子。",
      },
      {
        tab: "姿勢多訊號投票",
        title: "基準校正 + 多訊號投票，降低誤報",
        body: [
          "啟動後先用前幾秒坐姿做個人化基準校正，之後用多重訊號（頭前傾 / 頭部下沉 / 身體前傾 / 左右側傾）投票，需同時成立 N 個訊號才判定駝背，而非單一閾值硬切。",
        ],
        tradeoff: "可由使用者調 SLOUCH_SIGNALS_REQUIRED 在靈敏與誤報之間取平衡。",
      },
      {
        tab: "工程化",
        title: "模組化與可配置",
        body: [
          "各偵測器獨立成 module、可單獨開關（關閉者不載入模型以加速啟動）；所有閾值集中於 config.py；提供背景常駐執行（無黑窗）與開機自動啟動。",
        ],
      },
    ],
    architecture: [
      "單一鏡頭 frame",
      "  ├─ 各偵測器獨立 module（可單獨開關，關閉者不載入模型）",
      "  │    ├─ 專注：MediaPipe FaceMesh → yaw/pitch、閉眼、虹膜視線",
      "  │    ├─ 姿勢：MediaPipe Pose → 基準校正 + 多訊號投票",
      "  │    ├─ 喝水：YOLOv11（低信心門檻）+ 手部關鍵點 + 時間窗",
      "  │    └─ 情緒：ViT 七情緒 → 時段平均 + 類別權重校正",
      "  ├─ 所有閾值集中於 config.py",
      "  └─ 輸出：Windows 系統通知（plyer，含冷卻）/ 每日情緒圖（matplotlib）",
    ],
    techStack: ["Python", "OpenCV", "MediaPipe", "Ultralytics YOLOv11", "HuggingFace Transformers (ViT)", "pandas / matplotlib", "plyer"],
  },

  'folio-manager': {
    oneLiner: "給真實使用者的投資與記帳系統，核心是把投資組合的數字算對。以 FIFO 逐筆計算成本、跨幣別損益依交易當時的歷史匯率換算，並在外部股價來源延遲或缺資料時，仍給出可信的報酬率。",
    metadata: [
      { label: "角色", value: "獨立開發、給真實使用者" },
      { label: "技術主軸", value: "金融計算 · 全端開發" },
      { label: "部署", value: "Vercel + Supabase（PWA）" },
    ],
    links: {
      github: "https://github.com/mintguesss/Folio-manager",
      demo: "https://folio-manager-roan.vercel.app/",
    },
    highlights: [
      { title: "FIFO 成本計算", desc: "台美股都以 FIFO 逐筆配對買賣，已實現、未實現損益分開算。", detail: "用 FIFO 把每筆賣出對應到先買進的部位，正確算出該次賣出的成本與已實現損益，剩下的部位再計未實現損益。", color: "#2E6E93" },
      { title: "多幣別", desc: "美股的已實現與未實現損益，全程依交易當時的歷史匯率換算台幣。", detail: "美股的已實現與未實現損益，都依「交易當時」的歷史匯率換算台幣，而不是用現在的匯率回推，報酬率才反映真實成本。", color: "#7048e8" },
      { title: "多人分帳", desc: "多幣別即時換算、份額可不平均，各人只看到自己相關的費用。", detail: "建立分帳群組、邀請成員，自訂每人分擔金額（不限平均），支援多幣別即時換算，每個人只看得到與自己相關的費用。", color: "#3F8869" },
      { title: "自動股價同步", desc: "盤中背景自動同步 Yahoo Finance / TWSE 報價，缺資料可回填。", detail: "盤中背景自動抓 Yahoo Finance / TWSE 報價，頁面載入也會觸發更新，缺匯率的舊資料可一鍵回填。", color: "#e67700" },
    ],
    problem: [
      "會做這個，是因為自己和朋友既要管投資、又要記帳，但手邊的工具總是分散——記帳的不管股票、看持倉的又只做台股，匯率還算得很粗。我想要一個能把投資和記帳收在一起、而且數字真的算對的地方：畢竟記帳算錯頂多漏記一筆，投資組合算錯一個數字，可能就讓人據此做出錯誤的財務判斷。",
      "另一個動機是想藉這個專案認真練後端與真實的多人系統，而不是再寫一個 to-do CRUD：把資料在多人使用下安全隔離、串接會延遲又會缺資料的外部股價與匯率來源、把 FIFO 成本與跨幣別損益依交易當時的歷史匯率正確算出來。做一個給真人用、數字不能錯的系統，對我來說比堆功能更有挑戰。",
    ],
    features: [
      { title: "📈 股票記帳與持倉損益", summary: "台美股分開、損益一目了然", detail: "台股、美股交易分開管理；持倉頁顯示股價漲跌、今日損益、損益與報酬率、均價、股數、市值與成本（台股 TWD、美股 USD 為主並附台幣換算）；成本頁以 accordion 展開每檔的完整交易明細與攤後均價。" },
      { title: "📊 投資組合分析", summary: "市值比例、損益走勢多維度", detail: "持有市值與台美股比例圓餅、含已實現的損益合計、組合市值走勢折線；個股損益走勢支援合計 / 已實現 / 未實現三種模式與 TWD 金額、報酬率切換，可篩日期區間與多檔切換。" },
      { title: "💸 分帳", summary: "多幣別、各人只見自己的份", detail: "建立分帳群組邀請成員，自訂每人分擔金額（不限平均），支援多幣別；明細可依類別 / 付款方式 / 付款者篩選，即時顯示外幣與台幣合計，且各用戶只看到與自己相關的費用。" },
      { title: "🧾 消費統計與對帳", summary: "整合支出、信用卡對帳", detail: "整合出國記帳與分帳的支出，依類別與付款方式彙整；對帳功能依信用卡 / 付款方式列出待對帳項目並可標記。" },
      { title: "✈️ 出國記帳與行程", summary: "多幣別換算、Day-by-Day", detail: "多幣別自動換算台幣、依旅程分組；行程以 Day-by-Day 分頁顯示各天行程、住宿與交通。" },
      { title: "🏦 一般記帳與資產快照", summary: "收支圖表、資產成長", detail: "收入 / 支出 / 轉帳含可自訂分類與付款方式、每月收支與分類圖表；每日輸入各帳戶餘額並繪製資產成長折線。" },
    ],
    decisions: [
      {
        tab: "金融計算正確性",
        title: "FIFO 成本、依歷史匯率換算",
        body: [
          "成本一律用 FIFO 逐筆配對買賣、已實現與未實現損益分離計算；真正麻煩的是美股——已實現與未實現損益都要依交易當時的歷史匯率換算台幣，而非用現價匯率回推，報酬率才反映真實成本。",
        ],
      },
      {
        tab: "不可靠外部資料",
        title: "資料來源不可靠時的補救",
        body: [
          "盤中背景自動同步股價、頁面載入時觸發更新、real-time vs historical 價格偵測；針對缺匯率的舊資料提供「一鍵回填歷史匯率」。重點是「資料來源不可靠時你怎麼補救」，而不是 happy path。",
        ],
      },
      {
        tab: "分帳的份額與權限",
        title: "多幣別、不限平均的份額拆分",
        body: [
          "分帳不預設「平均分攤」：每個人的分擔金額可各自設定，系統即時加總並把多幣別換算成台幣顯示，明細還能依類別 / 付款方式 / 付款者篩選；群組成員各自也只看到與自己相關的費用與份額。",
        ],
      },
    ],
    architecture: [
      "前端：Next.js 16 App Router + TypeScript + Tailwind v4（PWA）",
      "  ├─ 圖表：Recharts",
      "  └─ 部署：Vercel",
      "後端 / 資料：Supabase（Postgres）",
      "  └─ 依使用者 / 群組成員隔離資料列",
      "外部資料源：",
      "  ├─ Yahoo Finance API（美股報價、歷史匯率）",
      "  ├─ TWSE MIS API（台股盤中報價）",
      "  └─ 盤中背景同步 + 頁面載入觸發 + 歷史匯率回填",
    ],
    techStack: ["Next.js 16 (App Router)", "TypeScript", "Tailwind CSS v4", "Supabase", "Recharts", "Vercel", "Yahoo Finance API", "TWSE MIS API"],
  },

  'prompt-miser': {
    oneLiner: "貼上一段 prompt，即可看到它的 token 數與在多個模型上的預估花費，並可一鍵將冗詞與重複指令壓縮。",
    metadata: [
      { label: "角色", value: "獨立開發" },
      { label: "技術主軸", value: "成本分析 · 前端計算" },
      { label: "平台", value: "網頁（PWA）" },
    ],
    links: {
      github: "https://github.com/mintguesss/PromptMiser",
      demo: "https://prompt-miser.vercel.app",
    },
    highlights: [
      { title: "即時成本試算", desc: "貼上 prompt 後即時顯示 token 數與各模型的預估費用，輸入變動時同步更新。", detail: "token 計算完全在瀏覽器端以 js-tiktoken 執行，不呼叫任何付費 API，因此能即時反應，也不會因為反覆試算而產生費用。", color: "#2E6E93" },
      { title: "模型比價", desc: "一次比較多家供應商、數十個模型的價格，可切換每次 / 每 token，並對照訂閱方案。", detail: "同一段 prompt 在各家的單價差異一併列出，也可對照 Claude Pro、ChatGPT Plus 等訂閱方案的費用，判斷走訂閱或 API 較划算。", color: "#e67700" },
      { title: "一鍵壓縮", desc: "刪去冗詞、合併重複指令、精簡範例，並呈現壓縮率與省下的金額。", detail: "壓縮後與原文逐段比對，刪去的部分標示為紅色、保留的內容維持原樣，使刪改範圍清楚可見。", color: "#7048e8" },
      { title: "省錢建議", desc: "依任務類型提供換模型、開啟快取、調整格式等策略，並附上預估省額。", detail: "除了比價，亦評估各模型對該任務的適用性，將建議整理為可實際執行的動作。", color: "#3F8869" },
    ],
    problem: [
      "我越來越常使用各種 AI 模型，卻不太清楚用量為什麼有時候消耗得特別快——同一段內容，換個寫法或換個模型，費用就差了不少，卻很難看出差在哪，也不知道能從哪裡著手節省。",
      "後來也常看到有人在意同樣的事。使用 AI 的人會討論哪個模型比較划算、值不值得為了成本更換方案；對公司或團隊而言，token 成本更是直接列入預算的項目——一段不必要的長 prompt，乘上每天數萬至數十萬次的呼叫，就是一筆可觀的支出，並會隨使用量整體放大。既然成本是普遍在意的問題，卻缺少一個能貼上 prompt 就同時看到花費、壓縮空間與省錢方式的工具，於是我做了 PromptMiser。",
    ],
    features: [
      { title: "📊 成本一覽與排序", summary: "並排列表，可排序、切換單位", detail: "將同一段 prompt 在各模型的費用並排為表格，可依價格排序、切換「每次請求 / 每 token」兩種檢視，方便比較各家的價差。" },
      { title: "🧾 對照訂閱方案", summary: "判斷訂閱或 API 較划算", detail: "單看單價較難有實感，因此另外對照 Claude Pro、ChatGPT Plus 等訂閱方案的費用，作為選擇訂閱或 API 的參考。" },
      { title: "✂️ 壓縮、比對、複製", summary: "確認刪改後再套用", detail: "壓縮結果與原文逐段比對，標示刪去與保留的內容，並附上壓縮率與省下的金額；確認語意無誤後可一鍵複製精簡版。" },
      { title: "🧭 省錢建議清單", summary: "每項標示預估省額", detail: "依任務類型列出換模型、開啟快取、調整輸出格式等策略，每一項均標示預估可省下的金額，作為調整的依據。" },
    ],
    decisions: [
      {
        tab: "前端算 token",
        title: "將 token 計算移至瀏覽器端",
        body: [
          "token 數是最頻繁重算的資訊，使用者每次輸入都希望立即看到最新成本。若每次都經由後端或付費 API，不僅有延遲，也會為了試算本身持續產生費用。因此改以 js-tiktoken 在瀏覽器端計算，輸入變動即時更新，無延遲、亦無 API 費用；後端僅在壓縮與建議等需要進一步處理的環節介入。",
        ],
      },
      {
        tab: "壓縮以比對呈現",
        title: "壓縮結果以差異比對呈現",
        body: [
          "若壓縮後只回傳一段全新的 prompt，使用者難以判斷更動了哪些內容、是否連重要指令一併刪去。因此壓縮結果一律與原文逐段比對，標示刪去與保留的部分，並附上壓縮率與省下的金額，以便確認語意無誤後再行套用。",
        ],
      },
      {
        tab: "建議先分類再給策略",
        title: "先判斷任務類型，再評估合適模型",
        body: [
          "價格最低的模型未必適合當前任務。建議引擎會先判斷 prompt 屬於哪一類任務，再據此提供可執行的策略（更換模型、開啟快取、調整輸出格式），並為每項標示預估省額，使建議貼近實際使用情境。",
        ],
      },
      {
        tab: "部署",
        title: "前端 SPA 與後端函式，同一專案部署",
        body: [
          "將 Vue 打包為靜態 SPA、Python 後端建置為 Serverless Function，兩者置於同一個 Vercel 專案共同部署。前後端同源，免去 CORS 設定，部署流程也較為單純。",
          "前端同時建置為可安裝的 PWA，於手機與電腦皆可直接於瀏覽器使用，並可加入主畫面，無須額外安裝。",
        ],
      },
    ],
    architecture: [
      "手機 / 電腦瀏覽器（PWA）",
      "  ├── 前端即時計算",
      "  │     └── js-tiktoken：token 數與費用（不產生 API 費用）",
      "  ↓ HTTPS（同源）",
      "Vercel（同一專案部署）",
      "  ├── 靜態 SPA：Vue 3 前端",
      "  └── Serverless Function：Python FastAPI 後端",
      "        ├── 壓縮：改寫後與原文比對差異",
      "        └── 建議：判斷任務類型 → 產生省錢策略",
    ],
    techStack: ["Vue 3（Composition API）", "Vite", "TypeScript", "Tailwind CSS v4", "js-tiktoken", "Python FastAPI", "tiktoken", "Vercel"],
  },

} as const
