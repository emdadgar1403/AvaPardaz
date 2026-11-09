package com.avapardaz.app.engine.manager

import com.avapardaz.app.domain.model.TtsEngineType
import com.avapardaz.app.domain.model.VoiceSpeaker
import com.avapardaz.app.engine.api.EngineStatus
import com.avapardaz.app.engine.api.SynthesisRequest
import com.avapardaz.app.engine.api.SynthesisResult
import com.avapardaz.app.engine.api.TtsEngine
import com.avapardaz.app.engine.kokoro.KokoroEngine
import com.avapardaz.app.engine.voice.VoiceEngine
import kotlinx.coroutines.flow.StateFlow

/**
 * Coordinates and delegates audio synthesis to the user-selected engine.
 * Architectural rule: NEVER silently fall back to an unselected engine.
 * The user's chosen engine is strictly respected.
 */
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

    fun getEngineStatus(engineType: TtsEngineType): StateFlow<EngineStatus> {
        return getEngine(engineType).status
    }

    suspend fun getAvailableSpeakers(engineType: TtsEngineType): List<VoiceSpeaker> {
        return getEngine(engineType).getSupportedVoices()
    }

    suspend fun synthesize(
        engineType: TtsEngineType,
        request: SynthesisRequest
    ): Result<SynthesisResult> {
        val engine = getEngine(engineType)
        // Strictly use selected engine without replacing it automatically
        return engine.synthesize(request)
    }

    fun cancelActiveSynthesis(engineType: TtsEngineType) {
        getEngine(engineType).cancel()
    }

    fun releaseAll() {
        voiceEngine.release()
        kokoroEngine.release()
    }
}
