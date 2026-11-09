package com.avapardaz.app.engine.api

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
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        other as SynthesisResult
        return requestId == other.requestId && pcmData.contentEquals(other.pcmData)
    }

    override fun hashCode(): Int {
        var result = requestId.hashCode()
        result = 31 * result + pcmData.contentHashCode()
        return result
    }
}

/**
 * Core interface contract for all offline speech synthesis engines in AvaPardaz.
 * Real engine implementations must adhere to this lifecycle without direct UI coupling.
 */
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
}
