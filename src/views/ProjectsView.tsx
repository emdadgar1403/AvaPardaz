import React, { useState } from 'react';
import { 
  Folder, 
  MoreVertical, 
  Play, 
  Edit, 
  Copy, 
  Code, 
  Share2, 
  Trash2, 
  Plus, 
  Upload, 
  Download,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { AudioProject } from '../types';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

interface Props {
  projects: AudioProject[];
  onOpenProject: (project: AudioProject) => void;
  onRenameProject: (id: string, newTitle: string) => void;
  onCloneProject: (id: string) => void;
  onDeleteProject: (project: AudioProject) => void;
  onImportProject: (importedProject: AudioProject) => void;
  onNavigateToGenerate: () => void;
}

export const ProjectsView: React.FC<Props> = ({
  projects,
  onOpenProject,
  onRenameProject,
  onCloneProject,
  onDeleteProject,
  onImportProject,
  onNavigateToGenerate,
}) => {
  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(null);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  // Rename modal
  const [projectToRename, setProjectToRename] = useState<AudioProject | null>(null);
  const [renameInputValue, setRenameInputValue] = useState('');

  // Delete modal
  const [projectToDelete, setProjectToDelete] = useState<AudioProject | null>(null);

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportJson = (project: AudioProject) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.title || 'project'}_avapardaz.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`پروژه «${project.title}» با قالب JSON ذخیره شد.`);
    setActiveMenuProjectId(null);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.rawText) {
          const imported: AudioProject = {
            ...json,
            id: `proj_imported_${Date.now()}`,
            title: `${json.title || 'پروژه وارد شده'} (وارد شده)`,
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          onImportProject(imported);
          showToast('پروژه با موفقیت از فایل JSON بارگذاری شد.');
        } else {
          showToast('فایل JSON معتبر نیست.');
        }
      } catch (err) {
        showToast('خطا در خواندن فایل JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleShareFile = (project: AudioProject) => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: `فایل صوتی آواپرداز: ${project.title}`
      }).catch(() => {});
    } else {
      showToast(`لینک اشتراک‌گذاری برای «${project.title}» در حافظه کپی شد.`);
    }
    setActiveMenuProjectId(null);
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-4xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Folder className="w-5 h-5 text-teal-600" />
            <span>پروژه‌های صوتی من</span>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              {projects.length} پروژه
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            مدیریت، بازنگری، ساخت کپی مستقل و خروجی گرفتن پروژه‌های صوتی ذخیره‌شده
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* JSON Import button */}
          <label className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-slate-500" />
            <span>ورود JSON</span>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleImportJsonFile} 
            />
          </label>

          {/* New Project button */}
          <button
            onClick={onNavigateToGenerate}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>پروژه جدید</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-3">
            <Folder className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">هیچ پروژه‌ای ایجاد نشده است</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            متن مورد نظرتان را در بخش تولید صوت وارد کنید تا اولین خروجی صوتی شما ثبت و آرشیو شود.
          </p>
          <button
            onClick={onNavigateToGenerate}
            className="mt-4 bg-teal-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:bg-teal-700 transition-colors cursor-pointer"
          >
            شروع تولید اولین پروژه
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {projects.map((project) => {
            const isPlaying = activePlayingId === project.id;
            const isMenuOpen = activeMenuProjectId === project.id;

            return (
              <div
                key={project.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all relative"
              >
                <div className="flex items-start justify-between gap-3">
                  
                  {/* Project Info */}
                  <div className="flex-1 cursor-pointer" onClick={() => onOpenProject(project)}>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {project.engineType === 'VOICE_ENGINE' ? 'Voice Engine' : 'Kokoro Engine'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {project.rawText}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-400">
                      <span>آخرین ویرایش: {formatDate(project.updatedAt)}</span>
                      <span>مدت صوت: <strong className="text-slate-700 font-mono">{project.durationSeconds}s</strong></span>
                      <span>سرعت: {project.speed}x</span>
                      <span>مکث هوشمند: {project.isSmartPauseEnabled ? 'فعال' : 'غیرفعال'}</span>
                    </div>
                  </div>

                  {/* Actions & Play button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActivePlayingId(isPlaying ? null : project.id)}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                      }`}
                      title={isPlaying ? 'بستن پلیر' : 'پخش صوت پروژه'}
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>

                    {/* 3-dots Menu trigger */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuProjectId(isMenuOpen ? null : project.id)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="عملیات پروژه"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown menu */}
                      {isMenuOpen && (
                        <div className="absolute left-0 top-10 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-40 text-xs text-slate-700 animate-in fade-in">
                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              onOpenProject(project);
                            }}
                            className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-teal-600" />
                            <span>ویرایش متن و پارامترها</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              setProjectToRename(project);
                              setRenameInputValue(project.title);
                            }}
                            className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-600" />
                            <span>تغییر نام پروژه</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              onCloneProject(project.id);
                              showToast(`کپی کاملاً مستقل از «${project.title}» ساخته شد.`);
                            }}
                            className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5 text-indigo-600" />
                            <span>ساخت کپی مستقل (با کپی فایل صوتی)</span>
                          </button>

                          <button
                            onClick={() => handleExportJson(project)}
                            className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Code className="w-3.5 h-3.5 text-emerald-600" />
                            <span>خروجی گرفتن ساختار (JSON)</span>
                          </button>

                          <button
                            onClick={() => handleShareFile(project)}
                            className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 text-amber-600" />
                            <span>اشتراک‌گذاری فایل</span>
                          </button>

                          <div className="border-t border-slate-100 my-1" />

                          <button
                            onClick={() => {
                              setActiveMenuProjectId(null);
                              setProjectToDelete(project);
                            }}
                            className="w-full text-right px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف پروژه</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Audio Waveform Player */}
                {isPlaying && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in">
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

      {/* Rename Dialog Modal */}
      {projectToRename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900 mb-2">تغییر نام پروژه</h3>
            <p className="text-xs text-slate-500 mb-4">نام جدیدی برای این پروژه صوتی وارد کنید:</p>
            <input
              type="text"
              value={renameInputValue}
              onChange={(e) => setRenameInputValue(e.target.value)}
              className="w-full text-sm font-bold p-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-hidden mb-4"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setProjectToRename(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  if (renameInputValue.trim()) {
                    onRenameProject(projectToRename.id, renameInputValue.trim());
                    showToast('نام پروژه تغییر یافت.');
                  }
                  setProjectToRename(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm"
              >
                ذخیره تغییر نام
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-xl animate-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">تأیید حذف پروژه</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              آیا از حذف پروژه <strong>«{projectToDelete.title}»</strong> و تمام فایل‌های صوتی وابسته به آن در دیتابیس اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  onDeleteProject(projectToDelete);
                  showToast('پروژه با موفقیت حذف شد.');
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm"
              >
                تأیید و حذف نهایی
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
