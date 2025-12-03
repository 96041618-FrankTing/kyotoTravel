// Navigation functionality
const navButtons = document.querySelectorAll('.nav-btn');
const daySections = document.querySelectorAll('.day-section');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetDay = button.getAttribute('data-day');
        
        // Remove active class from all buttons and sections
        navButtons.forEach(btn => btn.classList.remove('active'));
        daySections.forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding section
        const targetSection = document.getElementById(targetDay);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll to top of main content
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Update weather for the new location
            updateWeatherForCurrentDay();
        }
    });
});

// PWA Installation
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install button
    installBtn.style.display = 'block';
});

// Handle install button click
installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
        return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the deferredPrompt
    deferredPrompt = null;
    
    // Hide the install button
    installBtn.style.display = 'none';
});

// Listen for the appinstalled event
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    installBtn.style.display = 'none';
});

// Service Worker Registration
let refreshing = false; // Flag to prevent infinite refresh loop

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);

                // Listen for controller change to auto-refresh the page
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    if (!refreshing) {
                        refreshing = true;
                        console.log('New Service Worker activated, refreshing page...');
                        window.location.reload();
                    }
                });
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Check if running as PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

if (isPWA()) {
    console.log('Running as PWA');
    installBtn.style.display = 'none';
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const activeButton = document.querySelector('.nav-btn.active');
    let nextButton = null;
    
    if (e.key === 'ArrowRight') {
        nextButton = activeButton.nextElementSibling;
    } else if (e.key === 'ArrowLeft') {
        nextButton = activeButton.previousElementSibling;
    }
    
    if (nextButton && nextButton.classList.contains('nav-btn')) {
        nextButton.click();
    }
});

// Save scroll position when changing sections
let scrollPositions = {};

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const currentSection = document.querySelector('.day-section.active');
        if (currentSection) {
            scrollPositions[currentSection.id] = window.scrollY;
        }
    });
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Online/Offline status indicator
function updateOnlineStatus() {
    const status = navigator.onLine ? 'online' : 'offline';
    console.log(`Connection status: ${status}`);
    
    // You could show a notification to the user
    if (!navigator.onLine) {
        showOfflineNotification();
    }
}

