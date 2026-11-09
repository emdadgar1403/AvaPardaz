import React, { useState } from 'react';
import { 
  Settings, 
  FolderDown, 
  Upload, 
  Download, 
  ShieldCheck, 
  Info, 
  CheckCircle, 
  HardDrive, 
  Sliders, 
  Smartphone,
  Save,
  RotateCcw
} from 'lucide-react';
import { AudioProject, UserSettings } from '../types';

interface Props {
  settings: UserSettings;
  projects: AudioProject[];
  onUpdateSettings: (newSettings: UserSettings) => void;
  onRestoreBackup: (restoredProjects: AudioProject[], restoredSettings: UserSettings) => void;
  onOpenCodeExplorer: () => void;
}

export const SettingsView: React.FC<Props> = ({
  settings,
  projects,
  onUpdateSettings,
  onRestoreBackup,
  onOpenCodeExplorer,
}) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    showToast('تنظیمات با موفقیت ذخیره شد.');
  };

  const handleExportFullBackup = () => {
    const backupData = {
      app: 'AvaPardaz',
      version: '1.0.0-alpha',
      exportedAt: new Date().toISOString(),
      settings: localSettings,
      projects: projects
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `avapardaz_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('پشتیبان کامل پروژه‌ها و تنظیمات دانلود شد.');
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.projects && Array.isArray(json.projects)) {
          onRestoreBackup(json.projects, json.settings || localSettings);
          showToast(`پشتیبان با موفقیت بازیابی شد (${json.projects.length} پروژه).`);
        } else {
          showToast('فایل پشتیبان معتبر نیست.');
        }
      } catch (err) {
        showToast('خطا در پردازش فایل پشتیبان.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-4xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-600" />
            <span>تنظیمات استودیو و پشتیبان‌گیری</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            شخصی‌سازی مکث‌ها، مسیر ذخیره‌سازی محلی و خروجی کامل پایگاه داده
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>ذخیره تنظیمات</span>
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          تنظیمات عمومی و ظاهر استودیو
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800">چیدمان و جهت متن</span>
            <p className="text-[11px] text-slate-500">پشتیبانی کامل از راست‌چین (RTL) و فونت فارسی وزیرمتن</p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            فارسی (راست‌چین)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800">ذخیره خودکار پیش‌نویس پروژه‌ها</span>
            <p className="text-[11px] text-slate-500">ذخیره خودکار تغییرات در حافظه محلی DataStore</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.isAutoSaveEnabled}
              onChange={(e) => setLocalSettings({ ...localSettings, isAutoSaveEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>
      </div>

      {/* Default Speech & Smart Pause Settings */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          مقادیر پیش‌فرض تولید صوت و مکث‌ها
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">سرعت پیش‌فرض گفتار:</label>
            <input
              type="number"
              min="0.5"
              max="2.0"
              step="0.05"
              value={localSettings.defaultSpeed}
              onChange={(e) => setLocalSettings({ ...localSettings, defaultSpeed: parseFloat(e.target.value) || 1.0 })}
              className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">زیر و بمی پیش‌فرض (Pitch):</label>
            <input
              type="number"
              min="-5.0"
              max="5.0"
              step="0.5"
              value={localSettings.defaultPitch}
              onChange={(e) => setLocalSettings({ ...localSettings, defaultPitch: parseFloat(e.target.value) || 0.0 })}
              className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">مدت زمان مکث‌های نگارشی پیش‌فرض (میلی‌ثانیه):</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">کاما (،)</span>
              <input
                type="number"
                value={localSettings.pauseConfig.commaPauseMs}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  pauseConfig: { ...localSettings.pauseConfig, commaPauseMs: parseInt(e.target.value) || 300 }
                })}
                className="w-full font-mono text-teal-800 font-bold bg-white border border-slate-300 rounded px-2 py-1 mt-1"
              />
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">نقطه (.)</span>
              <input
                type="number"
                value={localSettings.pauseConfig.periodPauseMs}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  pauseConfig: { ...localSettings.pauseConfig, periodPauseMs: parseInt(e.target.value) || 600 }
                })}
                className="w-full font-mono text-teal-800 font-bold bg-white border border-slate-300 rounded px-2 py-1 mt-1"
              />
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">پاراگراف (\n)</span>
              <input
                type="number"
                value={localSettings.pauseConfig.paragraphPauseMs}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  pauseConfig: { ...localSettings.pauseConfig, paragraphPauseMs: parseInt(e.target.value) || 900 }
                })}
                className="w-full font-mono text-teal-800 font-bold bg-white border border-slate-300 rounded px-2 py-1 mt-1"
              />
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">پرسش (؟)</span>
              <input
                type="number"
                value={localSettings.pauseConfig.questionPauseMs}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  pauseConfig: { ...localSettings.pauseConfig, questionPauseMs: parseInt(e.target.value) || 650 }
                })}
                className="w-full font-mono text-teal-800 font-bold bg-white border border-slate-300 rounded px-2 py-1 mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Storage Path */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2">مسیر ذخیره‌سازی محلی</h3>
        <p className="text-xs text-slate-500 mb-3">
          محل ذخیره فایل‌های خروجی WAV در حافظه دستگاه (بدون نیاز به دسترسی اینترنت):
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={localSettings.exportStoragePath}
            onChange={(e) => setLocalSettings({ ...localSettings, exportStoragePath: e.target.value })}
            className="flex-1 text-xs font-mono p-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Backup and Restore (JSON) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          پشتیبان‌گیری و بازنشانی ساختار استودیو (JSON)
        </h3>
        <p className="text-xs text-slate-500">
          امکان خروجی گرفتن از تمام پروژه‌ها و تنظیمات به صورت یک فایل جامع JSON و بازگردانی آن:
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportFullBackup}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>خروجی گرفتن فایل کامل پشتیبان (Backup)</span>
          </button>

          <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>بازنشانی از فایل پشتیبان (Restore)</span>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleImportBackupFile} 
            />
          </label>
        </div>
      </div>

      {/* About & Android Architecture */}
      <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl shadow-slate-900/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-800">
              نسخه 1.0.0-alpha
            </span>
            <h3 className="text-base font-bold mt-2">آواپرداز | استودیوی هوشمند تولید محتوای صوتی</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
              معماری نرم‌افزاری مستقل اندروید بر پایه Kotlin، Jetpack Compose، Material 3، پایگاه داده Room و DataStore با رعایت کامل حریم خصوصی کاربر و بدون وابستگی به سرورهای ابری.
            </p>
          </div>

          <button
            onClick={onOpenCodeExplorer}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-teal-500/20 shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            مشاهده سورس‌کد Kotlin و دانلود ZIP
          </button>
        </div>
      </div>

    </div>
  );
};
