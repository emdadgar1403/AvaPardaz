package com.avapardaz.app.engine.kokoro

import android.content.Context
import com.avapardaz.app.domain.model.TtsEngineType
import com.avapardaz.app.domain.model.VoiceSpeaker
import com.avapardaz.app.engine.api.EngineStatus
import com.avapardaz.app.engine.api.SynthesisRequest
import com.avapardaz.app.engine.api.SynthesisResult
import com.avapardaz.app.engine.api.TtsEngine
import com.avapardaz.app.engine.manager.ModelManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

interface KokoroEngine : TtsEngine {
    fun setVoiceBlend(speakerWeights: Map<String, Float>)
}

/**
 * Implementation of Kokoro Engine (v0.19 82M styleTTS2 deep architecture).
 * In this initial architecture phase, it holds the technical contract and honest status
 * "اتصال در مرحله بعد" (ContractPendingStage2) awaiting PyTorch Lite / ONNX mobile backend integration.
 */
class KokoroEngineImpl(
    private val context: Context,
    private val modelManager: ModelManager
) : KokoroEngine {

    override val engineType: TtsEngineType = TtsEngineType.KOKORO_ENGINE

    private val _status = MutableStateFlow<EngineStatus>(EngineStatus.ContractPendingStage2)
    override val status: StateFlow<EngineStatus> = _status.asStateFlow()

    private var activeModelId: String? = null
    private var isCancelled = false

    override fun setVoiceBlend(speakerWeights: Map<String, Float>) {
        // Kokoro multi-speaker latent embedding interpolation contract
    }

    override suspend fun loadModel(modelPath: String, modelId: String): Result<Unit> {
        _status.value = EngineStatus.Loading(0.2f)
        val fileCheck = modelManager.verifyModelFile(modelPath)
        return if (fileCheck.isSuccess) {
            activeModelId = modelId
            _status.value = EngineStatus.Ready(modelId)
            Result.success(Unit)
        } else {
            _status.value = EngineStatus.ContractPendingStage2
            Result.failure(Exception("Kokoro Engine: اتصال کتابخانه Native موتور Kokoro v0.19 در مرحله بعدی انجام خواهد شد."))
        }
    }

    override suspend fun isReady(): Boolean {
        return _status.value is EngineStatus.Ready
    }

    override suspend fun getSupportedVoices(): List<VoiceSpeaker> {
        return listOf(
            VoiceSpeaker(
                id = "kokoro_fa_maryam",
                nameFa = "مریم (بیان عاطفی و ظریف)",
                gender = "زن",
                engineType = TtsEngineType.KOKORO_ENGINE,
                recommendedFor = "کتاب صوتی رمان و شعر"
            ),
            VoiceSpeaker(
                id = "kokoro_fa_arash",
                nameFa = "آرش (بیان رسا و محکم)",
                gender = "مرد",
                engineType = TtsEngineType.KOKORO_ENGINE,
                recommendedFor = "پادکست تخصصی و مقالات"
            )
        )
    }

    override suspend fun synthesize(request: SynthesisRequest): Result<SynthesisResult> {
        if (!isReady()) {
            return Result.failure(
                IllegalStateException("قرارداد فنی موتور Kokoro Engine آماده است؛ بارگذاری فایل Onnx/Weights و اتصال Native در فاز بعد تکمیل خواهد شد.")
            )
        }
        return Result.failure(
            UnsupportedOperationException("این موتور هنوز به کتابخانه Native متصل نشده است.")
        )
    }

    override fun cancel() {
        isCancelled = true
    }

    override fun release() {
        activeModelId = null
        _status.value = EngineStatus.Uninitialized
    }

    override fun getSampleRate(): Int = 24000
}
