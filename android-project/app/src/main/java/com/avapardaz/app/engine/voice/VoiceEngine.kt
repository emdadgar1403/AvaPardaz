package com.avapardaz.app.engine.voice

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

interface VoiceEngine : TtsEngine {
    fun setPhonemizerMode(persianPhonemizer: Boolean)
}

/**
 * Implementation of Voice Engine for Piper/VITS/MMS family.
 * In this initial architecture phase, it holds the technical contract and honest status
 * "اتصال در مرحله بعد" (ContractPendingStage2) awaiting native ONNX/C++ shared libraries integration.
 */
class VoiceEngineImpl(
    private val context: Context,
    private val modelManager: ModelManager
) : VoiceEngine {

    override val engineType: TtsEngineType = TtsEngineType.VOICE_ENGINE

    private val _status = MutableStateFlow<EngineStatus>(EngineStatus.ContractPendingStage2)
    override val status: StateFlow<EngineStatus> = _status.asStateFlow()

    private var activeModelId: String? = null
    private var isCancelled = false

    override fun setPhonemizerMode(persianPhonemizer: Boolean) {
        // Contract ready for Persian eSpeak-ng phonemizer integration
    }

    override suspend fun loadModel(modelPath: String, modelId: String): Result<Unit> {
        _status.value = EngineStatus.Loading(0.3f)
        val fileCheck = modelManager.verifyModelFile(modelPath)
        return if (fileCheck.isSuccess) {
            activeModelId = modelId
            _status.value = EngineStatus.Ready(modelId)
            Result.success(Unit)
        } else {
            // Honest contract status
            _status.value = EngineStatus.ContractPendingStage2
            Result.failure(Exception("Voice Engine: اتصال کتابخانه Native موتور Piper/VITS در مرحله بعدی انجام خواهد شد."))
        }
    }

    override suspend fun isReady(): Boolean {
        return _status.value is EngineStatus.Ready
    }

    override suspend fun getSupportedVoices(): List<VoiceSpeaker> {
        return listOf(
            VoiceSpeaker(
                id = "piper_fa_nima",
                nameFa = "نیما (صدای گرم و شیوا)",
                gender = "مرد",
                engineType = TtsEngineType.VOICE_ENGINE,
                recommendedFor = "کتاب صوتی و مستند"
            ),
            VoiceSpeaker(
                id = "piper_fa_sara",
                nameFa = "سارا (صدای ملایم و آموزشی)",
                gender = "زن",
                engineType = TtsEngineType.VOICE_ENGINE,
                recommendedFor = "پادکست و آموزش"
            ),
            VoiceSpeaker(
                id = "mms_fa_ramtin",
                nameFa = "رامتین (مدل فراگیر MMS)",
                gender = "مرد",
                engineType = TtsEngineType.VOICE_ENGINE,
                recommendedFor = "مکالمه و خبر"
            )
        )
    }

    override suspend fun synthesize(request: SynthesisRequest): Result<SynthesisResult> {
        if (!isReady()) {
            return Result.failure(
                IllegalStateException("قرارداد فنی موتور Voice Engine تعریف شده است؛ اتصال لایه Native (ONNX Runtime / Piper) در فاز بعدی تکمیل خواهد شد.")
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

    override fun getSampleRate(): Int = 22050
}
