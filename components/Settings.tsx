import React, { useState } from 'react';
import { UserSettings, Language } from '../types';
import { UI_TEXT } from '../constants';
import { Bell, Globe, Clock, Calendar, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { detectHijriAdjustment } from '../utils/dateUtils';
import { requestNotificationPermission, sendNotification } from '../services/notificationService';

interface Props {
  settings: UserSettings;
  updateSettings: (s: UserSettings) => void;
}

const Settings: React.FC<Props> = ({ settings, updateSettings }) => {
  const isArabic = settings.language === Language.ARABIC;
  const t = UI_TEXT[settings.language];
  const [detecting, setDetecting] = useState(false);
  const [detectStatus, setDetectStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleToggle = (key: keyof UserSettings['notifications']) => {
    updateSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const handleAutoDetect = async () => {
    setDetecting(true);
    setDetectStatus('idle');
    try {
      const offset = await detectHijriAdjustment();
      updateSettings({ ...settings, hijriAdjustment: offset });
      setDetectStatus('success');
      setTimeout(() => setDetectStatus('idle'), 3000);
    } catch (e) {
      setDetectStatus('error');
      setTimeout(() => setDetectStatus('idle'), 3000);
    } finally {
      setDetecting(false);
    }
  };

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      sendNotification("Rayyan App", "This is a test notification. May Allah accept your fasting!");
    } else {
      alert("Please enable notifications in your browser settings.");
    }
  };

  return (
    <div className={`p-4 space-y-6 max-w-md mx-auto pb-24 ${isArabic ? 'rtl' : 'ltr'}`}>
      <h1 className="text-2xl font-bold text-emerald-900 mb-4">{t.settings}</h1>

      {/* Language Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
        <div className="flex items-center gap-2 mb-3 text-emerald-700 font-medium">
          <Globe size={20} />
          <span>{t.language}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => updateSettings({ ...settings, language: Language.ENGLISH })}
            className={`flex-1 py-2 rounded-lg transition-colors ${settings.language === Language.ENGLISH ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            English
          </button>
          <button
            onClick={() => updateSettings({ ...settings, language: Language.ARABIC })}
            className={`flex-1 py-2 rounded-lg font-serif transition-colors ${settings.language === Language.ARABIC ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            العربية
          </button>
        </div>
      </div>

      {/* Hijri Adjustment */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
        <div className="flex items-center gap-2 mb-1 text-emerald-700 font-medium">
          <Calendar size={20} />
          <span>{t.hijriAdjust}</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">{t.hijriAdjustDesc}</p>
        
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg mb-3">
           <button 
             onClick={() => updateSettings({...settings, hijriAdjustment: settings.hijriAdjustment - 1})} 
             className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-100 text-lg font-bold text-emerald-700"
           >
             -
           </button>
           <span className="font-bold text-xl text-slate-800">
             {settings.hijriAdjustment > 0 ? `+${settings.hijriAdjustment}` : settings.hijriAdjustment} {t.days}
           </span>
           <button 
             onClick={() => updateSettings({...settings, hijriAdjustment: settings.hijriAdjustment + 1})} 
             className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-100 text-lg font-bold text-emerald-700"
           >
             +
           </button>
        </div>

        <button 
          onClick={handleAutoDetect} 
          disabled={detecting}
          className="w-full py-2 px-4 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-sm flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors disabled:opacity-50"
        >
          {detecting ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : detectStatus === 'success' ? (
             <CheckCircle size={16} />
          ) : detectStatus === 'error' ? (
             <AlertCircle size={16} />
          ) : (
             <RefreshCw size={16} />
          )}
          
          {detecting ? t.autoDetecting : 
           detectStatus === 'success' ? t.adjustmentSynced : 
           detectStatus === 'error' ? t.adjustmentFailed : 
           t.autoDetect}
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
        <div className="flex items-center gap-2 mb-4 text-emerald-700 font-medium">
          <Bell size={20} />
          <span>{t.notifications}</span>
        </div>
        
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-slate-700">{t.mondayThursday}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.notifications.mondayThursday} onChange={() => handleToggle('mondayThursday')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-slate-700">{t.whiteDays}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.notifications.whiteDays} onChange={() => handleToggle('whiteDays')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-slate-700">{t.specialDays}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.notifications.specialDays} onChange={() => handleToggle('specialDays')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Clock size={16} />
                    <span className="text-sm">{t.reminderTime}</span>
                </div>
                <input 
                    type="time" 
                    value={settings.notifications.reminderTime}
                    onChange={(e) => updateSettings({...settings, notifications: {...settings.notifications, reminderTime: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center"
                />
            </div>

             {/* Test Notification Button */}
             <div className="pt-2">
                <button 
                  onClick={handleTestNotification}
                  className="w-full text-center text-sm text-emerald-600 hover:underline"
                >
                  {t.testNotif}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;