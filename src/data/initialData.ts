import { AudioProject, ModelInfo, UserSettings, VoiceSpeaker } from '../types';

export const INITIAL_SPEAKERS: VoiceSpeaker[] = [
  {
    id: 'piper_fa_nima',
    nameFa: 'نیما (کتاب صوتی و مستند)',
    gender: 'مرد',
    engineType: 'VOICE_ENGINE',
    recommendedFor: 'لحن استوار و گویندگی روایی'
  },
  {
    id: 'piper_fa_sara',
    nameFa: 'سارا (پادکست و آموزش)',
    gender: 'زن',
    engineType: 'VOICE_ENGINE',
    recommendedFor: 'بیان شفاف، پرانرژی و روان'
  },
  {
    id: 'mms_fa_ramtin',
    nameFa: 'رامتین (مدل MMS فراگیر)',
    gender: 'مرد',
    engineType: 'VOICE_ENGINE',
    recommendedFor: 'پوشش گسترده واژگان و گفتگو'
  },
  {
    id: 'kokoro_fa_maryam',
    nameFa: 'مریم (رمان و لحن احساسی)',
    gender: 'زن',
    engineType: 'KOKORO_ENGINE',
    recommendedFor: 'کتاب صوتی عاطفی و ظریف'
  },
  {
    id: 'kokoro_fa_arash',
    nameFa: 'آرش (پادکست تخصصی و رسمی)',
    gender: 'مرد',
    engineType: 'KOKORO_ENGINE',
    recommendedFor: 'مقالات علمی و پادکست رادیویی'
  }
];

export const INITIAL_MODELS: ModelInfo[] = [
  {
    id: 'model_piper_persian_medium',
    nameFa: 'مدل فارسی پایپر (Piper Persian Medium)',
    engineType: 'VOICE_ENGINE',
    sampleRate: 22050,
    sizeBytes: 68 * 1024 * 1024,
    status: 'CONTRACT_PENDING',
    isDefault: true,
    description: 'مدل بهینه‌شده سبک بر پایه معماری VITS برای پردازش بلادرنگ و آفلاین بر روی اندروید.'
  },
  {
    id: 'model_mms_persian_vits',
    nameFa: 'مدل فراگیر متا (Meta MMS Persian)',
    engineType: 'VOICE_ENGINE',
    sampleRate: 16000,
    sizeBytes: 145 * 1024 * 1024,
    status: 'CONTRACT_PENDING',
    isDefault: false,
    description: 'مدل گسترده واژگانی متا با پوشش تلفظی غنی برای متون خبری و دانشنامه‌ای.'
  },
  {
    id: 'model_kokoro_v019_fa',
    nameFa: 'کوکورو فارسی (Kokoro v0.19 Deep Architecture)',
    engineType: 'KOKORO_ENGINE',
    sampleRate: 24000,
    sizeBytes: 320 * 1024 * 1024,
    status: 'CONTRACT_PENDING',
    isDefault: false,
    description: 'معماری مدرن ۸۲ میلیون پارامتری StyleTTS2 با بازتولید طبیعی زیر و بمی و لحن احساسی.'
  }
];

export const DEFAULT_SETTINGS: UserSettings = {
  defaultEngine: 'VOICE_ENGINE',
  defaultSpeed: 1.0,
  defaultPitch: 0.0,
  pauseConfig: {
    smartPauseEnabled: true,
    commaPauseMs: 300,
    periodPauseMs: 600,
    paragraphPauseMs: 900,
    questionPauseMs: 650
  },
  exportStoragePath: 'AvaPardaz/Audios',
  isAutoSaveEnabled: true
};

export const INITIAL_PROJECTS: AudioProject[] = [
  {
    id: 'proj_sample_01',
    title: 'مقدمه کتاب شازده کوچولو',
    rawText: 'آدم‌ها این حقیقت را فراموش کرده‌اند، اما تو نباید فراموشش کنی. تو تا زنده‌ای نسبت به چیزی که اهلی کرده‌ای مسئولی؛ تو مسئول گلتی...',
    engineType: 'VOICE_ENGINE',
    modelId: 'model_piper_persian_medium',
    speakerId: 'piper_fa_nima',
    speed: 1.0,
    pitch: 0.0,
    isSmartPauseEnabled: true,
    pauseConfig: {
      smartPauseEnabled: true,
      commaPauseMs: 300,
      periodPauseMs: 600,
      paragraphPauseMs: 900,
      questionPauseMs: 650
    },
    emotionTag: 'NARRATION',
    audioFilePath: '/storage/emulated/0/AvaPardaz/Audios/proj_sample_01.wav',
    sampleRate: 22050,
    durationSeconds: 14.5,
    createdAt: Date.now() - 3600000 * 24 * 2,
    updatedAt: Date.now() - 3600000 * 5,
    status: 'COMPLETED'
  },
  {
    id: 'proj_sample_02',
    title: 'اپیزود اول: هوش مصنوعی و آواها',
    rawText: 'در این قسمت از پادکست آواپرداز، بررسی می‌کنیم که چگونه شبکه‌های عصبی عمیق می‌توانند بدون نیاز به اینترنت، گفتار طبیعی تولید کنند.',
    engineType: 'KOKORO_ENGINE',
    modelId: 'model_kokoro_v019_fa',
    speakerId: 'kokoro_fa_maryam',
    speed: 1.05,
    pitch: 0.2,
    isSmartPauseEnabled: true,
    pauseConfig: {
      smartPauseEnabled: true,
      commaPauseMs: 320,
      periodPauseMs: 650,
      paragraphPauseMs: 950,
      questionPauseMs: 700
    },
    emotionTag: 'HAPPY',
    audioFilePath: '/storage/emulated/0/AvaPardaz/Audios/proj_sample_02.wav',
    sampleRate: 24000,
    durationSeconds: 21.0,
    createdAt: Date.now() - 3600000 * 48,
    updatedAt: Date.now() - 3600000 * 12,
    status: 'COMPLETED'
  }
];

export const SAMPLE_TEXTS = [
  {
    title: 'داستان شازده کوچولو',
    text: 'یکی بود یکی نبود. زیر گنبد کبود، شازده کوچولو به گل سرخ نگاه کرد و گفت: «تو هیچ شبیه گل‌های دیگر نیستی؛ تو گل یگانه منی!» روباه لبخندی زد و گفت: «تنها با چشم دل است که می‌توان خوب دید، آنچه اصل است از دیده پنهان است.»'
  },
  {
    title: 'شعر مولانا (مثنوی)',
    text: 'بشنو این نی چون حکایت می‌کند، از جدایی‌ها شکایت می‌کند.\nکز نیستان تا مرا ببریده‌اند، در نفیرم مرد و زن نالیده‌اند.\nسینه خواهم شرحه شرحه از فراق، تا بگویم شرح درد اشتیاق.'
  },
  {
    title: 'پادکست فناوری آفلاین',
    text: 'به قسمت جدید پادکست استودیو خوش آمدید. امروز می‌خواهیم درباره استقلال داده‌ها صحبت کنیم؛ اینکه چطور ابزارهای صوتی می‌توانند بدون وابستگی به سرورهای خارجی، روی گوشی‌های ما به روانی اجرا شوند.'
  }
];
