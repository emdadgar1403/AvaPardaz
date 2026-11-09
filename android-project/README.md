# آواپرداز | AvaPardaz
## استودیوی هوشمند و آفلاین تولید محتوای صوتی و تبدیل متن فارسی به گفتار

این مخزن شامل کد مبدأ مستقل پروژه اندرویدی **آواپرداز (AvaPardaz)** بر پایه **Kotlin** و **Jetpack Compose** و **Material 3** است.

---

### ویژگی‌ها و معماری مستقل
- **زبان و فریم‌ورک:** Kotlin 2.0.21 + Jetpack Compose + Material 3
- **جهت رابط:** کاملاً راست‌چین (RTL) با چیدمان اختصاصی متون فارسی
- **رنگ هویت بصری:** فیروزه‌ای اختصاصی (`#00A896` و `#028090`)
- **پایگاه داده محلی:** Android Room با نگاشت کامل `ProjectEntity` و `ProjectDao`
- **تنظیمات محلی:** Jetpack DataStore Preferences
- **طراحی آفلاین:** بدون ارسال اطلاعات کاربر به سرور ابری و بدون نیاز به کلیدهای API شخص ثالث
- **معماری موتورها:**
  - `TtsEngine`: قرارداد کلی و مشترک موتورهای صوتی
  - `VoiceEngine`: رابط مستقل موتورهای خانواده Piper, VITS و MMS
  - `KokoroEngine`: رابط مستقل معماری عمیق Kokoro v0.19
  - `TtsEngineManager`: مدیر هماهنگی انتخاب موتور بدون جایگزینی خودکار
  - `ModelManager`: کاوش و اعتبارسنجی فایل‌های مدل محلی (ONNX / Weights)
- **وضعیت کنونی موتورها:** «اتصال در مرحله بعد (تعریف قرارداد فنی)» به منظور شفافیت کامل و عدم استفاده از کدهای جعلی یا سرویس‌های ابری غیرواقعی.
- **تولید و کپی مستقل:** در قابلیت Clone، فایل صوتی به صورت فیزیکی کپی می‌شود تا هیچ دو پروژه‌ای به فایل مشترک وابسته نباشند.
- **پشتیبانی از ورود و خروجی JSON:** اشتراک‌گذاری و بازنشانی کامل ساختار پروژه‌ها.

---

### ساختار بسته‌بندی (Package Structure)
```text
com.avapardaz.app
├── data
│   ├── database
│   │   ├── AppDatabase.kt
│   │   ├── ProjectDao.kt
│   │   └── ProjectEntity.kt
│   ├── preferences
│   │   └── UserPreferencesDataStore.kt
│   └── repository
│       └── ProjectRepositoryImpl.kt
│
├── domain
│   ├── model
│   │   ├── AudioProject.kt
│   │   ├── ModelInfo.kt
│   │   └── TtsEngineType.kt
│   └── repository
│       └── ProjectRepository.kt
│
├── engine
│   ├── api
│   │   ├── TtsEngine.kt
│   │   └── EngineStatus.kt
│   ├── voice
│   │   └── VoiceEngine.kt
│   ├── kokoro
│   │   └── KokoroEngine.kt
│   └── manager
│       ├── TtsEngineManager.kt
│       └── ModelManager.kt
│
├── audio
│   ├── export
│   │   └── WavExporter.kt
│   └── processing
│       ├── PersianTextNormalizer.kt
│       └── PunctuationPauseParser.kt
│
├── ui
│   ├── theme
│   │   ├── Color.kt
│   │   └── Theme.kt
│   ├── navigation
│   │   └── Screen.kt
│   ├── dashboard
│   │   └── HomeScreen.kt
│   ├── generate
│   │   └── GenerateScreen.kt
│   ├── projects
│   │   └── ProjectsScreen.kt
│   ├── models
│   │   └── ModelsScreen.kt
│   └── settings
│       └── SettingsScreen.kt
│
├── AvaPardazApplication.kt
└── MainActivity.kt
```

---

### نحوه باز کردن در Android Studio
1. برنامه **Android Studio Ladybug (یا نسخه 2024 به بعد)** را باز کنید.
2. گزینه **Open** را انتخاب کنید و پوشه پروژه `android-project` را باز نمایید.
3. اجازه دهید Gradle فرآیند همگام‌سازی (Sync) وابستگی‌ها را انجام دهد.
4. پروژه آماده اجرا روی Emulator یا دستگاه واقعی با سیستم‌عامل Android 8.0+ (API 26+) است.
