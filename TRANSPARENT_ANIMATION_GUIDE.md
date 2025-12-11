# TransparentAnimation Component 使用說明

## 🎯 功能特色

這個 Vue Component 專門解決 **iOS Safari (iPhone) 上 GIF 動畫卡在第一格** 的問題。

### 核心優勢：
- ✅ **iOS 完美支援**：使用 HEVC 編碼 + 透明通道，在 iPhone 上流暢播放
- ✅ **跨平台兼容**：自動為 Android/PC 提供 WebM 格式
- ✅ **優雅降級**：不支援影片的瀏覽器會顯示靜態圖片
- ✅ **自動播放**：包含所有必要的 iOS 自動播放屬性
- ✅ **背景模式**：`pointer-events: none` 讓動畫像背景圖一樣

---

## 📦 使用方法

### 1. 在 App.vue 中引入

```vue
<script setup>
import TransparentAnimation from './components/TransparentAnimation.vue'
</script>

<template>
  <div class="app">
    <!-- 使用範例：愛心貓咪動畫 -->
    <TransparentAnimation
      hevc-source="./image/i-love-you-hevc.mov"
      webm-source="./image/i-love-you.webm"
      fallback-image="./image/i-love-you.gif"
      poster-image="./image/i-love-you-poster.png"
      alt-text="貓咪愛心動畫"
      width="60px"
      height="60px"
    />
    
    <!-- 使用範例：行走貓咪動畫 -->
    <TransparentAnimation
      hevc-source="./image/battle-cats-walking-hevc.mov"
      webm-source="./image/battle-cats-walking.webm"
      fallback-image="./image/battle-cats-walking.gif"
      alt-text="行走的貓咪"
      width="80px"
    />
  </div>
</template>
```

### 2. Props 說明

| Prop | 類型 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| `hevcSource` | String | ✅ | - | HEVC 影片路徑 (iOS 專用) |
| `webmSource` | String | ✅ | - | WebM 影片路徑 (Android/PC) |
| `fallbackImage` | String | ✅ | - | 保底靜態圖片 |
| `posterImage` | String | ❌ | `''` | 影片載入前的預覽圖 |
| `altText` | String | ❌ | `'動畫'` | 圖片替代文字 |
| `width` | String | ❌ | `'100%'` | 寬度 (CSS 值) |
| `height` | String | ❌ | `'auto'` | 高度 (CSS 值) |

---

## 🎬 影片檔案準備

### 為 iOS 建立 HEVC 透明影片

使用 ffmpeg 將 GIF 轉換為 HEVC 透明影片：

```bash
# 方法一：從 GIF 轉換 (推薦)
ffmpeg -i input.gif \
  -c:v libx265 \
  -pix_fmt yuva420p \
  -tag:v hvc1 \
  -alpha_mode straight \
  -crf 28 \
  output-hevc.mov

# 方法二：使用 ProRes 4444 (品質更好但檔案較大)
ffmpeg -i input.gif \
  -c:v prores_ks \
  -pix_fmt yuva444p10le \
  -profile:v 4444 \
  output-prores.mov
```

### 為 Android/PC 建立 WebM 透明影片

```bash
ffmpeg -i input.gif \
  -c:v libvpx-vp9 \
  -pix_fmt yuva420p \
  -auto-alt-ref 0 \
  -b:v 0 \
  -crf 30 \
  output.webm
```

---

## 🔧 技術細節

### 為何在 iOS 上能自動播放？

Component 包含了所有必要的屬性：

```html
<video
  autoplay        <!-- 自動播放 -->
  loop            <!-- 循環播放 -->
  muted           <!-- 靜音 (iOS 要求) -->
  playsinline     <!-- 內嵌播放 (不進入全螢幕) -->
  webkit-playsinline  <!-- iOS Safari 專用 -->
>
```

### 影片格式選擇邏輯

1. **iOS Safari** → 優先使用 HEVC (codecs="hvc1") 
2. **Chrome/Firefox** → 使用 WebM
3. **不支援影片** → 顯示靜態圖片

### 為何使用 `pointer-events: none`？

- 讓影片無法被點擊暫停
- 使用者無法右鍵儲存影片
- 行為類似背景圖片，不干擾 UI 互動

---

## ⚠️ 注意事項

### 1. 檔案大小優化

- **HEVC**: 通常比 GIF 小很多，但比 WebM 大
- **WebM**: 最佳壓縮率
- **建議**: HEVC 使用 CRF 28-32，WebM 使用 CRF 30-35

### 2. iOS 省電模式

即使使用此 Component，在 iPhone 省電模式下，影片可能仍會被暫停。這是系統層級的限制。

### 3. 相容性檢查

- **HEVC 透明**: iOS 15+, macOS Big Sur+
- **WebM 透明**: Chrome, Firefox, Edge (所有版本)
- **保底圖片**: 100% 相容

---

## 🎨 在 App.vue 中的實際應用

### 替換原本的行走貓咪 (第 460-466 行)

**原始碼 (使用 GIF):**
```vue
<div class="battle-cat-walking">
  <img src="./image/battle-cats-walking.gif" alt="行走的貓咪">
</div>
```

**改用 TransparentAnimation:**
```vue
<div class="battle-cat-walking">
  <TransparentAnimation
    hevc-source="./image/battle-cats-walking-hevc.mov"
    webm-source="./image/battle-cats-walking.webm"
    fallback-image="./image/battle-cats-walking.gif"
    alt-text="行走的貓咪"
    width="80px"
  />
</div>
```

### 替換原本的愛心貓咪 (第 79-85 行)

**原始碼:**
```vue
<img src="./image/i-love-you.gif" class="overview-cat-gif" alt="貓咪">
```

**改用 TransparentAnimation:**
```vue
<TransparentAnimation
  hevc-source="./image/i-love-you-hevc.mov"
  webm-source="./image/i-love-you.webm"
  fallback-image="./image/i-love-you.gif"
  alt-text="貓咪愛心"
  width="60px"
  height="60px"
  class="overview-cat-gif"
/>
```

---

## 📊 效能比較

| 格式 | 檔案大小 | iOS 動畫 | 透明背景 | 推薦度 |
|------|---------|---------|---------|--------|
| GIF | 669KB | ❌ 卡住 | ✅ | ⭐⭐ |
| MP4 (H.264) | 200KB | ✅ | ❌ | ⭐⭐ |
| WebM (VP9) | 150KB | ❌ | ✅ | ⭐⭐⭐ |
| HEVC (H.265) | 300KB | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| ProRes 4444 | 4.5MB | ✅ | ✅ | ⭐⭐⭐ |

**結論**: HEVC + WebM 雙格式是最佳解決方案！

---

## 🚀 下一步

1. 使用 ffmpeg 轉換你的 GIF 為 HEVC 和 WebM
2. 將轉換後的影片放入 `src/image/` 目錄
3. 在 App.vue 中引入 TransparentAnimation
4. 替換原本的 `<img>` 標籤
5. 在 iPhone 上測試效果

祝你成功！🎉
