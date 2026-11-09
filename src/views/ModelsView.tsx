import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  CheckCircle, 
  Hourglass, 
  FileUp, 
  AlertCircle, 
  HardDrive, 
  Check, 
  Activity,
  Info
} from 'lucide-react';
import { EngineType, ModelInfo } from '../types';

interface Props {
  models: ModelInfo[];
  defaultEngine: EngineType;
  onSelectDefaultEngine: (engine: EngineType) => void;
  onAddNewCustomModel: (model: ModelInfo) => void;
}

export const ModelsView: React.FC<Props> = ({
  models,
  defaultEngine,
  onSelectDefaultEngine,
  onAddNewCustomModel,
}) => {
  const [selectedEngineTab, setSelectedEngineTab] = useState<EngineType | 'ALL'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [customModelName, setCustomModelName] = useState('');
  const [customEngine, setCustomEngine] = useState<EngineType>('VOICE_ENGINE');
  const [customSampleRate, setCustomSampleRate] = useState(22050);
  const [customFileSizeMb, setCustomFileSizeMb] = useState(75);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredModels = models.filter((m) => {
    if (selectedEngineTab === 'ALL') return true;
    return m.engineType === selectedEngineTab;
  });

  const handleRegisterCustomModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customModelName.trim()) return;

    const newModel: ModelInfo = {
      id: `custom_model_${Date.now()}`,
      nameFa: customModelName.trim(),
      engineType: customEngine,
      sampleRate: customSampleRate,
      sizeBytes: customFileSizeMb * 1024 * 1024,
      status: 'CONTRACT_PENDING',
      description: 'مدل واردشده از حافظه محلی دستگاه کاربر برای ارزیابی آفلاین'
    };

    onAddNewCustomModel(newModel);
    setShowAddModal(false);
    setCustomModelName('');
    setToastMessage(`مدل «${newModel.nameFa}» در سیستم ثبت شد.`);
    setTimeout(() => setToastMessage(null), 3000);
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
            <Layers className="w-5 h-5 text-teal-600" />
            <span>مدیریت مدل‌های صوتی و موتورها</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            مشاهده وضعیت فنی، حجم فایل‌ها، نرخ نمونه‌برداری و معرفی مدل‌های محلی
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
        >
          <FileUp className="w-4 h-4" />
          <span>معرفی فایل مدل جدید</span>
        </button>
      </div>

      {/* Default Engine Selector Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">موتور صوتی پیش‌فرض استودیو</h3>
        <p className="text-xs text-slate-500 mb-4">
          تعیین موتور پیش‌فرض برای درخواست‌های جدید تولید صوت (بدون جایگزینی اجباری):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Voice Engine option */}
          <div
            onClick={() => onSelectDefaultEngine('VOICE_ENGINE')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              defaultEngine === 'VOICE_ENGINE'
                ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
              defaultEngine === 'VOICE_ENGINE' ? 'border-teal-600' : 'border-slate-300'
            }`}>
              {defaultEngine === 'VOICE_ENGINE' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Voice Engine (خانواده Piper / VITS / MMS)</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                بهینه‌شده برای سرعت بالا، سبک بودن روی پردازنده موبایل و مصرف بهینه باتری
              </div>
            </div>
          </div>

          {/* Kokoro Engine option */}
          <div
            onClick={() => onSelectDefaultEngine('KOKORO_ENGINE')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              defaultEngine === 'KOKORO_ENGINE'
                ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
              defaultEngine === 'KOKORO_ENGINE' ? 'border-teal-600' : 'border-slate-300'
            }`}>
              {defaultEngine === 'KOKORO_ENGINE' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Kokoro Engine (معماری Kokoro v0.19)</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                معماری شبکه عمیق ۸۲ میلیون پارامتری برای بازتولید لحن غنی و پادکست‌های باکیفیت
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Engine Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedEngineTab('ALL')}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            selectedEngineTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          همه مدل‌ها ({models.length})
        </button>
        <button
          onClick={() => setSelectedEngineTab('VOICE_ENGINE')}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            selectedEngineTab === 'VOICE_ENGINE'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          مدل‌های Voice Engine
        </button>
        <button
          onClick={() => setSelectedEngineTab('KOKORO_ENGINE')}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            selectedEngineTab === 'KOKORO_ENGINE'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          مدل‌های Kokoro Engine
        </button>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredModels.map((model) => {
          const mb = Math.round(model.sizeBytes / (1024 * 1024));
          return (
            <div
              key={model.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{model.nameFa}</h3>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {model.engineType === 'VOICE_ENGINE' ? 'خانواده Piper/MMS' : 'معماری Kokoro'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {model.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-400">
                    <span>حجم فایل: <strong className="text-slate-700 font-mono">{mb} MB</strong></span>
                    <span>نرخ نمونه: <strong className="text-slate-700 font-mono">{model.sampleRate} Hz</strong></span>
                    <span>شناسه: <code className="text-slate-600 font-mono">{model.id}</code></span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl text-xs font-semibold">
                    <Hourglass className="w-3.5 h-3.5 text-amber-600" />
                    <span>اتصال در مرحله بعد (قرارداد فنی)</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Model Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">معرفی فایل مدل صوتی آفلاین</h3>
            <p className="text-xs text-slate-500 mb-4">
              معرفی فایل‌های ONNX یا Weights ذخیره‌شده در حافظه تلفن همراه به دیتابیس آواپرداز:
            </p>

            <form onSubmit={handleRegisterCustomModel} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">عنوان فارسی مدل:</label>
                <input
                  type="text"
                  required
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  placeholder="مثال: مدل آزمایشی فارسی نسخه ۱"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">موتور مرتبط:</label>
                <select
                  value={customEngine}
                  onChange={(e) => setCustomEngine(e.target.value as EngineType)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-hidden bg-white"
                >
                  <option value="VOICE_ENGINE">Voice Engine (Piper / VITS / MMS)</option>
                  <option value="KOKORO_ENGINE">Kokoro Engine (Kokoro Architecture)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">نرخ نمونه (Hz):</label>
                  <input
                    type="number"
                    value={customSampleRate}
                    onChange={(e) => setCustomSampleRate(parseInt(e.target.value) || 22050)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">حجم تقریبی (MB):</label>
                  <input
                    type="number"
                    value={customFileSizeMb}
                    onChange={(e) => setCustomFileSizeMb(parseInt(e.target.value) || 75)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm cursor-pointer"
                >
                  ثبت مشخصات مدل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
