<template>
  <div class="transparent-animation-wrapper">
    <video
      ref="videoRef"
      class="transparent-animation"
      autoplay
      loop
      muted
      playsinline
      webkit-playsinline
      :poster="posterImage"
      @loadedmetadata="onVideoLoaded"
      @error="onVideoError"
    >
      <!-- iOS Safari 優先：HEVC with alpha channel -->
      <source :src="hevcSource" type='video/quicktime; codecs="hvc1"' />
      
      <!-- Android/Desktop 備用：WebM with alpha channel -->
      <source :src="webmSource" type="video/webm" />
      
      <!-- 最終保底：靜態圖片 -->
      <img :src="fallbackImage" :alt="altText" />
    </video>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Props 定義
const props = defineProps({
  // HEVC 影片路徑 (iOS 專用，支援透明背景)
  hevcSource: {
    type: String,
    required: true
  },
  // WebM 影片路徑 (Android/PC 專用，支援透明背景)
  webmSource: {
    type: String,
    required: true
  },
  // Poster 圖片 (載入前顯示)
  posterImage: {
    type: String,
    default: ''
  },
  // 保底靜態圖片 (瀏覽器不支援影片時)
  fallbackImage: {
    type: String,
    required: true
  },
  // 圖片替代文字
  altText: {
    type: String,
    default: '動畫'
  },
  // 自訂寬度
  width: {
    type: String,
    default: '100%'
  },
  // 自訂高度
  height: {
    type: String,
    default: 'auto'
  }
})

const videoRef = ref(null)

// 影片載入完成
const onVideoLoaded = () => {
  if (videoRef.value) {
    // 確保影片能播放（某些瀏覽器需要手動觸發）
    const playPromise = videoRef.value.play()
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('自動播放被阻止，嘗試靜音播放:', error)
        // 如果自動播放失敗，確保靜音後重試
        videoRef.value.muted = true
        videoRef.value.play()
      })
    }
  }
}

// 影片載入錯誤
const onVideoError = (event) => {
  console.warn('影片載入失敗，將顯示保底圖片:', event)
}

// 生命週期：確保影片在可見時播放
onMounted(() => {
  // 監聽頁面可見性變化，確保切回頁面時影片繼續播放
  const handleVisibilityChange = () => {
    if (!document.hidden && videoRef.value && videoRef.value.paused) {
      videoRef.value.play().catch(() => {
        // 靜默處理播放失敗
      })
    }
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  // 清理函數
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
})
</script>

<style scoped>
.transparent-animation-wrapper {
  display: inline-block;
  position: relative;
  width: v-bind(width);
  height: v-bind(height);
}

.transparent-animation {
  width: 100%;
  height: 100%;
  object-fit: contain;
  
  /* 關鍵：讓影片像背景圖，無法被點擊 */
  pointer-events: none;
  
  /* 確保影片不會被選取 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  
  /* 移除可能的邊框或外框 */
  border: none;
  outline: none;
  
  /* 確保透明背景正確顯示 */
  background: transparent;
}

/* 保底圖片樣式 */
.transparent-animation img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

/* 針對 iOS Safari 的額外優化 */
@supports (-webkit-touch-callout: none) {
  .transparent-animation {
    /* iOS 特定：禁用長按選單 */
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
