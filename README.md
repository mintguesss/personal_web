# 🗂️ Ken Huang — Personal Portfolio v2

> Next.js 14 · Tailwind CSS · 多頁架構 · 淺灰底簡約科技風

---

## 📁 專案結構

```
src/
├── app/
│   ├── layout.tsx          # 根 Layout（Navbar + Footer 在這裡）
│   ├── page.tsx            # 首頁 Home（打字機動畫 + 快速導覽）
│   ├── about/page.tsx      # 關於我（自我介紹 + 技能 + 學歷）
│   ├── projects/page.tsx   # 專案 & 研究（可篩選）
│   ├── experience/page.tsx # 學歷 & 工作（時間軸）
│   ├── awards/page.tsx     # 獎項 & 榮譽
│   └── contact/page.tsx    # 聯絡方式
│
├── components/
│   └── layout/
│       ├── Navbar.tsx      # 導覽列（含手機選單）
│       └── Footer.tsx      # 頁尾
│
├── data/
│   └── portfolio.ts        # ⭐ 所有個人資料在這裡
│
├── lib/
│   └── useReveal.ts        # Scroll reveal hook
│
└── styles/
    └── globals.css         # CSS 變數 + 全域樣式
```

---

## ✏️ 更新資料

**只需修改 `src/data/portfolio.ts`**，其餘不用動。

| 想改什麼 | 對應欄位 |
|---------|---------|
| 姓名、Email、電話 | `siteData.name`, `email`, `phone` |
| 首頁打字機文字 | `siteData.taglines[]` |
| 自我介紹段落 | `siteData.bio[]` |
| 學歷 | `siteData.education[]` |
| 新增 / 修改專案 | `siteData.projects[]` |
| 技能清單 | `siteData.skills{}` |
| 獎項榮譽 | `siteData.awards[]` |
| 工作經驗 | `siteData.experience[]` |
| GitHub / LinkedIn | `siteData.links.github`, `.linkedin` |

---

## 🎨 換色

修改 `src/styles/globals.css` 裡的 `:root {}` 變數：

```css
--accent:       #3b5bdb;   /* 主色（目前石板藍）*/
--bg:           #f4f5f7;   /* 背景色 */
--font-display: 'Playfair Display', serif;
--font-body:    'DM Sans', sans-serif;
--font-mono:    'DM Mono', monospace;
```

---

## 🖥️ 本地開發

### 前置需求
- **Node.js 18+**　→ 下載：https://nodejs.org

### 步驟

```bash
# 1. 進入資料夾
cd portfolio-v2

# 2. 安裝套件（只需做一次）
npm install

# 3. 啟動開發伺服器
npm run dev

# 4. 開啟 http://localhost:3000
```

---

## 🌐 部署到 GitHub Pages（完整步驟）

最終網址：`https://mintguesss.github.io/personal_web`

---

### STEP 1 — 確認 next.config.js 設定

打開 `next.config.js`，確認內容是這樣（basePath 要跟你的 repo 名稱一致）：

```js
const nextConfig = {
  output: 'export',
  basePath: '/personal_web',   // ← 你的 repo 名稱
  images: { unoptimized: true },
}
module.exports = nextConfig
```

如果你之後換了 repo 名稱，這裡也要跟著改。

---

### STEP 2 — 確認 .gitignore 存在

根目錄有 `.gitignore` 檔案，內容要有：

```
node_modules/
.next/
out/
.env
.env.local
```

這很重要，少了這個就會把 `node_modules` 推上 GitHub 導致失敗。

---

### STEP 3 — 確認 GitHub Actions 設定

`.github/workflows/deploy.yml` 已包含在專案裡，內容如下，**不需要手動修改**：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]   # 你的主分支名稱

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

---

### STEP 4 — 開啟 GitHub Actions 寫入權限

**只需做一次：**

1. 進入 `https://github.com/mintguesss/personal_web`
2. 點 **Settings** → 左側 **Actions** → **General**
3. 找到 **Workflow permissions**
4. 選 **Read and write permissions**
5. 點 **Save**

---

### STEP 5 — Push 程式碼

```bash
# 第一次（在 portfolio-v2 資料夾內執行）
git init
git add .
git commit -m "feat: portfolio v2 redesign"
git remote add origin https://github.com/mintguesss/personal_web.git
git push -f origin master
```

> **之後每次更新**，只需要：
> ```bash
> git add .
> git commit -m "update: 更新某某內容"
> git push
> ```

---

### STEP 6 — 設定 GitHub Pages

Push 完後，去 GitHub Actions 等 workflow 跑完（綠色 ✅，約 2-3 分鐘）。

完成後：
1. **Settings** → **Pages**
2. **Branch** 選 `gh-pages`，旁邊選 `/ (root)`
3. 點 **Save**

再等 1-2 分鐘，前往：
```
https://mintguesss.github.io/personal_web
```

---

## 🔄 日後更新流程

```
修改 src/data/portfolio.ts
    ↓
git add . && git commit -m "update" && git push
    ↓
GitHub Actions 自動 build + deploy（2-3 分鐘）
    ↓
網站自動更新 ✓
```

---

## ❓ 常見問題

**Q: push 後 Actions 跑失敗？**
A: 去 GitHub → Actions 點進去看錯誤訊息，最常見是 Workflow permissions 沒開（見 STEP 4）。

**Q: 網站打開是 404？**
A: 確認 Settings → Pages 選的是 `gh-pages` 分支，不是 `master`。

**Q: 本地正常但部署後樣式跑掉？**
A: 確認 `next.config.js` 的 `basePath` 跟你的 repo 名稱完全一致。

**Q: 想加照片？**
A: 把照片放到 `public/photo.jpg`，在 `data/portfolio.ts` 加 `photo: '/personal_web/photo.jpg'`，再在 Hero 或 About 元件加 `<img src={siteData.photo} />`。

**Q: 想把主色從藍色換掉？**
A: 改 `globals.css` 裡的 `--accent: #3b5bdb;` 換成任何顏色即可，全站自動更新。

---

## 📄 頁面說明

| 路由 | 頁面 | 內容 |
|-----|-----|-----|
| `/` | Home | 首頁，打字機效果，快速導覽 |
| `/about` | About | 自我介紹、基本資訊、技能、學歷 |
| `/projects` | Projects | 所有專案與研究，可篩選 |
| `/experience` | Experience | 學歷時間軸 + 工作經驗時間軸 |
| `/awards` | Awards | 獎項榮譽，依年份分組 |
| `/contact` | Contact | 聯絡方式 |

---

*Built with Next.js 14 + Tailwind CSS · Deployed on GitHub Pages*


git add .
git commit -m "v2"
git push origin master