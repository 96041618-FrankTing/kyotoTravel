// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Install Prompt
let deferredPrompt;
const installBanner = document.getElementById('installBanner');
const installButton = document.getElementById('installButton');
const dismissButton = document.getElementById('dismissButton');

// Capture the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install banner
    installBanner.classList.remove('hidden');
});

// Install button click handler
installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
        return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferred prompt variable
    deferredPrompt = null;

    // Hide the install banner
    installBanner.classList.add('hidden');
});

// Dismiss button click handler
dismissButton.addEventListener('click', () => {
    installBanner.classList.add('hidden');
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('installBannerDismissed', Date.now().toString());
});

// Check if banner was dismissed recently (within 7 days)
const dismissedTime = localStorage.getItem('installBannerDismissed');
if (dismissedTime) {
    const daysSinceDismissal = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissal < 7) {
        // Don't show banner if dismissed within last 7 days
        installBanner.classList.add('hidden');
    }
}

// Handle app installation
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    installBanner.classList.add('hidden');
    // Clear the dismissal flag
    localStorage.removeItem('installBannerDismissed');
});

// Online/Offline Status
const onlineStatus = document.getElementById('onlineStatus');
const statusText = document.getElementById('statusText');

function updateOnlineStatus() {
    if (navigator.onLine) {
        onlineStatus.classList.remove('offline');
        onlineStatus.classList.add('online');
        statusText.textContent = 'Online';
    } else {
        onlineStatus.classList.remove('online');
        onlineStatus.classList.add('offline');
        statusText.textContent = 'Offline';
    }
}

// Update status on page load
updateOnlineStatus();

// Listen for online/offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Add smooth scroll behavior for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Log PWA display mode
window.addEventListener('DOMContentLoaded', () => {
    let displayMode = 'browser';
    if (navigator.standalone) {
        displayMode = 'standalone-ios';
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
        displayMode = 'standalone';
    }
    console.log('Display mode:', displayMode);
});
