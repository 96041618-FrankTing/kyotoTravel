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
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
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

// Initial page load
console.log('Kyoto-Osaka Travel Itinerary App loaded successfully');
logPageView('overview');

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
