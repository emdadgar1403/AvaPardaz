package com.avapardaz.app.domain.model

enum class TtsEngineType(val displayName: String, val technicalFamily: String) {
    VOICE_ENGINE("موتور گفتار (Voice Engine)", "Piper / VITS / MMS"),
    KOKORO_ENGINE("موتور کوکورو (Kokoro Engine)", "Kokoro v0.19 Deep Architecture")
}

enum class GenerationStatus {
    DRAFT,
    QUEUED,
    PROCESSING,
    COMPLETED,
    FAILED
}

enum class EmotionTag(val labelFa: String) {
    NEUTRAL("خنثی (معمولی)"),
    NARRATION("لحن راوی و داستانی"),
    HAPPY("با نشاط و پرانرژی"),
    SAD("آرام و اندوهگین"),
    WHISPER("نجواگونه و ملایم"),
    DRAMATIC("حماسی و مهیج")
}

data class PauseConfig(
    val smartPauseEnabled: Boolean = true,
    val commaPauseMs: Int = 300,
    val periodPauseMs: Int = 600,
    val paragraphPauseMs: Int = 900,
    val questionPauseMs: Int = 650
)

data class AudioConfig(
    val speed: Float = 1.0f,
    val pitch: Float = 0.0f,
    val sampleRate: Int = 22050,
    val audioFormat: String = "WAV",
    val bitDepth: Int = 16
)

data class VoiceSpeaker(
    val id: String,
    val nameFa: String,
    val gender: String,
    val engineType: TtsEngineType,
    val defaultPitch: Float = 0.0f,
    val recommendedFor: String = "عمومی و پادکست"
)

data class AudioProject(
    val id: String,
    val title: String,
    val rawText: String,
    val engineType: TtsEngineType,
    val modelId: String,
    val speakerId: String,
    val speed: Float,
    val pitch: Float,
    val isSmartPauseEnabled: Boolean,
    val pauseConfig: PauseConfig,
    val emotionTag: EmotionTag,
    val audioFilePath: String?,
    val sampleRate: Int,
    val durationSeconds: Float = 0f,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val status: GenerationStatus = GenerationStatus.DRAFT,
    val errorMessage: String? = null
)
