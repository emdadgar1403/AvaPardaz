import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  Download, 
  X, 
  Copy, 
  Check, 
  Layers, 
  Smartphone,
  ExternalLink,
  Info
} from 'lucide-react';

interface AndroidFileItem {
  path: string;
  category: string;
  name: string;
  description: string;
  code: string;
}

const ANDROID_SOURCE_FILES: AndroidFileItem[] = [
  {
    path: 'com/avapardaz/app/engine/api/TtsEngine.kt',
    category: 'موتور صوتی (Engine Contract)',
    name: 'TtsEngine.kt',
    description: 'قرارداد انتزاعی موتورهای صوتی مستقل، چرخه‌حیات و وضعیت‌ها',
    code: `package com.avapardaz.app.engine.api

import com.avapardaz.app.domain.model.TtsEngineType
import com.avapardaz.app.domain.model.VoiceSpeaker
import kotlinx.coroutines.flow.StateFlow

sealed interface EngineStatus {
    data object Uninitialized : EngineStatus
    data object ContractPendingStage2 : EngineStatus
    data class Loading(val progress: Float) : EngineStatus
    data class Ready(val modelId: String) : EngineStatus
    data class Synthesizing(val progress: Float, val currentChunk: Int, val totalChunks: Int) : EngineStatus
    data class Error(val message: String, val throwable: Throwable? = null) : EngineStatus
}

data class SynthesisRequest(
    val requestId: String,
    val text: String,
    val speakerId: String,
    val speed: Float = 1.0f,
    val pitch: Float = 0.0f,
    val sampleRate: Int = 22050,
    val pauseDurationsMs: Map<String, Int> = emptyMap()
)

data class SynthesisResult(
    val requestId: String,
    val pcmData: ByteArray,
    val sampleRate: Int,
    val channels: Int = 1,
    val bitDepth: Int = 16,
    val durationSeconds: Float,
    val executionTimeMs: Long
)

interface TtsEngine {
    val engineType: TtsEngineType
    val status: StateFlow<EngineStatus>

    suspend fun loadModel(modelPath: String, modelId: String): Result<Unit>
    suspend fun isReady(): Boolean
    suspend fun getSupportedVoices(): List<VoiceSpeaker>
    suspend fun synthesize(request: SynthesisRequest): Result<SynthesisResult>
    fun cancel()
    fun release()
    fun getSampleRate(): Int
}`
  },
  {
    path: 'com/avapardaz/app/engine/voice/VoiceEngine.kt',
    category: 'موتور صوتی (Voice Engine)',
    name: 'VoiceEngine.kt',
    description: 'پیاده‌سازی رابط موتور خانواده Piper, VITS و MMS با وضعیت شفاف',
    code: `package com.avapardaz.app.engine.voice

import android.content.Context
import com.avapardaz.app.domain.model.TtsEngineType
import com.avapardaz.app.domain.model.VoiceSpeaker
import com.avapardaz.app.engine.api.*
import com.avapardaz.app.engine.manager.ModelManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

interface VoiceEngine : TtsEngine {
    fun setPhonemizerMode(persianPhonemizer: Boolean)
}

class VoiceEngineImpl(
    private val context: Context,
    private val modelManager: ModelManager
) : VoiceEngine {

    override val engineType: TtsEngineType = TtsEngineType.VOICE_ENGINE

    private val _status = MutableStateFlow<EngineStatus>(EngineStatus.ContractPendingStage2)
    override val status: StateFlow<EngineStatus> = _status.asStateFlow()

    override suspend fun isReady(): Boolean = _status.value is EngineStatus.Ready

    override suspend fun getSupportedVoices(): List<VoiceSpeaker> {
        return listOf(
            VoiceSpeaker("piper_fa_nima", "نیما (کتاب صوتی)", "مرد", TtsEngineType.VOICE_ENGINE),
            VoiceSpeaker("piper_fa_sara", "سارا (پادکست و آموزش)", "زن", TtsEngineType.VOICE_ENGINE),
            VoiceSpeaker("mms_fa_ramtin", "رامتین (مدل MMS)", "مرد", TtsEngineType.VOICE_ENGINE)
        )
    }

    override suspend fun synthesize(request: SynthesisRequest): Result<SynthesisResult> {
        return Result.failure(
            IllegalStateException("قرارداد فنی موتور Voice Engine تعریف شده است؛ اتصال Native در فاز بعد تکمیل خواهد شد.")
        )
    }

    override fun cancel() {}
    override fun release() { _status.value = EngineStatus.Uninitialized }
    override fun getSampleRate(): Int = 22050
}`
  },
  {
    path: 'com/avapardaz/app/engine/kokoro/KokoroEngine.kt',
    category: 'موتور صوتی (Kokoro Engine)',
    name: 'KokoroEngine.kt',
    description: 'پیاده‌سازی قرارداد موتور پیشرفته کوکورو با پشتیبانی از Blend گویندگان',
    code: `package com.avapardaz.app.engine.kokoro

import android.content.Context
import com.avapardaz.app.domain.model.TtsEngineType
import com.avapardaz.app.domain.model.VoiceSpeaker
import com.avapardaz.app.engine.api.*
import com.avapardaz.app.engine.manager.ModelManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

interface KokoroEngine : TtsEngine {
    fun setVoiceBlend(speakerWeights: Map<String, Float>)
}

class KokoroEngineImpl(
    private val context: Context,
    private val modelManager: ModelManager
) : KokoroEngine {

    override val engineType: TtsEngineType = TtsEngineType.KOKORO_ENGINE

    private val _status = MutableStateFlow<EngineStatus>(EngineStatus.ContractPendingStage2)
    override val status: StateFlow<EngineStatus> = _status.asStateFlow()

    override suspend fun isReady(): Boolean = _status.value is EngineStatus.Ready

    override suspend fun getSupportedVoices(): List<VoiceSpeaker> {
        return listOf(
            VoiceSpeaker("kokoro_fa_maryam", "مریم (بیان عاطفی)", "زن", TtsEngineType.KOKORO_ENGINE),
            VoiceSpeaker("kokoro_fa_arash", "آرش (پادکست تخصصی)", "مرد", TtsEngineType.KOKORO_ENGINE)
        )
    }

    override suspend fun synthesize(request: SynthesisRequest): Result<SynthesisResult> {
        return Result.failure(
            IllegalStateException("قرارداد موتور Kokoro آماده است؛ اتصال Onnx/PyTorch Mobile در فاز بعد اضافه خواهد شد.")
        )
    }

    override fun cancel() {}
    override fun release() { _status.value = EngineStatus.Uninitialized }
    override fun getSampleRate(): Int = 24000
}`
  },
  {
    path: 'com/avapardaz/app/engine/manager/TtsEngineManager.kt',
    category: 'مدیریت موتورها (Engine Manager)',
    name: 'TtsEngineManager.kt',
    description: 'هماهنگی موتورها بر اساس انتخاب صریح کاربر بدون جایگزینی خودکار',
    code: `package com.avapardaz.app.engine.manager

import com.avapardaz.app.domain.model.TtsEngineType
import com.avapardaz.app.domain.model.VoiceSpeaker
import com.avapardaz.app.engine.api.*
import com.avapardaz.app.engine.kokoro.KokoroEngine
import com.avapardaz.app.engine.voice.VoiceEngine
import kotlinx.coroutines.flow.StateFlow

class TtsEngineManager(
    val voiceEngine: VoiceEngine,
    val kokoroEngine: KokoroEngine
) {
    fun getEngine(engineType: TtsEngineType): TtsEngine {
        return when (engineType) {
            TtsEngineType.VOICE_ENGINE -> voiceEngine
            TtsEngineType.KOKORO_ENGINE -> kokoroEngine
        }
    }

    suspend fun synthesize(
        engineType: TtsEngineType,
        request: SynthesisRequest
    ): Result<SynthesisResult> {
        // Strictly uses user-selected engine without masking with a fallback
        return getEngine(engineType).synthesize(request)
    }
}`
  },
  {
    path: 'com/avapardaz/app/data/database/ProjectEntity.kt',
    category: 'پایگاه داده (Room Database)',
    name: 'ProjectEntity.kt',
    description: 'موجودیت جدول پروژه‌های صوتی در Room با تنظیمات اختصاصی هر پروژه',
    code: `package com.avapardaz.app.data.database

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.avapardaz.app.domain.model.*

@Entity(tableName = "audio_projects")
data class ProjectEntity(
    @PrimaryKey
    val id: String,
    val title: String,
    val rawText: String,
    val engineType: String,
    val modelId: String,
    val speakerId: String,
    val speed: Float,
    val pitch: Float,
    val isSmartPauseEnabled: Boolean,
    val commaPauseMs: Int,
    val periodPauseMs: Int,
    val paragraphPauseMs: Int,
    val questionPauseMs: Int,
    val emotionTag: String,
    val audioFilePath: String?,
    val sampleRate: Int,
    val durationSeconds: Float,
    val createdAt: Long,
    val updatedAt: Long,
    val status: String,
    val errorMessage: String?
)`
  },
  {
    path: 'com/avapardaz/app/data/repository/ProjectRepositoryImpl.kt',
    category: 'مخزن داده (Repository)',
    name: 'ProjectRepositoryImpl.kt',
    description: 'مدیریت داده‌ها در Room، کپی مستقل فایل صوتی در Clone و ورود/خروج JSON',
    code: `package com.avapardaz.app.data.repository

import android.content.Context
import com.avapardaz.app.data.database.ProjectDao
import com.avapardaz.app.data.database.ProjectEntity
import com.avapardaz.app.domain.model.AudioProject
import com.avapardaz.app.domain.repository.ProjectRepository
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.util.UUID

class ProjectRepositoryImpl(
    private val context: Context,
    private val projectDao: ProjectDao,
    private val gson: Gson = Gson()
) : ProjectRepository {

    override suspend fun cloneProject(sourceId: String): Result<AudioProject> {
        return withContext(Dispatchers.IO) {
            val source = projectDao.getProjectById(sourceId)?.toDomain()
                ?: return@withContext Result.failure(IllegalArgumentException("پروژه مبدأ یافت نشد."))

            val newId = UUID.randomUUID().toString()
            var newAudioPath: String? = null

            // Physical audio cloning requirement
            source.audioFilePath?.let { oldPath ->
                val oldFile = File(oldPath)
                if (oldFile.exists() && oldFile.isFile) {
                    val clonedFile = File(context.filesDir, "audio_\${newId}.wav")
                    oldFile.copyTo(clonedFile, overwrite = true)
                    newAudioPath = clonedFile.absolutePath
                }
            }

            val clonedProject = source.copy(
                id = newId,
                title = "\${source.title} (کپی)",
                audioFilePath = newAudioPath,
                createdAt = System.currentTimeMillis(),
                updatedAt = System.currentTimeMillis()
            )

            projectDao.insertProject(ProjectEntity.fromDomain(clonedProject))
            Result.success(clonedProject)
        }
    }
}`
  },
  {
    path: 'com/avapardaz/app/audio/processing/PersianTextNormalizer.kt',
    category: 'پردازش متن (Persian Processing)',
    name: 'PersianTextNormalizer.kt',
    description: 'یکپارچه‌سازی حروف عربی/فارسی، نیم‌فاصله ZWNJ و شمارش دقیق کلمات',
    code: `package com.avapardaz.app.audio.processing

object PersianTextNormalizer {
    private const val ZWNJ = '\\u200C'

    fun normalize(rawText: String): String {
        if (rawText.isBlank()) return ""
        return rawText
            .replace('ي', 'ی')
            .replace('ى', 'ی')
            .replace('ك', 'ک')
            .replace('ة', 'ه')
            .replace(Regex("[ \\t]+"), " ")
            .replace('?', '؟')
            .replace(',', '،')
            .trim()
    }

    fun countWords(text: String): Int =
        text.trim().split(Regex("[\\\\s،؛.؟!]+")).filter { it.isNotBlank() }.size
}`
  },
  {
    path: 'app/build.gradle.kts',
    category: 'تنظیمات ساخت (Gradle Configuration)',
    name: 'app/build.gradle.kts',
    description: 'پیکربندی وابستگی‌های معتبر Jetpack Compose, Room KSP و DataStore',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.avapardaz.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.avapardaz.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    implementation(libs.androidx.datastore.preferences)
}`
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExplorerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<AndroidFileItem>(ANDROID_SOURCE_FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-teal-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600/50 rounded-xl">
              <Smartphone className="w-6 h-6 text-teal-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">پروژه مستقل اندروید آواپرداز (Kotlin + Jetpack Compose)</h2>
              <p className="text-xs text-teal-100/90 mt-0.5">
                بسته کامل نرم‌افزاری، معماری لایه‌ای، پایگاه داده Room و قراردادهای صوتی
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="/avapardaz-android-project.zip" 
              download="avapardaz-android-project.zip"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>دانلود فایل ZIP کامل</span>
            </a>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg hover:bg-teal-600/60 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-teal-50 border-b border-teal-100 px-5 py-2.5 flex items-center justify-between text-xs text-teal-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              این پروژه به صورت کامل در پوشه <code className="bg-white px-1.5 py-0.5 rounded border border-teal-200 font-mono text-teal-800">android-project</code> ایجاد شده و آماده باز کردن در Android Studio است.
            </span>
          </div>
          <span className="font-mono text-[11px] bg-teal-100/70 px-2 py-0.5 rounded text-teal-800">
            Package: com.avapardaz.app
          </span>
        </div>

        {/* Modal Body: Two columns */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left / Sidebar: File Tree */}
          <div className="w-full md:w-80 border-l border-slate-200 bg-slate-50 flex flex-col overflow-y-auto">
            <div className="p-3 text-xs font-bold text-slate-500 border-b border-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Folder className="w-4 h-4 text-teal-600" />
              <span>فایل‌های شاخص معماری</span>
            </div>
            <div className="p-2 space-y-1">
              {ANDROID_SOURCE_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-right p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                      isSelected 
                        ? 'bg-teal-600 text-white shadow-sm' 
                        : 'hover:bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-white' : 'text-teal-600'}`} />
                    <div className="overflow-hidden">
                      <div className="font-mono text-xs font-semibold truncate text-left dir-ltr">
                        {file.name}
                      </div>
                      <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                        {file.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
            {/* Code bar */}
            <div className="bg-slate-800/80 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-teal-400 font-bold dir-ltr">{selectedFile.path}</span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">• {selectedFile.description}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1 rounded-lg text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'کپی شد!' : 'کپی کد'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed dir-ltr">
              <pre className="text-slate-200 selection:bg-teal-600">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>معماری کاملاً مستقل و آماده توسعه در Android Studio</span>
          </div>
          <a
            href="/avapardaz-android-project.zip"
            download="avapardaz-android-project.zip"
            className="text-teal-700 font-bold hover:underline flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>دانلود فوری آرشیو ZIP (حجم: ~۴۲ کیلوبایت)</span>
          </a>
        </div>

      </div>
    </div>
  );
};
