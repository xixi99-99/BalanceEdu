# 衡學管理平台 BalanceEdu

以 React、Vite、TypeScript 與 Tailwind CSS 建立的補習班管理前端。介面採中性 slate 企業風格，包含桌面側欄、平板收合導覽與手機底部導覽。

## 功能

- 四種示範角色與前端權限導覽：系統管理員、行政人員、教師、接送人員
- 營運儀表板、學生、點名、補課、財務、教職員、課表、班級、接送、出勤紀錄、電子聯絡簿與系統設定
- Zustand 模擬資料狀態與互動式新增／更新操作
- React Hook Form + Zod 表單驗證
- 完整 RWD、行動版卡片、狀態 Badge、Toast、Empty／Loading 設計
- TypeScript strict mode，未使用 `any`

## 執行

```bash
npm install
npm run dev
```

開啟 Vite 顯示的本機網址。登入頁已預填示範帳號與密碼，可直接切換角色登入。

## 驗證

```bash
npm run build
npm run lint
```

目前資料皆為前端模擬，資料結構與 stores 已分層，方便後續替換為 REST API。
