import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Square, 
  Sparkles, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Save, 
  Volume2, 
  Info, 
  RotateCcw,
  CheckCircle,
  FileText
} from 'lucide-react';
import { AudioProject, EmotionTag, EngineType, PauseConfig, VoiceSpeaker } from '../types';
import { 
  countCharacters, 
  countWords, 
  countZWNJ, 
  normalizePersianText, 
  parsePunctuationSegments 
} from '../utils/persianNormalizer';
import { INITIAL_SPEAKERS, SAMPLE_TEXTS } from '../data/initialData';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

interface Props {
  onSaveProject: (project: AudioProject) => void;
  activeProjectToEdit?: AudioProject | null;
}

export const GenerateView: React.FC<Props> = ({ onSaveProject, activeProjectToEdit }) => {
  const [projectTitle, setProjectTitle] = useState(activeProjectToEdit?.title || 'پروژه صوتی جدید');
  const [text, setText] = useState(
    activeProjectToEdit?.rawText || 
    'استودیوی آواپرداز، ابزاری هوشمند برای تبدیل متن‌های غنی فارسی به گفتار با رعایت دقیق علائم نگارشی و مکث‌های طبیعی است.'
  );

  const [engineType, setEngineType] = useState<EngineType>(activeProjectToEdit?.engineType || 'VOICE_ENGINE');
  const [speakerId, setSpeakerId] = useState<string>(activeProjectToEdit?.speakerId || 'piper_fa_nima');
  const [speed, setSpeed] = useState<number>(activeProjectToEdit?.speed || 1.0);
  const [pitch, setPitch] = useState<number>(activeProjectToEdit?.pitch || 0.0);

  const [pauseConfig, setPauseConfig] = useState<PauseConfig>(
    activeProjectToEdit?.pauseConfig || {
      smartPauseEnabled: true,
      commaPauseMs: 300,
      periodPauseMs: 600,
      paragraphPauseMs: 900,
      questionPauseMs: 650
    }
  );

  const [emotion, setEmotion] = useState<EmotionTag>(activeProjectToEdit?.emotionTag || 'NEUTRAL');
  const [sampleRate, setSampleRate] = useState<number>(activeProjectToEdit?.sampleRate || 22050);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showPunctuationPreview, setShowPunctuationPreview] = useState(false);

  // Generation state simulation & honest contract check
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showHonestBanner, setShowHonestBanner] = useState(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState(false);

  // Statistics
  const wordCount = useMemo(() => countWords(text), [text]);
  const charCount = useMemo(() => countCharacters(text), [text]);
  const zwnjCount = useMemo(() => countZWNJ(text), [text]);
  const segments = useMemo(() => parsePunctuationSegments(text, pauseConfig), [text, pauseConfig]);

  // Filter speakers according to chosen engine
  const availableSpeakers = useMemo(() => {
    return INITIAL_SPEAKERS.filter((s) => s.engineType === engineType);
  }, [engineType]);

  const handleStartGeneration = () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setGenerationProgress(10);
    setShowHonestBanner(true);

    const timer1 = setTimeout(() => setGenerationProgress(45), 400);
    const timer2 = setTimeout(() => setGenerationProgress(80), 800);
    const timer3 = setTimeout(() => {
      setGenerationProgress(100);
      setIsGenerating(false);
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleStopGeneration = () => {
    setIsGenerating(false);
    setGenerationProgress(0);
  };

  const handleSaveAsProject = () => {
    if (!text.trim()) return;
    const newProj: AudioProject = {
      id: activeProjectToEdit?.id || `proj_${Date.now()}`,
      title: projectTitle.trim() || 'پروژه صوتی آواپرداز',
      rawText: text,
      engineType,
      modelId: engineType === 'VOICE_ENGINE' ? 'model_piper_persian_medium' : 'model_kokoro_v019_fa',
      speakerId,
      speed,
      pitch,
      isSmartPauseEnabled: pauseConfig.smartPauseEnabled,
      pauseConfig,
      emotionTag: emotion,
      sampleRate,
      durationSeconds: Math.max(5, Math.round(wordCount * 0.45 * (1 / speed))),
      createdAt: activeProjectToEdit?.createdAt || Date.now(),
      updatedAt: Date.now(),
      status: 'COMPLETED',
      audioFilePath: `/storage/emulated/0/AvaPardaz/Audios/proj_${Date.now()}.wav`
    };

    onSaveProject(newProj);
    setSavedSuccessMessage(true);
    setTimeout(() => setSavedSuccessMessage(false), 3000);
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-4xl mx-auto">
      
      {/* Title & Project Meta Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <label className="text-[11px] font-bold text-slate-500 block mb-1">
            عنوان پروژه صوتی
          </label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="w-full text-base font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-hidden px-1 py-0.5 transition-colors"
            placeholder="مثال: فصل اول کتاب صوتی..."
          />
        </div>

        <div className="flex items-center gap-2">
          {savedSuccessMessage && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>پروژه ذخیره شد!</span>
            </span>
          )}
          <button
            onClick={handleSaveAsProject}
            className="flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-teal-200 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-teal-600" />
            <span>ذخیره در پروژه‌های من</span>
          </button>
        </div>
      </div>

      {/* Persian Text Editor Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            <h3 className="text-sm font-bold text-slate-900">متن فارسی استودیو</h3>
          </div>

          {/* Quick template texts */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">متن نمونه:</span>
            {SAMPLE_TEXTS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setText(sample.text);
                  setProjectTitle(sample.title);
                }}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {sample.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="متن فارسی خود را اینجا تایپ کنید یا جای‌گذاری نمایید..."
          rows={6}
          className="w-full text-sm leading-relaxed p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 focus:outline-hidden transition-all resize-y"
        />

        {/* Live Counters */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3 gap-2">
          <div className="flex items-center gap-4">
            <span>کلمات: <strong className="text-slate-800 font-mono">{wordCount}</strong></span>
            <span>نویسه‌ها: <strong className="text-slate-800 font-mono">{charCount}</strong></span>
            <span>نیم‌فاصله (ZWNJ): <strong className="text-teal-700 font-mono">{zwnjCount}</strong></span>
            <span>بخش‌ها: <strong className="text-slate-800 font-mono">{segments.length}</strong></span>
          </div>

          <button
            onClick={() => setShowPunctuationPreview(!showPunctuationPreview)}
            className="text-[11px] text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showPunctuationPreview ? 'بستن تحلیل نگارشی' : 'مشاهده تحلیل مکث‌ها'}</span>
          </button>
        </div>

        {/* Punctuation Breakdown Preview */}
        {showPunctuationPreview && (
          <div className="mt-4 p-3.5 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs animate-in fade-in">
            <h4 className="font-bold text-teal-900 mb-2">تحلیل بخش‌ها و مکث‌های نگارشی هوشمند:</h4>
            <div className="flex flex-wrap gap-2">
              {segments.map((seg, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1.5 bg-white border border-teal-200 text-slate-700 px-2.5 py-1 rounded-xl shadow-2xs"
                >
                  <span>{seg.content}</span>
                  {seg.punctuation && (
                    <span className="font-bold text-teal-700">«{seg.punctuation}»</span>
                  )}
                  {seg.pauseMs > 0 && (
                    <span className="bg-teal-600 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-md">
                      {seg.pauseMs}ms
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Engine and Speaker Configuration Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-600" />
          <span>انتخاب موتور و صدای گوینده</span>
        </h3>

        {/* Engine switcher tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-4">
          <button
            onClick={() => {
              setEngineType('VOICE_ENGINE');
              setSpeakerId('piper_fa_nima');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              engineType === 'VOICE_ENGINE'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Voice Engine</span>
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(Piper / VITS / MMS)</span>
          </button>

          <button
            onClick={() => {
              setEngineType('KOKORO_ENGINE');
              setSpeakerId('kokoro_fa_maryam');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              engineType === 'KOKORO_ENGINE'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Kokoro Engine</span>
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(Kokoro v0.19 Deep)</span>
          </button>
        </div>

        {/* Speaker Radio Options */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 block">
            گوینده انتخابی:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableSpeakers.map((speaker) => {
              const isSelected = speakerId === speaker.id;
              return (
                <div
                  key={speaker.id}
                  onClick={() => setSpeakerId(speaker.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-teal-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{speaker.nameFa}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{speaker.recommendedFor}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {speaker.gender}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Voice Tuning (Speed & Pitch) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">تنظیم سرعت و زیروبمی صدا</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Speed slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-slate-700">سرعت گفتار:</span>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                {speed.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>کند (0.5x)</span>
              <span>عادی (1.0x)</span>
              <span>سریع (2.0x)</span>
            </div>
          </div>

          {/* Pitch slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-slate-700">زیر و بمی صدا (Pitch):</span>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                {pitch > 0 ? `+${pitch.toFixed(1)}` : pitch.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="-5.0"
              max="5.0"
              step="0.5"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>بم (-5)</span>
              <span>طبیعی (0)</span>
              <span>زیر (+5)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Pause & Emotion Tags */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-5">
        
        {/* Smart pause header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">کنترل مکث هوشمند علائم نگارشی</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              اعمال خودکار مکث‌های طبیعی زبان فارسی در محل ویرگول، نقطه، پرسش و بندها
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pauseConfig.smartPauseEnabled}
              onChange={(e) => setPauseConfig({ ...pauseConfig, smartPauseEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {/* Pause millisecond controls */}
        {pauseConfig.smartPauseEnabled && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block mb-1">مکث کاما (،)</span>
              <input
                type="number"
                min="100"
                max="1000"
                step="50"
                value={pauseConfig.commaPauseMs}
                onChange={(e) => setPauseConfig({ ...pauseConfig, commaPauseMs: parseInt(e.target.value) || 300 })}
                className="w-full font-mono font-bold text-teal-800 bg-white border border-slate-300 rounded-lg px-2 py-1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">میلی‌ثانیه</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block mb-1">مکث نقطه (.)</span>
              <input
                type="number"
                min="200"
                max="1500"
                step="50"
                value={pauseConfig.periodPauseMs}
                onChange={(e) => setPauseConfig({ ...pauseConfig, periodPauseMs: parseInt(e.target.value) || 600 })}
                className="w-full font-mono font-bold text-teal-800 bg-white border border-slate-300 rounded-lg px-2 py-1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">میلی‌ثانیه</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block mb-1">مکث پاراگراف (\n)</span>
              <input
                type="number"
                min="300"
                max="2000"
                step="50"
                value={pauseConfig.paragraphPauseMs}
                onChange={(e) => setPauseConfig({ ...pauseConfig, paragraphPauseMs: parseInt(e.target.value) || 900 })}
                className="w-full font-mono font-bold text-teal-800 bg-white border border-slate-300 rounded-lg px-2 py-1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">میلی‌ثانیه</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block mb-1">علامت سؤال (؟)</span>
              <input
                type="number"
                min="200"
                max="1500"
                step="50"
                value={pauseConfig.questionPauseMs}
                onChange={(e) => setPauseConfig({ ...pauseConfig, questionPauseMs: parseInt(e.target.value) || 650 })}
                className="w-full font-mono font-bold text-teal-800 bg-white border border-slate-300 rounded-lg px-2 py-1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">میلی‌ثانیه</span>
            </div>
          </div>
        )}

        {/* Emotion Tags */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            برچسب احساس و لحن بیان (در صورت پشتیبانی موتور):
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'NEUTRAL', label: 'خنثی (معمولی)' },
              { id: 'NARRATION', label: 'لحن راوی کتاب صوتی' },
              { id: 'HAPPY', label: 'با نشاط و پرانرژی' },
              { id: 'SAD', label: 'آرام و اندوهگین' },
              { id: 'WHISPER', label: 'نجواگونه و ملایم' },
              { id: 'DRAMATIC', label: 'حماسی و پادکست' },
            ].map((tag) => (
              <button
                key={tag.id}
                onClick={() => setEmotion(tag.id as EmotionTag)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  emotion === tag.id
                    ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Collapsible Advanced Settings */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full p-4 flex items-center justify-between text-right hover:bg-slate-50/70 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold text-slate-800">تنظیمات پیشرفته مهندسی صوت</span>
          {isAdvancedOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {isAdvancedOpen && (
          <div className="p-4 pt-0 border-t border-slate-100 text-xs text-slate-600 space-y-3">
            <div>
              <label className="block text-slate-500 mb-1">نرخ نمونه‌برداری خروجی (Sample Rate):</label>
              <div className="flex gap-2">
                {[16000, 22050, 24000].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSampleRate(rate)}
                    className={`px-3 py-1.5 rounded-xl font-mono ${
                      sampleRate === rate 
                        ? 'bg-teal-700 text-white font-bold' 
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {rate} Hz
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              فرمت خروجی به صورت خودکار با هدر استاندارد 16-bit PCM RIFF WAV در مسیر حافظه دستگاه ذخیره خواهد شد.
            </p>
          </div>
        )}
      </div>

      {/* Honest Technical Status Notice */}
      {showHonestBanner && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-3xl p-5 text-amber-900 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                گزارش وضعیت واقعی قرارداد فنی موتور صوتی ({engineType})
              </h4>
              <p className="text-xs mt-1 text-amber-800 leading-relaxed">
                طبق مأموریت معماری آواپرداز، رابط مستقل <code>{engineType}</code>، خط‌لوله پردازش متن فارسی، پارسر علائم نگارشی و ساختار خروجی WAV کاملاً پیاده‌سازی شده‌اند.
              </p>
              <div className="mt-2 text-xs font-semibold bg-amber-100/60 text-amber-950 p-2.5 rounded-xl border border-amber-200/60">
                وضعیت کنونی: <strong>«اتصال در مرحله بعد (آماده‌سازی قرارداد فنی)»</strong>.
                هیچ صدای نمایشی یا سرویس ابری جایگزین نشده است؛ اتصال کتابخانه‌های C++/ONNX در مرحله توسعه اندروید استودیو تکمیل خواهد شد.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleStartGeneration}
          disabled={isGenerating || !text.trim()}
          className="w-full sm:flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>در حال اعتبارسنجی خط‌لوله ({generationProgress}٪)...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>شروع فرایند تولید صوت</span>
            </>
          )}
        </button>

        {isGenerating && (
          <button
            onClick={handleStopGeneration}
            className="w-full sm:w-auto bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-sm py-4 px-5 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>توقف عملیات</span>
          </button>
        )}
      </div>

    </div>
  );
};
