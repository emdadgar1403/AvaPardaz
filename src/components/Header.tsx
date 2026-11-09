import React from 'react';
import { Sparkles, Code2, Download, ShieldCheck, Cpu } from 'lucide-react';

interface Props {
  onOpenCodeExplorer: () => void;
}

export const Header: React.FC<Props> = ({ onOpenCodeExplorer }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Brand info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            {/* Audio wave icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2a1 1 0 0 1 1 1v18a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm-6 5a1 1 0 0 1 1 1v8a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1zm12 0a1 1 0 0 1 1 1v8a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1zM2 10a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zm20 0a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                آواپرداز <span className="text-teal-600 font-bold text-sm">| AvaPardaz</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                <ShieldCheck className="w-3 h-3" />
                <span>۱۰۰٪ آفلاین و محلی</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              استودیوی هوشمند تولید محتوای صوتی و تبدیل متن فارسی به گفتار
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <a
            href="/avapardaz-android-project.zip"
            download="avapardaz-android-project.zip"
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-all border border-slate-200"
            title="دانلود مستقیم سورس پروژه اندروید"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">دانلود ZIP اندروید</span>
          </a>

          <button
            onClick={onOpenCodeExplorer}
            className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-teal-700/20 active:scale-95 cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-teal-200" />
            <span>کد معماری Kotlin</span>
          </button>
        </div>

      </div>
    </header>
  );
};
