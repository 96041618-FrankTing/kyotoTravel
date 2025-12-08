此專案是一個使用 Vue.js 開發的 PWA 旅遊 App。請幫我實作一個「P2P 語音通話功能」。

請參考目前的專案結構，幫我編寫（或修改）一個 Vue Component (例如 `VoiceCall.vue` 或直接整合在 `App.vue`)。

請依照以下具體需求實作：

### 1. 核心設定與 UI
- **Library**：假設我已經透過 `<script>` CDN 引入 PeerJS，或是透過 npm 安裝了。請在程式碼中使用 `new Peer()`。
- **UI Template**：請設計一個簡潔的通話面板，包含：
  - 顯示「我的 ID」 (綁定變數)。
  - 輸入框讓使用者輸入「對方的 ID」 (使用 `v-model`)。
  - 「撥打 (Call)」與「掛斷 (Hangup)」按鈕 (利用 `v-if` 或 `disabled` 控制狀態)。
  - 狀態顯示文字 (例如：等待連線、通話中...)。
  - 一個隱藏的 `<audio ref="remoteAudio" autoplay></audio>` 用來播放對方聲音。

### 2. Vue 邏輯 (Script)
- **Data/State**：請定義 `myPeerId`, `partnerId`, `callStatus`, `isCallActive` 等響應式變數。
- **Lifecycle (mounted)**：
  - 初始化 Peer 物件。
  - **關鍵設定**：務必設定 `config` 使用 Google 免費 STUN Server 解決無 Public IP 問題：
    `{ config: { 'iceServers': [{ url: 'stun:stun.l.google.com:19302' }] } }`
  - 監聽 `peer.on('open')` 取得並顯示我的 ID。
  - 監聽 `peer.on('call')` 處理來電。
- **Methods**：
  - `makeCall()`：取得麥克風權限 (`navigator.mediaDevices.getUserMedia`)，呼叫 `peer.call()`，並處理 `stream` 事件將對方聲音綁定到 `<audio ref="remoteAudio">`。
  - `answerCall(call)`：當收到來電時，自動或詢問後接聽，同樣取得麥克風並綁定對方聲音串流。
  - `endCall()`：關閉連線 (`call.close()`) 並重置 UI 狀態。

### 3. 特殊優化 (Wake Lock)
- 因為這是手機 PWA，請在通話接通時，呼叫 **Screen Wake Lock API** (`navigator.wakeLock.request('screen')`) 防止螢幕關閉導致斷線。
- 在通話結束 (`endCall`) 時釋放 Wake Lock。
- 請做好瀏覽器相容性的 Try-Catch 檢查。

請提供完整的 Vue Component 程式碼 (`<template>`, `<script>`, `<style>`)。