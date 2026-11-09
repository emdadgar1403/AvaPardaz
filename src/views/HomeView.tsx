import React from 'react';
import { 
  Sparkles, 
  Mic, 
  Layers, 
  Folder, 
  Clock, 
  CheckCircle2, 
  Hourglass, 
  ChevronLeft, 
  Play, 
  ShieldCheck, 
  FileAudio,
  ArrowUpRight
} from 'lucide-react';
import { AudioProject, EngineType } from '../types';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

interface Props {
  projects: AudioProject[];
  onNavigateToGenerate: () => void;
  onNavigateToProjects: () => void;
  onNavigateToModels: () => void;
  onOpenProject: (project: AudioProject) => void;
}

export const HomeView: React.FC<Props> = ({
  projects,
  onNavigateToGenerate,
  onNavigateToProjects,
  onNavigateToModels,
  onOpenProject,
}) => {
  const recentProjects = projects.slice(0, 3);
  const [activePlayingId, setActivePlayingId] = React.useState<string | null>(null);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Hero Studio Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-teal-900/10">
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs px-3 py-1 rounded-full mb-3 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>استودیوی مستقل تولید محتوای صوتی فارسی</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            آواپرداز | صدای هوشمند، آفلاین و اختصاصی شما
          </h2>
          <p className="text-sm text-teal-100/90 mt-2 leading-relaxed">
            تبدیل متن‌های فارسی به کتاب صوتی، پادکست و محتوای شنیداری با پردازش ۱۰۰٪ محلی و معماری چند موتوره بدون نیاز به اینترنت.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToGenerate}
              className="flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-lg shadow-teal-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer text-sm"
            >
              <Mic className="w-5 h-5 text-slate-950" />
              <span>تولید صوت جدید</span>
            </button>

            <button
              onClick={onNavigateToModels}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium px-4 py-3 rounded-2xl border border-white/15 transition-all text-sm cursor-pointer"
            >
              <Layers className="w-4 h-4 text-teal-300" />
              <span>بررسی موتورهای صوتی</span>
            </button>
          </div>
        </div>
      </div>

      {/* Engine Status Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            <span>وضعیت موتورهای صوتی مستقل</span>
          </h3>
          <button 
            onClick={onNavigateToModels}
            className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
          >
            <span>مدیریت مدل‌ها</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Voice Engine Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                  موتور اول
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2">Voice Engine</h4>
                <p className="text-xs text-slate-500 mt-0.5">خانواده Piper, VITS, MMS</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Hourglass className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">وضعیت استقرار:</span>
              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                اتصال در مرحله بعد (تعریف قرارداد)
              </span>
            </div>
          </div>

          {/* Kokoro Engine Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                  موتور دوم
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2">Kokoro Engine</h4>
                <p className="text-xs text-slate-500 mt-0.5">معماری Kokoro v0.19 Deep Architecture</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Hourglass className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">وضعیت استقرار:</span>
              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                اتصال در مرحله بعد (تعریف قرارداد)
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Folder className="w-4 h-4 text-teal-600" />
            <span>آخرین پروژه‌های صوتی</span>
          </h3>
          <button
            onClick={onNavigateToProjects}
            className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
          >
            <span>مشاهده همه ({projects.length})</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <p className="text-sm text-slate-600">هنوز پروژه‌ای ثبت نشده است.</p>
            <button
              onClick={onNavigateToGenerate}
              className="mt-3 text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
            >
              <span>ایجاد اولین پروژه</span>
              <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project) => {
              const isPlaying = activePlayingId === project.id;
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="cursor-pointer flex-1"
                      onClick={() => onOpenProject(project)}
                    >
                      <h4 className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {project.rawText}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                        <span>{project.engineType === 'VOICE_ENGINE' ? 'Voice Engine' : 'Kokoro Engine'}</span>
                        <span>•</span>
                        <span>مدت صوت: {project.durationSeconds} ثانیه</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActivePlayingId(isPlaying ? null : project.id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isPlaying 
                            ? 'bg-teal-600 text-white' 
                            : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                        }`}
                        title="پخش صوت پروژه"
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* Audio player expander */}
                  {isPlaying && (
                    <div className="mt-3 pt-3 border-t border-slate-100 animate-in fade-in">
                      <WaveformVisualizer 
                        durationSeconds={project.durationSeconds} 
                        title={project.title} 
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
