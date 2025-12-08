我目前的 Vue PWA 專案已經成功利用 PeerJS 實作了語音通話功能。
現在我需要**新增「即時位置分享」功能**，並且要能透過我現有的「開發者面板」變數來開啟或關閉此功能。

請幫我編寫程式碼（可以是一個新的 `LocationMap.vue` Component，或是整合進主頁面的程式碼），需求如下：

### 1. 引入地圖資源 (Leaflet)
- 請使用 **Leaflet.js** (OpenStreetMap) 以避免 API Key 問題。
- 在 component 中引入 Leaflet 的 CSS 與 JS CDN：
  - CSS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
  - JS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`
- **UI 綁定**：在 Template 中建立一個地圖容器 `<div id="map">`。
  - 使用 `v-if="isLocationEnabled"` 來控制地圖的顯示與隱藏（這個變數來自我的開發者面板）。
  - 設定 CSS 確保地圖有高度 (例如 `height: 400px`)。

### 2. 資料傳輸邏輯 (PeerJS DataConnection)
請實作與語音通話**獨立**的資料傳輸邏輯：
- **建立連線**：
  - 當使用者觸發「連線」時，除了原本的語音 `call`，請額外檢查：`if (this.isLocationEnabled) { this.setupDataConnection(partnerId); }`
  - 使用 `peer.connect(partnerId)` 建立資料通道。
- **傳送資料**：
  - 建立一個 function `sendLocation(lat, lng)`，透過 `dataConnection.send({ type: 'location', lat, lng })` 發送 JSON 資料。
- **接收資料**：
  - 監聽 `peer.on('connection')` 接收對方的連線。
  - 監聽 `connection.on('data')`：當收到 `type: 'location'` 的資料時，更新地圖上「對方」的 Marker。

### 3. 開關控制與 GPS 監聽 (整合開發者面板)
假設 `isLocationEnabled` 是一個綁定到開發者面板的 Boolean 變數，請使用 Vue 的 `watch` 來處理副作用：

- **當 `isLocationEnabled` 變為 `true`**：
  - 執行 `navigator.geolocation.watchPosition()` 開始監聽 GPS。
  - 初始化地圖 (`L.map`) 並加入 OpenStreetMap 圖層。
  - 在地圖上新增「我自己」與「對方」的 Markers (建議使用不同顏色或圖示區分)。
  
- **當 `isLocationEnabled` 變為 `false`**：
  - **重要**：執行 `navigator.geolocation.clearWatch()` 停止 GPS 使用以省電。
  - 銷毀地圖實例 (`map.remove()`) 以釋放記憶體。

### 4. 程式碼產出要求
請提供 Vue 的 `<script>` 與 `<template>` 程式碼。
- 重點展示 `watch: { isLocationEnabled(...) }` 的邏輯。
- 展示如何處理 GPS 更新並移動地圖上的 Marker。
- 確保 Leaflet 的 Icon 路徑問題有被處理 (或改用 `L.circleMarker` 避免破圖)。