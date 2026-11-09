package com.avapardaz.app.engine.manager

import android.content.Context
import com.avapardaz.app.domain.model.ModelInfo
import com.avapardaz.app.domain.model.ModelStatus
import com.avapardaz.app.domain.model.TtsEngineType
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.io.File

class ModelManager(private val context: Context) {

    private val modelsDirectory: File by lazy {
        File(context.filesDir, "tts_models").apply {
            if (!exists()) mkdirs()
        }
    }

    private val _availableModels = MutableStateFlow<List<ModelInfo>>(emptyList())
    val availableModels: StateFlow<List<ModelInfo>> = _availableModels.asStateFlow()

    init {
        refreshModelsList()
    }

    fun refreshModelsList() {
        val registered = listOf(
            ModelInfo(
                id = "model_piper_persian_medium",
                nameFa = "مدل فارسی پایپر (Piper Persian Medium)",
                engineType = TtsEngineType.VOICE_ENGINE,
                sampleRate = 22050,
                sizeBytes = 68_000_000L,
                status = ModelStatus.CONTRACT_PENDING,
                isDefault = true,
                description = "مدل بهینه‌شده سبک برای پردازش سریع آفلاین بر روی تلفن همراه"
            ),
            ModelInfo(
                id = "model_mms_persian_vits",
                nameFa = "مدل فراگیر متا (Meta MMS Persian)",
                engineType = TtsEngineType.VOICE_ENGINE,
                sampleRate = 16000,
                sizeBytes = 145_000_000L,
                status = ModelStatus.CONTRACT_PENDING,
                isDefault = false,
                description = "مدل VITS با پوشش واژگانی گسترده زبان فارسی"
            ),
            ModelInfo(
                id = "model_kokoro_v019_fa",
                nameFa = "کوکورو فارسی (Kokoro v0.19 Deep Architecture)",
                engineType = TtsEngineType.KOKORO_ENGINE,
                sampleRate = 24000,
                sizeBytes = 320_000_000L,
                status = ModelStatus.CONTRACT_PENDING,
                isDefault = false,
                description = "مدل عمیق با بازتولید طبیعی لحن و انتقال احساسات"
            )
        )

        // Inspect actual filesystem files
        val modelsWithFileStatus = registered.map { model ->
            val expectedFile = File(modelsDirectory, "${model.id}.onnx")
            if (expectedFile.exists() && expectedFile.length() > 0) {
                model.copy(status = ModelStatus.INSTALLED, filePath = expectedFile.absolutePath)
            } else {
                model
            }
        }

        _availableModels.value = modelsWithFileStatus
    }

    fun verifyModelFile(path: String?): Result<File> {
        if (path.isNullOrBlank()) {
            return Result.failure(IllegalArgumentException("مسیر فایل مدل نامعتبر است."))
        }
        val file = File(path)
        return if (file.exists() && file.isFile && file.length() > 1024) {
            Result.success(file)
        } else {
            Result.failure(IllegalArgumentException("فایل مدل در مسیر مشخص‌شده یافت نشد یا ناقص است: $path"))
        }
    }

    fun registerExternalModel(file: File, name: String, engineType: TtsEngineType, sampleRate: Int): Result<ModelInfo> {
        return try {
            val destination = File(modelsDirectory, file.name)
            file.copyTo(destination, overwrite = true)
            val newModel = ModelInfo(
                id = "custom_${System.currentTimeMillis()}",
                nameFa = name,
                engineType = engineType,
                sampleRate = sampleRate,
                sizeBytes = destination.length(),
                status = ModelStatus.INSTALLED,
                filePath = destination.absolutePath,
                description = "مدل واردشده از حافظه دستگاه"
            )
            refreshModelsList()
            Result.success(newModel)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