function showOfflineNotification() {
    // Create a simple notification element
    const notification = document.createElement('div');
    notification.textContent = '📱 離線模式 - 您可以繼續瀏覽已載入的內容';
    notification.style.cssText = `
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: #FFC107;
        color: #000;
        padding: 15px 30px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 1001;
        font-weight: bold;
        animation: slideDown 0.5s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Use animationend event instead of nested setTimeout
    const removeNotification = () => {
        notification.style.animation = 'slideUp 0.5s ease';
        notification.addEventListener('animationend', () => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, { once: true });
    };
    
    // Remove notification after 3 seconds
    setTimeout(removeNotification, 3000);
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            top: -100px;
            opacity: 0;
        }
        to {
            top: 70px;
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            top: 70px;
            opacity: 1;
        }
        to {
            top: -100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add touch gestures for mobile (swipe between days)
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    const threshold = 50; // Minimum swipe distance
    
    if (touchEndX < touchStartX - threshold) {
        // Swipe left - next day
        const activeButton = document.querySelector('.nav-btn.active');
        const nextButton = activeButton.nextElementSibling;
        if (nextButton && nextButton.classList.contains('nav-btn')) {
            nextButton.click();
        }
    }
    
    if (touchEndX > touchStartX + threshold) {
        // Swipe right - previous day
        const activeButton = document.querySelector('.nav-btn.active');
        const prevButton = activeButton.previousElementSibling;
        if (prevButton && prevButton.classList.contains('nav-btn')) {
            prevButton.click();
        }
    }
}

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
});

// Analytics (placeholder - would integrate with Google Analytics or similar)
function logPageView(page) {
    console.log(`Page view: ${page}`);
    // In production, send to analytics service
}

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const page = button.getAttribute('data-day');
        logPageView(page);
    });
});

// Modal functionality
const modal = document.getElementById('detailModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalDetails = document.getElementById('modalDetails');
const modalClose = document.querySelector('.modal-close');

// Close modal when clicking the close button
modalClose.onclick = function() {
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Add click event listeners to itinerary items
document.addEventListener('DOMContentLoaded', function() {
    const itineraryItems = document.querySelectorAll('.itinerary-item .content');
    
    itineraryItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            const details = this.querySelector('.details');
            
            // Set modal title
            modalTitle.textContent = title;
            
            // Build modal content
            let content = `<p><strong>簡介：</strong>${description}</p>`;
            
            if (details) {
                content += details.innerHTML;
            }
            
            // Add specific details based on the item
            const additionalDetails = getAdditionalDetails(title);
            if (additionalDetails) {
                content += additionalDetails;
            }
            
            modalDetails.innerHTML = content;
            
            // Hide image (removed due to inaccurate images)
            modalImage.style.display = 'none';
            
            // Show modal
            modal.style.display = 'block';
        });
    });
});

// Function to get additional details for specific spots
function getAdditionalDetails(title) {
    const detailsMap = {
        '⛩️ 清水寺': `
            <h3>🏛️ 清水寺介紹</h3>
            <p>清水寺是京都最古老的寺院之一，建於778年，是京都最具代表性的寺院。寺院背靠音羽山，面向京都盆地，視野極佳。</p>
            <h3>📸 必拍景點</h3>
            <ul>
                <li>清水舞台：從18公尺高的舞台俯瞰京都景色</li>
                <li>音羽瀑布：三股清泉，分別代表智慧、健康、長壽</li>
                <li>子安塔：祈求小孩健康的塔</li>
            </ul>
            <h3>💡 參觀Tips</h3>
            <ul>
                <li>建議早上或傍晚參觀，人比較少</li>
                <li>從清水寺到二三年坂的坡道較陡，可選擇乘坐纜車</li>
                <li>寺內禁止攝影，請尊重寺規</li>
            </ul>
        `,
        '🎋 嵐山竹林之道': `
            <h3>🎋 嵐山竹林介紹</h3>
            <p>嵐山竹林是京都最具代表性的景觀之一，竹林小徑長約500公尺，兩旁種滿孟宗竹和淡竹，風吹過時發出沙沙聲響。</p>
            <h3>📸 必拍景點</h3>
            <ul>
                <li>竹林小徑：最佳拍攝時間是清晨或傍晚</li>
                <li>渡月橋：從橋上拍攝竹林與桂川的美景</li>
                <li>天龍寺：世界遺產，庭園景色優美</li>
            </ul>
            <h3>💡 參觀Tips</h3>
            <ul>
                <li>建議穿著平底鞋，竹林小徑有些潮濕</li>
                <li>清晨人較少，是拍攝竹林的最佳時機</li>
                <li>附近有嵐山米飛兔麵包店，可品嚐可愛造型麵包</li>
            </ul>
        `,
        '🏯 金閣寺': `
            <h3>🏯 金閣寺介紹</h3>
            <p>金閣寺原名鹿苑寺，因其舍利殿全部貼金箔而得名「金閣寺」。它是京都最具代表性的寺院之一，也是世界文化遺產。</p>
            <h3>📸 必拍景點</h3>
            <ul>
                <li>金色舍利殿：從鏡湖池倒影拍攝最美</li>
                <li>庭園：日式枯山水庭園設計</li>
                <li>陸舟之松：象徵心靈的平靜</li>
            </ul>
            <h3>💡 參觀Tips</h3>
            <ul>
                <li>門票¥500，建議早上參觀避開人群</li>
                <li>從庭園出口可品嚐金箔抹茶冰淇淋</li>
                <li>寺內禁止攝影，請尊重寺規</li>
            </ul>
        `,
        '⛩️ 伏見稻荷大社': `
            <h3>⛩️ 伏見稻荷大社介紹</h3>
            <p>伏見稻荷大社是京都最受歡迎的神社之一，以千本鳥居聞名。鳥居象徵著從現世通往神域的入口。</p>
            <h3>📸 必拍景點</h3>
            <ul>
                <li>千本鳥居：紅色鳥居連綿不絕的景象</li>
                <li>奧社奉拝所：千本鳥居的盡頭</li>
                <li>神社本殿：傳統日式建築</li>
            </ul>
            <h3>💡 參觀Tips</h3>
            <ul>
                <li>建議穿著舒適的鞋子，參觀距離約2公里</li>
                <li>最佳拍攝時間是清晨或傍晚光線柔和時</li>
                <li>鳥居是奉納品，請勿擅自移動或破壞</li>
            </ul>
        `,
        '🦌 奈良公園': `
            <h3>🦌 奈良公園介紹</h3>
            <p>奈良公園是日本最古老的公園之一，以可自由餵食的野生鹿聞名。公園內散落著多座寺院和神社。</p>
            <h3>📸 必拍景點</h3>
            <ul>
                <li>鹿與小朋友互動：溫馴的小鹿搶食的畫面</li>
                <li>東大寺：世界最大木造建築</li>
                <li>春日大社：千年古社</li>
            </ul>
            <h3>💡 參觀Tips</h3>
            <ul>
                <li>鹿仙貝¥200一包，請購買正規品餵食</li>
                <li>不要餵食巧克力、糖果等對鹿有害的食物</li>
                <li>公園很大，建議乘坐巴士在各景點間移動</li>
            </ul>
        `,
        '🚢 天橋立遊覽船': `
            <h3>🚢 天橋立遊覽船介紹</h3>
            <p>天橋立是日本三景之一，從遊覽船上可以360度欣賞這條「龍背」美景。船上可餵食海鷗，體驗非常刺激。</p>
            <h3>📸 必拍景點</h3>
            <ul>
                <li>海上天橋立：從船上拍攝完整的龍背形狀</li>
                <li>海鷗飛來：海鷗吃蝦味先的精彩瞬間</li>
                <li>傘松公園：從海上看松樹傘狀的樹冠</li>
            </ul>
            <h3>💡 參觀Tips</h3>
            <ul>
                <li>準備蝦味先餵食海鷗，記得帶塑膠袋清理</li>
                <li>船程約20分鐘，建議坐在船頭拍攝</li>
                <li>天橋立最佳觀賞時間是秋季楓紅季節</li>
            </ul>
        `,
        '🚂 丹後「紅松號」觀光列車': `
            <h3>🚂 紅松號列車介紹</h3>
            <p>丹後「紅松號」是JR西日本的觀光列車，以「海與山與歷史」為主題，車窗設計讓乘客能360度欣賞風景。</p>
            <h3>📸 必拍景點</h3>
            <ul>
                <li>由良川橋樑：列車行駛在橋上的夢幻場景</li>
                <li>日本海海岸線：湛藍大海與白色沙灘</li>
                <li>車內復古裝潢：木質內裝與大片玻璃窗</li>
            </ul>
            <h3>💡 參觀Tips</h3>
            <ul>
                <li>建議坐在右側座位欣賞日本海景色</li>
                <li>列車上有導覽廣播，介紹沿途景點</li>
                <li>車程約1小時，沿途風景變化豐富</li>
            </ul>
        `,
        '🎢 大阪環球影城 USJ': `
            <h3>🎢 大阪環球影城介紹</h3>
            <p>大阪環球影城是日本最大的主題樂園，以電影為主題，分為8個主題區。園區佔地約40公頃。</p>
            <h3>🎫 必玩設施</h3>
            <ul>
                <li>超級任天堂世界：瑪利歐主題區，需抽整理券</li>
                <li>哈利波特魔法世界：霍格華茲城堡與禁忌森林</li>
                <li>侏羅紀公園：霸王龍與迅猛龍的刺激體驗</li>
                <li>小小兵樂園：萌翻全場的黃色小小兵</li>
            </ul>
            <h3>💡 遊玩Tips</h3>
            <ul>
                <li>提前購買Express Pass可節省大量排隊時間</li>
                <li>下載官方APP查看即時等待時間</li>
                <li>園區很大，穿著舒適鞋子很重要</li>
                <li>建議早上入園，先玩熱門設施</li>
            </ul>
        `
    };
    
    return detailsMap[title] || '';
}

// Function to get image URL for specific spots
function getImageForSpot(title) {
    const imageMap = {
        '⛩️ 清水寺': 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&h=300&fit=crop',
        '🎋 嵐山竹林之道': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop',
        '🏯 金閣寺': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=300&fit=crop',
        '⛩️ 伏見稻荷大社': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=300&fit=crop',
        '🦌 奈良公園': 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=300&fit=crop',
        '🚢 天橋立遊覽船': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=300&fit=crop',
        '🚂 丹後「紅松號」觀光列車': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=300&fit=crop',
        '🎢 大阪環球影城 USJ': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=600&h=300&fit=crop'
    };
    
    return imageMap[title] || null;
}

// Countdown Timer
function updateCountdown() {
    const departureDate = new Date('2026-01-16T09:20:00+08:00'); // Departure time in Taiwan timezone
    const now = new Date();
    const diff = departureDate - now;
    
    const countdownElement = document.getElementById('countdown');
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');
    
    if (diff <= 0) {
        // Trip has started or ended
        if (countdownElement) {
            const endDate = new Date('2026-01-22T16:45:00+08:00'); // Return time
            if (now < endDate) {
                countdownElement.querySelector('.countdown-label').textContent = '✈️ 旅途進行中！';
                countdownElement.querySelector('.countdown-timer').style.display = 'none';
            } else {
                countdownElement.querySelector('.countdown-label').textContent = '🎉 旅程已結束，美好回憶永存！';
                countdownElement.querySelector('.countdown-timer').style.display = 'none';
            }
        }
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
}

// Initialize countdown and update every second
updateCountdown();
setInterval(updateCountdown, 1000);

// Weather functionality
const weatherLocations = {
    'overview': 'Kyoto', // Default to Kyoto for overview
    'day1': 'Kyoto',
    'day2': 'Kyoto', 
    'day3': 'Kyoto',
    'day4': 'Osaka',
    'day5': 'Osaka',
    'day6': 'Osaka',
    'day7': 'Osaka'
};

// Weather icons mapping
const weatherIcons = {
    'Clear': '☀️',
    'Sunny': '☀️',
    'Partly cloudy': '⛅',
    'Cloudy': '☁️',
    'Overcast': '☁️',
    'Mist': '🌫️',
    'Patchy rain possible': '🌦️',
    'Patchy snow possible': '🌨️',
    'Patchy sleet possible': '🌨️',
    'Patchy freezing drizzle possible': '🌨️',
    'Thundery outbreaks possible': '⛈️',
    'Blowing snow': '🌨️',
    'Blizzard': '❄️',
    'Fog': '🌫️',
    'Freezing fog': '🌫️',
    'Patchy light drizzle': '🌦️',
    'Light drizzle': '🌦️',
    'Freezing drizzle': '🌨️',
    'Heavy freezing drizzle': '🌨️',
    'Patchy light rain': '🌦️',
    'Light rain': '🌦️',
    'Moderate rain at times': '🌧️',
    'Moderate rain': '🌧️',
    'Heavy rain at times': '🌧️',
    'Heavy rain': '🌧️',
    'Light freezing rain': '🌨️',
    'Moderate or heavy freezing rain': '🌨️',
    'Light sleet': '🌨️',
    'Moderate or heavy sleet': '🌨️',
    'Patchy light snow': '🌨️',
    'Light snow': '🌨️',
    'Patchy moderate snow': '❄️',
    'Moderate snow': '❄️',
    'Patchy heavy snow': '❄️',
    'Heavy snow': '❄️',
    'Ice pellets': '🧊',
    'Light rain shower': '🌦️',
    'Moderate or heavy rain shower': '🌧️',
    'Torrential rain shower': '🌧️',
    'Light sleet showers': '🌨️',
    'Moderate or heavy sleet showers': '🌨️',
    'Light snow showers': '🌨️',
    'Moderate or heavy snow showers': '❄️',
    'Light showers of ice pellets': '🧊',
    'Moderate or heavy showers of ice pellets': '🧊',
    'Patchy light rain with thunder': '⛈️',
    'Moderate or heavy rain with thunder': '⛈️',
    'Patchy light snow with thunder': '⛈️',
    'Moderate or heavy snow with thunder': '⛈️'
};

async function fetchWeatherData(location) {
    try {
        // For demo purposes, return mock data
        // In production, you would use a real weather API like:
        // const apiKey = 'YOUR_WEATHER_API_KEY';
        // const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`;
        
        // Mock weather data for demonstration
        const mockData = {
            forecast: {
                forecastday: [
                    {
                        date: new Date().toISOString().split('T')[0],
                        day: {
                            condition: { text: 'Partly cloudy' },
                            maxtemp_c: 8,
                            mintemp_c: 2
                        }
                    },
                    {
                        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                        day: {
                            condition: { text: 'Sunny' },
                            maxtemp_c: 10,
                            mintemp_c: 3
                        }
                    },
                    {
                        date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                        day: {
                            condition: { text: 'Light rain' },
                            maxtemp_c: 6,
                            mintemp_c: 1
                        }
                    }
                ]
            }
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function formatWeatherData(weatherData) {
    if (!weatherData || !weatherData.forecast || !weatherData.forecast.forecastday) {
        return null;
    }
    
    const days = weatherData.forecast.forecastday.slice(0, 3);
    return days.map((day, index) => {
        const date = new Date(day.date);
        const dayNames = ['今天', '明天', '後天'];
        const dayName = dayNames[index] || date.toLocaleDateString('zh-TW', { weekday: 'short' });
        
        const condition = day.day.condition.text;
        const icon = weatherIcons[condition] || '🌤️';
        const tempHigh = Math.round(day.day.maxtemp_c);
        const tempLow = Math.round(day.day.mintemp_c);
        
        return {
            day: dayName,
            icon: icon,
            temp: `${tempHigh}°/${tempLow}°`,
            condition: condition
        };
    });
}

function updateWeatherDisplay(weatherData) {
    const weatherContainer = document.getElementById('header-weather');
    if (!weatherContainer) return;
    
    if (!weatherData) {
        weatherContainer.innerHTML = '<div class="weather-loading">天氣資訊載入失敗</div>';
        return;
    }
    
    const weatherHTML = `
        <div class="weather-display">
            ${weatherData.map(day => `
                <div class="weather-day">
                    <div class="weather-day-label">${day.day}</div>
                    <div class="weather-icon">${day.icon}</div>
                    <div class="weather-temp">${day.temp}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    weatherContainer.innerHTML = weatherHTML;
}

async function updateWeatherForCurrentDay() {
    const activeSection = document.querySelector('.day-section.active');
    if (!activeSection) return;
    
    const sectionId = activeSection.id;
    const location = weatherLocations[sectionId] || 'Kyoto';
    
    const weatherContainer = document.getElementById('header-weather');
    if (weatherContainer) {
        weatherContainer.innerHTML = '<div class="weather-loading">載入天氣中...</div>';
    }
    
    const weatherData = await fetchWeatherData(location);
    const formattedData = formatWeatherData(weatherData);
    updateWeatherDisplay(formattedData);
}

// Initialize weather on page load
document.addEventListener('DOMContentLoaded', () => {
    updateWeatherForCurrentDay();
});
