<template>
  <div class="transparent-animation-wrapper">
    <!-- 
      使用 picture 元素來支援多種格式
      瀏覽器會自動選擇第一個支援的格式
    -->
    <picture>
      <!-- iOS 和現代瀏覽器優先：APNG (透明動畫) -->
      <source 
        v-if="apngSource" 
        :srcset="apngSource" 
        type="image/apng"
      />
      
      <!-- 保底：原始 GIF -->
      <img 
        :src="fallbackImage" 
        :alt="altText"
        class="transparent-animation"
        loading="lazy"
      />
    </picture>
  </div>
</template>

<script setup>
// Props 定義
const props = defineProps({
  // APNG 圖片路徑 (iOS/現代瀏覽器，支援透明動畫)
  apngSource: {
    type: String,
    default: ''
  },
  // 保底 GIF 圖片 (所有瀏覽器都支援)
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
  
  /* 關鍵：讓圖片像背景圖，無法被點擊 */
  pointer-events: none;
  
  /* 確保圖片不會被選取 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  
  /* 移除可能的邊框或外框 */
  border: none;
  outline: none;
  
  /* 確保透明背景正確顯示 */
  background: transparent;
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
