/**
 * Service Worker Registration & Mobile Enhancement Loader
 * Initializes all advanced mobile features
 */

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('🔄 New version available! Refresh to update.');
              
              // Show update notification (if toast system exists)
              if (window.showToast) {
                window.showToast('Update available! Refresh to get the latest version.');
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// Listen for SW messages
navigator.serviceWorker?.addEventListener('message', (event) => {
  if (event.data === 'refresh') {
    window.location.reload();
  }
});

// Check for SW updates periodically (every 60 minutes)
setInterval(() => {
  navigator.serviceWorker?.getRegistration().then((registration) => {
    registration?.update();
  });
}, 60 * 60 * 1000);

// Note: PWA Install Prompt is handled in main.js to avoid duplication

// Network status monitoring
window.addEventListener('online', () => {
  console.log('🌐 Back online');
  if (window.showToast) {
    window.showToast('Back online!');
  }
});

window.addEventListener('offline', () => {
  console.log('📴 Offline mode');
  if (window.showToast) {
    window.showToast('You\'re offline. Some features may be limited.');
  }
  if (window.haptics) {
    window.haptics.warning();
  }
});

// Performance monitoring
if ('PerformanceObserver' in window) {
  // Monitor Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('📊 LCP:', lastEntry.renderTime || lastEntry.loadTime);
  });
  
  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // LCP not supported
  }

  // Monitor First Input Delay
  const fidObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      console.log('📊 FID:', entry.processingStart - entry.startTime);
    });
  });
  
  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // FID not supported
  }

  // Monitor Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    console.log('📊 CLS:', clsValue);
  });
  
  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // CLS not supported
  }
}

// Battery Status API (if supported)
if ('getBattery' in navigator) {
  navigator.getBattery().then((battery) => {
    console.log('🔋 Battery level:', (battery.level * 100).toFixed(0) + '%');
    console.log('🔌 Charging:', battery.charging);

    // Optimize animations based on battery
    if (battery.level < 0.2 && !battery.charging) {
      console.log('⚡ Low battery mode activated');
      document.documentElement.classList.add('low-battery');
      
      // Reduce animations
      const style = document.createElement('style');
      style.id = 'low-battery-style';
      style.textContent = `
        .low-battery * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
      `;
      document.head.appendChild(style);
    }

    battery.addEventListener('levelchange', () => {
      console.log('🔋 Battery level changed:', (battery.level * 100).toFixed(0) + '%');
    });
  });
}

// Connection quality monitoring
if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  console.log('📶 Connection type:', connection.effectiveType);
  console.log('💾 Data saver:', connection.saveData);
  
  // Optimize based on connection
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData) {
    console.log('🐌 Slow connection detected - optimizing');
    document.documentElement.classList.add('slow-connection');
    
    // Disable autoplay videos, reduce image quality, etc.
  }

  connection.addEventListener('change', () => {
    console.log('📶 Connection changed:', connection.effectiveType);
  });
}

// Device memory (if supported)
if ('deviceMemory' in navigator) {
  console.log('💾 Device memory:', navigator.deviceMemory, 'GB');
  
  // Optimize for low-memory devices
  if (navigator.deviceMemory < 4) {
    console.log('📉 Low memory device - optimizing');
    document.documentElement.classList.add('low-memory');
  }
}

// Hardware concurrency
if ('hardwareConcurrency' in navigator) {
  console.log('⚙️ CPU cores:', navigator.hardwareConcurrency);
}

console.log(`
╔═══════════════════════════════════════╗
║  🚀 Advanced Mobile Features Loaded   ║
╠═══════════════════════════════════════╣
║  ✅ Service Worker                    ║
║  ✅ Progressive Image Loading         ║
║  ✅ Haptic Feedback                   ║
║  ✅ Pull-to-Refresh                   ║
║  ✅ Swipe Navigation                  ║
║  ✅ Advanced Touch Interactions       ║
╚═══════════════════════════════════════╝
`);

// Export initialization status
window.mobileEnhancementsLoaded = true;
