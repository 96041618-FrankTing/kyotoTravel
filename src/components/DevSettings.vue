<template>
  <div v-if="showSettings" class="dev-settings-overlay" @click="closeSettings">
    <div class="dev-settings-panel" @click.stop>
      <div class="panel-header">
        <h2 class="panel-title">🛠️ 開發者設定</h2>
        <button @click="closeSettings" class="close-btn">&times;</button>
      </div>

      <div class="panel-content">
        <!-- 功能開關 -->
        <section class="settings-section">
          <h3 class="section-title">🎛️ 功能開關</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">📞 語音通話</div>
              <div class="setting-desc">P2P 語音通話功能（包含 Firebase 和 PeerJS）</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="settings.enableVoiceCall" @change="saveSettings">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">🌤️ 天氣資訊</div>
              <div class="setting-desc">顯示即時天氣資訊</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="settings.enableWeather" @change="saveSettings">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">🗺️ 地圖功能</div>
              <div class="setting-desc">Leaflet 地圖顯示</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="settings.enableMap" @change="saveSettings">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </section>

        <!-- 偵錯選項 -->
        <section class="settings-section">
          <h3 class="section-title">🐛 偵錯選項</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">📋 Console 日誌</div>
              <div class="setting-desc">顯示詳細的 console.log</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="settings.enableDebugLog" @change="saveSettings">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">🔔 效能監控</div>
              <div class="setting-desc">顯示 FPS 和記憶體使用</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="settings.enablePerformanceMonitor" @change="saveSettings">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </section>

        <!-- 資訊顯示 -->
        <section class="settings-section">
          <h3 class="section-title">ℹ️ 系統資訊</h3>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">版本</div>
              <div class="info-value">1.0.0</div>
            </div>
            <div class="info-item">
              <div class="info-label">構建日期</div>
              <div class="info-value">{{ buildDate }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">瀏覽器</div>
              <div class="info-value">{{ browserInfo }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">LocalStorage</div>
              <div class="info-value">{{ storageUsed }}</div>
            </div>
          </div>
        </section>

        <!-- 危險操作 -->
        <section class="settings-section danger-section">
          <h3 class="section-title">⚠️ 危險操作</h3>
          
          <button @click="clearAllData" class="danger-btn">
            🗑️ 清除所有本地資料
          </button>
          <p class="danger-hint">將清除所有 LocalStorage 資料，包括語音通話聯絡人</p>

          <button @click="resetSettings" class="danger-btn">
            🔄 重置開發者設定
          </button>
          <p class="danger-hint">恢復所有功能為預設啟用狀態</p>
        </section>
      </div>

      <div class="panel-footer">
        <button @click="closeSettings" class="footer-btn primary">
          ✓ 完成
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'

export default {
  name: 'DevSettings',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'settings-changed'],
  setup(props, { emit }) {
    const showSettings = ref(props.show)
    const settings = ref({
      enableVoiceCall: true,
      enableWeather: true,
      enableMap: true,
      enableDebugLog: false,
      enablePerformanceMonitor: false
    })

    // 載入設定
    const loadSettings = () => {
      const saved = localStorage.getItem('devSettings')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          settings.value = { ...settings.value, ...parsed }
        } catch (error) {
          console.error('Failed to load dev settings:', error)
        }
      }
    }

    // 儲存設定
    const saveSettings = () => {
      localStorage.setItem('devSettings', JSON.stringify(settings.value))
      emit('settings-changed', settings.value)
      console.log('✅ Dev settings saved:', settings.value)
    }

    // 關閉面板
    const closeSettings = () => {
      emit('close')
    }

    // 清除所有資料
    const clearAllData = () => {
      if (confirm('⚠️ 確定要清除所有本地資料嗎？\n\n這將清除:\n• 語音通話聯絡人\n• 個人資訊\n• 所有設定\n\n此操作無法復原!')) {
        const devSettings = localStorage.getItem('devSettings')
        localStorage.clear()
        if (devSettings) {
          localStorage.setItem('devSettings', devSettings)
        }
        alert('✅ 已清除所有資料（保留開發者設定）')
        location.reload()
      }
    }

    // 重置設定
    const resetSettings = () => {
      if (confirm('確定要重置所有開發者設定嗎？')) {
        settings.value = {
          enableVoiceCall: true,
          enableWeather: true,
          enableMap: true,
          enableDebugLog: false,
          enablePerformanceMonitor: false
        }
        saveSettings()
        alert('✅ 已重置為預設設定')
      }
    }

    // 系統資訊
    const buildDate = computed(() => {
      return new Date().toLocaleDateString('zh-TW')
    })

    const browserInfo = computed(() => {
      const ua = navigator.userAgent
      if (ua.includes('Chrome')) return 'Chrome'
      if (ua.includes('Safari')) return 'Safari'
      if (ua.includes('Firefox')) return 'Firefox'
      return 'Unknown'
    })

    const storageUsed = computed(() => {
      let total = 0
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length
        }
      }
      return `${(total / 1024).toFixed(2)} KB`
    })

    onMounted(() => {
      loadSettings()
    })

    // 監聽 props 變化
    const updateShow = (newVal) => {
      showSettings.value = newVal
    }

    return {
      showSettings,
      settings,
      saveSettings,
      closeSettings,
      clearAllData,
      resetSettings,
      buildDate,
      browserInfo,
      storageUsed,
      updateShow
    }
  },
  watch: {
    show(newVal) {
      this.updateShow(newVal)
    }
  }
}
</script>

<style scoped>
.dev-settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dev-settings-panel {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 2px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.panel-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.settings-section {
  margin-bottom: 32px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 12px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-info {
  flex: 1;
}

.setting-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.setting-desc {
  font-size: 13px;
  color: #6b7280;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 32px;
  margin-left: 16px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.3s;
  border-radius: 32px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .toggle-slider {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* 資訊網格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.info-item {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.info-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* 危險區域 */
.danger-section {
  background: #fef2f2;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #fecaca;
}

.danger-btn {
  width: 100%;
  padding: 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.danger-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.danger-hint {
  font-size: 12px;
  color: #991b1b;
  margin: 0 0 16px 0;
}

.danger-hint:last-child {
  margin-bottom: 0;
}

/* Footer */
.panel-footer {
  padding: 16px 24px;
  border-top: 2px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 16px 16px;
}

.footer-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.footer-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.footer-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 響應式設計 */
@media (max-width: 640px) {
  .dev-settings-panel {
    max-height: 95vh;
  }

  .panel-header {
    padding: 16px 20px;
  }

  .panel-title {
    font-size: 18px;
  }

  .panel-content {
    padding: 20px;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .toggle-switch {
    margin-left: 0;
    margin-top: 12px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
