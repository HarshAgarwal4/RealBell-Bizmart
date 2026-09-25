import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Share, 
  PlusSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already installed in standalone mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Check if user dismissed recently in this session
    const dismissed = sessionStorage.getItem('realbell_pwa_dismissed');
    if (dismissed) {
      return;
    }

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 4. Capture native beforeinstallprompt event (Chrome, Edge, Android, Opera)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => {
        setIsVisible(true);
      }, 1200);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Detect app installed event
    const handleAppInstalled = () => {
      setIsVisible(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('RealBell BizMart PWA was installed successfully');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 6. For iOS or browsers where prompt event doesn't fire immediately,
    // display prompt after 2 seconds if not already standalone
    const timer = setTimeout(() => {
      if (!isStandalone && !sessionStorage.getItem('realbell_pwa_dismissed')) {
        setIsVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      alert("To install on iOS:\n1. Tap the Share button at the bottom of Safari.\n2. Select 'Add to Home Screen'.");
    } else {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('realbell_pwa_dismissed', 'true');
  };

  if (isInstalled || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] max-w-[360px] w-[calc(100%-2rem)] pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-theme-card/95 backdrop-blur-xl border border-theme-border rounded-2xl p-4 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.3)] font-poppins"
          >
            {/* Fixed Close Cross Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-full text-theme-muted hover:text-theme-main hover:bg-theme-card-subtle transition cursor-pointer"
              aria-label="Close"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Top Identity Row: Logo + App Name + Clean Install Badge */}
            <div className="flex items-center gap-3 pr-6">
              <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-theme-border p-1.5 shrink-0 flex items-center justify-center shadow-xs">
                <img
                  src="/logo.png"
                  alt="RealBell BizMart"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse"></span>
                    <span>Install Our App</span>
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-theme-main truncate leading-tight">
                  RealBell BizMart
                </h4>
                <p className="text-[11px] text-theme-muted truncate">
                  Wholesale B2B marketplace on your home screen
                </p>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-3 pt-2.5 border-t border-theme-border/60">
              {isIOS && !deferredPrompt ? (
                <div className="flex items-center justify-between gap-2 text-[11px] text-theme-muted">
                  <span className="flex items-center gap-1.5 truncate">
                    <Share className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                    <span>Tap Share → 'Add to Home Screen'</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-xs font-semibold text-theme-muted hover:text-theme-main px-2 py-0.5"
                  >
                    Got it
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-xs font-semibold text-theme-muted hover:text-theme-main transition cursor-pointer px-1"
                  >
                    Not now
                  </button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInstallClick}
                    className="flex-1 py-1.5 px-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Install App</span>
                  </motion.button>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
