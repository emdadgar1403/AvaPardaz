import React from 'react';
import { Home, Mic, Folder, Layers, Settings } from 'lucide-react';

export type TabKey = 'home' | 'generate' | 'projects' | 'models' | 'settings';

interface Props {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
  projectsCount: number;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onChangeTab, projectsCount }) => {
  const tabs = [
    { key: 'home' as TabKey, label: 'خانه', icon: Home },
    { key: 'generate' as TabKey, label: 'تولید صوت', icon: Mic },
    { key: 'projects' as TabKey, label: 'پروژه‌های من', icon: Folder, badge: projectsCount },
    { key: 'models' as TabKey, label: 'مدل‌ها', icon: Layers },
    { key: 'settings' as TabKey, label: 'تنظیمات', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 shadow-lg md:static md:shadow-none">
      <div className="max-w-md mx-auto md:max-w-xl flex items-center justify-around py-1.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all relative cursor-pointer ${
                isActive
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-teal-50 text-teal-600 scale-105' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5">{tab.label}</span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute top-1 left-2 bg-teal-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {tab.badge}
                </span>
              )}

              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
