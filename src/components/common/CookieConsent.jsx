'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, ChevronRight, Settings, Info } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('fyxen-cookie-consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const savedPrefs = JSON.parse(consent);
        setPreferences(savedPrefs);
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytics: true, marketing: true };
    saveConsent(allAccepted);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = { essential: true, analytics: false, marketing: false };
    saveConsent(necessaryOnly);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const saveConsent = (prefs) => {
    localStorage.setItem('fyxen-cookie-consent', JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
    
    // Dispatch event for other components (like Analytics) to react
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: prefs }));
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 z-[100] flex justify-center pointer-events-none"
        >
          <div className="bg-white dark:bg-black/90 backdrop-blur-xl border border-primary-100 dark:border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl shadow-black/20 max-w-4xl w-full pointer-events-auto overflow-hidden relative">
            {/* Glossy background effect */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-300 to-primary-600 opacity-50" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0 bg-primary-50 dark:bg-primary-900/30 p-3 rounded-xl">
                <ShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-1 flex items-center gap-2">
                  Privacy Preferences
                </h3>
                <p className="text-sm text-primary-500 dark:text-primary-400 leading-relaxed max-w-2xl">
                  We use cookies to enhance your shopping experience, analyze site traffic, and deliver personalized content. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0">
                <button 
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Customize
                </button>
                <button 
                  onClick={handleAcceptAll}
                  className="btn-primary px-6 py-2 text-sm whitespace-nowrap"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-black border border-primary-100 dark:border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-primary-50 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-bold">Cookie Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-primary-50 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Essential */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-primary-900 dark:text-white">Essential Cookies</span>
                    <span className="text-[10px] uppercase tracking-wider bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full font-bold">Required</span>
                  </div>
                  <p className="text-xs text-primary-500 dark:text-primary-400">Necessary for the website to function properly, such as secure login and cart functionality.</p>
                </div>
                <div className="relative inline-flex items-center cursor-not-allowed">
                  <div className="w-11 h-6 bg-primary-200 dark:bg-primary-800 rounded-full transition-colors opacity-50" />
                  <div className="absolute left-6 w-4 h-4 bg-white rounded-full transition-transform" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="font-bold text-primary-900 dark:text-white block mb-1">Analytics & Performance</span>
                  <p className="text-xs text-primary-500 dark:text-primary-400">Help us understand how visitors interact with the site, discover issues and improve overall performance.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-primary-100 dark:bg-primary-900/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                </label>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="font-bold text-primary-900 dark:text-white block mb-1">Marketing & Personalization</span>
                  <p className="text-xs text-primary-500 dark:text-primary-400">Used to track visitors across websites to deliver relevant ads and personalized shopping experiences.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-primary-100 dark:bg-primary-900/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-primary-50 dark:border-white/5 flex gap-3">
              <button 
                onClick={handleAcceptNecessary}
                className="flex-1 px-4 py-3 text-sm font-bold text-primary-600 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-white/5 rounded-xl transition-all border border-primary-100 dark:border-white/10"
              >
                Necessary Only
              </button>
              <button 
                onClick={handleSavePreferences}
                className="flex-1 btn-primary py-3 text-sm font-bold"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
