# 語音通話功能使用說明

## 功能概述
這個 PWA 應用現在包含了 P2P 語音通話功能，使用 PeerJS 技術實現點對點通話，無需中繼伺服器。

## 主要特性

### ✅ 已實作功能
1. **P2P 語音通話**
   - 使用 PeerJS 實現點對點連線
   - 配置 Google 免費 STUN Server (stun.l.google.com:19302)
   - 支援 NAT 穿透

2. **完整的通話流程**
   - 📞 撥打電話
   - 📲 接聽/拒絕來電
   - ❌ 掛斷通話
   - 📋 複製自己的 ID

3. **智能音訊處理**
   - 回音消除 (echoCancellation)
   - 噪音抑制 (noiseSuppression)
   - 自動增益控制 (autoGainControl)

4. **Wake Lock API**
   - 通話時自動防止螢幕關閉
   - 避免螢幕關閉導致連線中斷
   - 掛斷後自動釋放 Wake Lock

5. **精美的 UI 設計**
   - 浮動通話按鈕（右下角）
   - 可展開/收合的通話面板
   - 即時狀態顯示
   - 來電震動動畫
   - 響應式設計（適配手機/平板）

## 使用方式

### 1. 開啟通話面板
- 點擊右下角的紫色浮動按鈕 📞

### 2. 撥打電話
1. 複製你的 ID（點擊 📋 按鈕）
2. 將你的 ID 分享給對方
3. 取得對方的 ID
4. 在「對方 ID」輸入框中輸入對方的 ID
5. 點擊「📞 撥打」按鈕
6. 等待對方接聽

### 3. 接聽電話
1. 當有來電時，會出現來電提示
2. 點擊「✅ 接聽」接受通話
3. 或點擊「❌ 拒絕」拒絕通話

### 4. 通話中
- 狀態會顯示「🟢 通話中...」
- 浮動按鈕會變成粉紅色並閃爍
- 螢幕會保持開啟（Wake Lock）

### 5. 結束通話
- 點擊「❌ 掛斷」按鈕即可結束通話

## 技術細節

### 使用的技術棧
- **PeerJS**: P2P 連線框架
- **WebRTC**: 瀏覽器原生音視訊 API
- **Vue 3 Composition API**: 響應式狀態管理
- **Wake Lock API**: 防止螢幕關閉
- **MediaDevices API**: 麥克風存取

### STUN Server 配置
```javascript
{
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  }
}
```

### 音訊優化設定
```javascript
{
  audio: {
    echoCancellation: true,    // 回音消除
    noiseSuppression: true,     // 噪音抑制
    autoGainControl: true       // 自動增益
  },
  video: false
}
```

## 瀏覽器兼容性

### ✅ 完全支援
- Chrome/Edge (90+)
- Safari (15+)
- Firefox (88+)

### ⚠️ 部分支援
- Safari (14-): Wake Lock API 不支援
- iOS Safari: 需要 HTTPS 環境

### ❌ 不支援
- Internet Explorer (已停止支援)
- 舊版瀏覽器 (不支援 WebRTC)

## 常見問題

### Q: 為什麼無法連線？
A: 請確認：
1. 雙方都已取得自己的 Peer ID
2. 正確輸入對方的 ID
3. 網路連線正常
4. 瀏覽器已允許麥克風權限

### Q: 為什麼聽不到對方聲音？
A: 請確認：
1. 對方已接聽電話
2. 手機/電腦音量已開啟
3. 對方的麥克風權限已開啟
4. 重新整理頁面後再試

### Q: Wake Lock 是什麼？
A: Wake Lock 可以防止手機螢幕在通話時自動關閉，避免連線中斷。

### Q: 需要付費嗎？
A: 完全免費！使用 Google 免費的 STUN Server 和 PeerJS 免費服務。

## 安全性說明

1. **點對點加密**: WebRTC 預設使用 DTLS-SRTP 加密
2. **無中繼**: 音訊直接在兩端之間傳輸
3. **隱私保護**: 不會儲存任何通話記錄
4. **權限控制**: 需要使用者明確授予麥克風權限

## 未來可能的增強功能

- [ ] 視訊通話支援
- [ ] 群組通話
- [ ] 文字訊息
- [ ] 通話錄音
- [ ] 通話統計資訊
- [ ] 聯絡人清單

## 開發者資訊

### 檔案結構
```
src/
├── components/
│   └── VoiceCall.vue     # 語音通話組件
└── App.vue               # 主應用（已整合 VoiceCall）
```

### 相關依賴
```json
{
  "peerjs": "^1.5.4"
}
```

### 本地開發
```bash
npm install          # 安裝依賴
npm run dev         # 開發模式
npm run build       # 生產建置
```

## 授權
MIT License

---
**注意**: 此功能需要 HTTPS 環境才能在行動裝置上正常運作（本地開發可使用 HTTP）。
