<template>
  <!-- 主設定面板 -->
  <div v-if="showSettings" class="dev-settings-overlay" @click="closeSettings">
    <div class="dev-settings-panel" @click.stop>
      <div class="panel-header">
        <h2 class="panel-title">🛠️ 開發者設定</h2>
        <button @click="closeSettings" class="close-btn">&times;</button>
      </div>

      <div class="panel-content">
        <!-- 用戶資訊設定 -->
        <section class="settings-section user-info-section">
          <h3 class="section-title">👤 用戶資訊</h3>
          
          <div class="user-info-form">
            <div class="form-group">
              <label class="form-label">顯示名稱</label>
              <input 
                v-model="userInfo.displayName" 
                @input="saveUserInfo"
                type="text" 
                class="form-input" 
                placeholder="請輸入您的名稱"
                maxlength="20"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">選擇 Emoji</label>
              <div class="emoji-grid">
                <button
                  v-for="emoji in emojiList"
                  :key="emoji"
                  @click="selectEmoji(emoji)"
                  class="emoji-btn"
                  :class="{ active: userInfo.emoji === emoji }"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>
            
            <div class="user-preview">
              <div class="preview-label">預覽：</div>
              <div class="preview-display">
                <span class="preview-emoji">{{ userInfo.emoji }}</span>
                <span class="preview-name">{{ userInfo.displayName || '未設定' }}</span>
              </div>
            </div>
          </div>
        </section>

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
              <div class="setting-name">🗺️ 地圖顯示</div>
              <div class="setting-desc">Day1~Day7 的 Leaflet 地圖顯示功能</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="settings.enableMap" @change="saveSettings">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">📍 即時位置分享</div>
              <div class="setting-desc">透過 PeerJS 分享 GPS 位置（需啟用定位權限）</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="settings.enableLocationShare" @change="saveSettings">
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
          
          <!-- ⭐ 新增：位置分享診斷按鈕 -->
          <div class="setting-item diagnostic-btn-wrapper">
            <button @click="openDiagnosticPanel" class="diagnostic-btn">
              📊 查看位置分享診斷日誌
            </button>
            <p class="setting-desc">查看位置分享事件記錄和系統狀態</p>
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

        <!-- ⭐ 新增：位置分享診斷 -->
        <section class="settings-section" v-if="settings.enableLocationShare">
          <h3 class="section-title">📊 位置分享診斷</h3>
          
          <div class="diagnostic-btn-wrapper">
            <button @click="openDiagnosticPanel" class="diagnostic-btn">
              🔍 查看診斷日誌
            </button>
            <p class="diagnostic-hint">
              查看位置分享的詳細事件記錄，用於診斷背景更新問題
            </p>
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
  
  <!-- ⭐ 診斷面板 -->
  <div v-if="showDiagnosticPanel" class="diagnostic-overlay" @click="closeDiagnosticPanel">
    <div class="diagnostic-panel" @click.stop>
      <div class="panel-header">
        <h2 class="panel-title">📊 位置分享診斷</h2>
        <button @click="closeDiagnosticPanel" class="close-btn">&times;</button>
      </div>

      <div class="panel-content diagnostic-content">
        <!-- 當前狀態 -->
        <section class="diagnostic-section">
          <h3 class="section-title">💾 當前狀態</h3>
          <div class="status-grid">
            <div class="status-item">
              <div class="status-label">分享狀態</div>
              <div class="status-value" :class="{ active: getDiagnosticInfo().isSharingLocation }">
                {{ getDiagnosticInfo().isSharingLocation ? '✅ 進行中' : '❌ 未開始' }}
              </div>
            </div>
            <div class="status-item">
              <div class="status-label">開始時間</div>
              <div class="status-value">{{ getDiagnosticInfo().sharingStartTime }}</div>
            </div>
            <div class="status-item">
              <div class="status-label">持續時間</div>
              <div class="status-value">{{ getDiagnosticInfo().sharingDuration }}</div>
            </div>
            <div class="status-item">
              <div class="status-label">日誌數量</div>
              <div class="status-value">{{ getDiagnosticInfo().logs.length }} 條</div>
            </div>
          </div>
        </section>

        <!-- 事件日誌 -->
        <section class="diagnostic-section">
          <h3 class="section-title">📜 事件日誌 (最近 20 條)</h3>
          <div class="logs-container">
            <div v-if="getDiagnosticInfo().logs.length === 0" class="no-logs">
              暫無日誌記錄
            </div>
            <div 
              v-for="(log, index) in getDiagnosticInfo().logs" 
              :key="index" 
              class="log-entry"
              :class="getLogClass(log.event)"
            >
              <div class="log-header">
                <span class="log-icon">{{ getLogIcon(log.event) }}</span>
                <span class="log-event">{{ log.event }}</span>
                <span class="log-time">{{ log.time }}</span>
              </div>
              <div class="log-details" v-if="Object.keys(log.details).length > 0">
                <div v-for="(value, key) in log.details" :key="key" class="log-detail-item">
                  <span class="detail-key">{{ key }}:</span>
                  <span class="detail-value">{{ formatDetailValue(value) }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 操作按鈕 -->
        <section class="diagnostic-actions">
          <button @click="exportLogs" class="action-btn primary">
            📋 匯出日誌
          </button>
          <button @click="clearDiagnosticLogs" class="action-btn danger">
            🗑️ 清除日誌
          </button>
        </section>
      </div>

      <div class="panel-footer">
        <button @click="closeDiagnosticPanel" class="footer-btn">
          關閉
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
  emits: ['close', 'settings-changed', 'user-info-changed'],
  setup(props, { emit }) {
    const showSettings = ref(props.show)
    const showDiagnosticPanel = ref(false)  // ⭐ 新增診斷面板狀態
    
    const settings = ref({
      enableVoiceCall: true,
      enableMap: true,
      enableLocationShare: false,
      enableDebugLog: false,
      enablePerformanceMonitor: false
    })
    
    // 用戶資訊
    const userInfo = ref({
      displayName: '',
      emoji: '👤'
    })
    
    // Emoji 列表
    const emojiList = ['👤', '😀', '😎', '🤠', '👨']

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
    
    // 載入用戶資訊
    const loadUserInfo = () => {
      const savedName = localStorage.getItem('myDisplayName')
      const savedEmoji = localStorage.getItem('myEmoji')
      
      if (savedName) userInfo.value.displayName = savedName
      if (savedEmoji) userInfo.value.emoji = savedEmoji
      
      console.log('📱 User info loaded:', userInfo.value)
    }

    // 儲存設定
    const saveSettings = () => {
      localStorage.setItem('devSettings', JSON.stringify(settings.value))
      emit('settings-changed', settings.value)
      console.log('✅ Dev settings saved:', settings.value)
    }
    
    // 儲存用戶資訊
    const saveUserInfo = () => {
      localStorage.setItem('myDisplayName', userInfo.value.displayName)
      localStorage.setItem('myEmoji', userInfo.value.emoji)
      emit('user-info-changed', userInfo.value)
      console.log('✅ User info saved:', userInfo.value)
    }
    
    // 選擇 Emoji
    const selectEmoji = (emoji) => {
      userInfo.value.emoji = emoji
      saveUserInfo()
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
          enableMap: true,
          enableLocationShare: false,
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
      loadUserInfo()
    })

    // 監聽 props 變化
    const updateShow = (newVal) => {
      showSettings.value = newVal
    }
    
    // ⭐ 新增：打開診斷面板
    const openDiagnosticPanel = () => {
      showDiagnosticPanel.value = true
    }
    
    // ⭐ 新增：關閉診斷面板
    const closeDiagnosticPanel = () => {
      showDiagnosticPanel.value = false
    }
    
    // ⭐ 新增：獲取診斷資訊
    const getDiagnosticInfo = () => {
      const logs = getLogs()
      const isSharingLocation = localStorage.getItem('isSharingLocation') === 'true'
      const sharingStartTime = localStorage.getItem('sharingStartTime')
      
      let sharingDuration = '未開始'
      if (isSharingLocation && sharingStartTime) {
        const elapsed = Date.now() - parseInt(sharingStartTime)
        const hours = Math.floor(elapsed / 1000 / 60 / 60)
        const minutes = Math.floor((elapsed / 1000 / 60) % 60)
        sharingDuration = hours > 0 ? `${hours}小時${minutes}分鐘` : `${minutes}分鐘`
      }
      
      return {
        isSharingLocation,
        sharingDuration,
        sharingStartTime: sharingStartTime ? new Date(parseInt(sharingStartTime)).toLocaleString('zh-TW') : '未開始',
        logs
      }
    }
    
    // ⭐ 新增：獲取日誌（從 localStorage）
    const getLogs = () => {
      try {
        const savedLogs = localStorage.getItem('locationShareLogs')
        if (savedLogs) {
          const logs = JSON.parse(savedLogs)
          return logs.reverse().slice(0, 20) // 最新的 20 條
        }
      } catch (e) {
        console.error('❌ Failed to get logs:', e)
      }
      return []
    }
    
    // ⭐ 新增：清除日誌
    const clearDiagnosticLogs = () => {
      if (confirm('確定要清除所有位置分享日誌嗎？')) {
        localStorage.removeItem('locationShareLogs')
        alert('✅ 日誌已清除')
        closeDiagnosticPanel()
      }
    }
    
    // ⭐ 新增：匯出日誌
    const exportLogs = () => {
      const info = getDiagnosticInfo()
      const text = `📊 位置分享診斷報告
生成時間：${new Date().toLocaleString('zh-TW')}

━━━━━━━━━━━━━━━━━━━━━━━━━
💾 當前狀態
━━━━━━━━━━━━━━━━━━━━━━━━━
分享狀態：${info.isSharingLocation ? '✅ 進行中' : '❌ 未開始'}
開始時間：${info.sharingStartTime}
持續時間：${info.sharingDuration}

━━━━━━━━━━━━━━━━━━━━━━━━━
📜 事件日誌 (最近 20 條)
━━━━━━━━━━━━━━━━━━━━━━━━━
${info.logs.map(log => `[${log.time}] ${log.event}
${JSON.stringify(log.details, null, 2)}`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━
ℹ️ 系統資訊
━━━━━━━━━━━━━━━━━━━━━━━━━
User Agent: ${navigator.userAgent}
Platform: ${navigator.platform}
LocalStorage: ${storageUsed.value}
`
      
      // 複製到剪貼簿
      navigator.clipboard.writeText(text).then(() => {
        alert('✅ 診斷報告已複製到剪貼簿！')
      }).catch(() => {
        // 降級方案：下載為文件
        const blob = new Blob([text], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `location-diagnostic-${Date.now()}.txt`
        a.click()
        URL.revokeObjectURL(url)
        alert('✅ 診斷報告已下載！')
      })
    }
    
    // ⭐ 新增：獲取日誌圖示
    const getLogIcon = (event) => {
      const iconMap = {
        '開始分享位置': '🚀',
        '停止分享位置': '🛑',
        '首次獲取位置': '📍',
        '上傳位置': '✅',
        '上傳位置失敗': '❌',
        '切換到背景': '📱',
        '返回前景': '📱',
        '恢復分享': '🔄',
        '註冊 Background Fetch': '🔄',
        '定位錯誤': '⚠️',
        '錯誤': '❌'
      }
      return iconMap[event] || '📝'
    }
    
    // ⭐ 新增：獲取日誌樣式類別
    const getLogClass = (event) => {
      if (event.includes('錯誤') || event.includes('失敗')) return 'log-error'
      if (event.includes('成功') || event.includes('上傳位置') && !event.includes('失敗')) return 'log-success'
      if (event.includes('背景') || event.includes('前景')) return 'log-info'
      return ''
    }
    
    // ⭐ 新增：格式化詳細資訊值
    const formatDetailValue = (value) => {
      if (typeof value === 'object') {
        return JSON.stringify(value)
      }
      return String(value)
    }

    return {
      showSettings,
      showDiagnosticPanel,
      settings,
      userInfo,
      emojiList,
      saveSettings,
      saveUserInfo,
      selectEmoji,
      closeSettings,
      clearAllData,
      resetSettings,
      buildDate,
      browserInfo,
      storageUsed,
      updateShow,
      openDiagnosticPanel,
      closeDiagnosticPanel,
      getDiagnosticInfo,
      clearDiagnosticLogs,
      exportLogs,
      getLogIcon,
      getLogClass,
      formatDetailValue
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

/* 用戶資訊表單 */
.user-info-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  padding: 20px;
}

.user-info-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.emoji-btn {
  width: 44px;
  height: 44px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-btn:hover {
  border-color: #667eea;
  transform: scale(1.1);
}

.emoji-btn.active {
  border-color: #667eea;
  background: #ede9fe;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.user-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 2px dashed #cbd5e1;
}

.preview-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.preview-display {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.preview-emoji {
  font-size: 32px;
}

.preview-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
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

/* ⭐ 診斷面板樣式 */
.diagnostic-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
  backdrop-filter: blur(4px);
}

.diagnostic-panel {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

.diagnostic-content {
  overflow-y: auto;
  padding: 20px;
}

.diagnostic-section {
  margin-bottom: 24px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.status-item {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.status-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.status-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.status-value.active {
  color: #10b981;
}

.logs-container {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  background: #f9fafb;
}

.no-logs {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
}

.log-entry {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.log-entry:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.log-entry.log-error {
  border-left: 3px solid #ef4444;
}

.log-entry.log-success {
  border-left: 3px solid #10b981;
}

.log-entry.log-info {
  border-left: 3px solid #3b82f6;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.log-icon {
  font-size: 16px;
}

.log-event {
  flex: 1;
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}

.log-time {
  font-size: 11px;
  color: #9ca3af;
}

.log-details {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid #f3f4f6;
}

.log-detail-item {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
  display: flex;
  gap: 6px;
}

.detail-key {
  font-weight: 500;
  color: #4b5563;
}

.detail-value {
  color: #6b7280;
  word-break: break-all;
}

.diagnostic-actions {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.action-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.action-btn.danger {
  background: white;
  color: #ef4444;
  border: 1px solid #ef4444;
}

.action-btn.danger:hover {
  background: #fef2f2;
  transform: translateY(-2px);
}

/* 診斷按鈕樣式 */
.diagnostic-btn-wrapper {
  display: block;
  margin-top: 16px;
}

.diagnostic-btn {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.diagnostic-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.diagnostic-btn:active {
  transform: translateY(0);
}

.diagnostic-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  line-height: 1.4;
}

@media (max-width: 600px) {
  .diagnostic-panel {
    width: 95%;
    max-height: 90vh;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .diagnostic-actions {
    flex-direction: column;
  }
}
</style>
