# BIO MISSION｜生物特務挑戰

給國一學生使用手機或平板操作的生物課堂個人闖關網站。包含 8 項任務、即時計分、速度分、Combo、倒數計時、教師模式、本機進度與排行榜。

## 安裝

需要 Node.js 22.13 以上版本。

```bash
npm install
```

## 啟動

```bash
npm run dev
```

開啟終端顯示的本機網址（預設為 `http://localhost:3000`）。

正式版本檢查：

```bash
npm run build
npm run start
```

## 專案結構

- `app/page.tsx`：遊戲流程、八關互動、計分、進度、排行榜與教師模式
- `app/questions.ts`：獨立題庫與題目資料型別
- `app/config.ts`：教師密碼、遊戲時間、計分參數、儲存鍵值
- `app/globals.css`：視覺設計、動畫與手機版 RWD
- `app/layout.tsx`：網站標題與說明
- `.openai/hosting.json`：Sites 部署設定

## 新增題目

在 `app/questions.ts` 的 `questions` 陣列加入物件，格式包含 `id`、`chapter`、`stage`、`type`、`question`、`options`、`answer`、`explanation`、`points`、`difficulty`。

可用關卡代碼：`science`、`life`、`microscope`、`cell`、`osmosis`、`nutrition`、`enzyme`、`boss`。

## 修改分數

在 `app/config.ts` 修改 `SCORE_CONFIG`：

- `correct`：答對基本分
- `maxSpeed`：最高速度加分
- `combo`：達到指定連勝時的額外分

實際計算集中在 `app/page.tsx` 的 `calculateScore()`，方便日後替換規則。

## 修改教師密碼

在 `app/config.ts` 修改 `TEACHER_PASSWORD`。預設為 `1234`。目前是課堂 MVP 的簡單前端密碼，不適合保護敏感資料。

## 本機資料與後端擴充

學生進度與排行榜目前存於瀏覽器 `localStorage`。排行榜資料已集中為 `Board` 結構，未來可將讀寫函式替換為 Firebase、Supabase 或 Google Sheet API。

## 部署

先執行 `npm run build`。專案已含 Sites 設定，也可依平台選擇 Netlify 或其他支援 Vite／Cloudflare Worker 輸出的服務。
