package com.avapardaz.app.data.preferences

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.avapardaz.app.domain.model.PauseConfig
import com.avapardaz.app.domain.model.TtsEngineType
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "avapardaz_preferences")

data class UserSettings(
    val defaultEngine: TtsEngineType = TtsEngineType.VOICE_ENGINE,
    val defaultSpeed: Float = 1.0f,
    val defaultPitch: Float = 0.0f,
    val pauseConfig: PauseConfig = PauseConfig(),
    val exportStoragePath: String = "AvaPardaz/Audios",
    val isAutoSaveEnabled: Boolean = true
)

class UserPreferencesDataStore(private val context: Context) {

    private object PreferencesKeys {
        val DEFAULT_ENGINE = stringPreferencesKey("default_engine")
        val DEFAULT_SPEED = floatPreferencesKey("default_speed")
        val DEFAULT_PITCH = floatPreferencesKey("default_pitch")
        val SMART_PAUSE_ENABLED = booleanPreferencesKey("smart_pause_enabled")
        val COMMA_PAUSE_MS = intPreferencesKey("comma_pause_ms")
        val PERIOD_PAUSE_MS = intPreferencesKey("period_pause_ms")
        val PARAGRAPH_PAUSE_MS = intPreferencesKey("paragraph_pause_ms")
        val QUESTION_PAUSE_MS = intPreferencesKey("question_pause_ms")
        val STORAGE_PATH = stringPreferencesKey("storage_path")
        val AUTO_SAVE = booleanPreferencesKey("auto_save")
    }

    val userSettingsFlow: Flow<UserSettings> = context.dataStore.data.map { pref ->
        val engineName = pref[PreferencesKeys.DEFAULT_ENGINE] ?: TtsEngineType.VOICE_ENGINE.name
        val engine = runCatching { TtsEngineType.valueOf(engineName) }.getOrDefault(TtsEngineType.VOICE_ENGINE)

        UserSettings(
            defaultEngine = engine,
            defaultSpeed = pref[PreferencesKeys.DEFAULT_SPEED] ?: 1.0f,
            defaultPitch = pref[PreferencesKeys.DEFAULT_PITCH] ?: 0.0f,
            pauseConfig = PauseConfig(
                smartPauseEnabled = pref[PreferencesKeys.SMART_PAUSE_ENABLED] ?: true,
                commaPauseMs = pref[PreferencesKeys.COMMA_PAUSE_MS] ?: 300,
                periodPauseMs = pref[PreferencesKeys.PERIOD_PAUSE_MS] ?: 600,
                paragraphPauseMs = pref[PreferencesKeys.PARAGRAPH_PAUSE_MS] ?: 900,
                questionPauseMs = pref[PreferencesKeys.QUESTION_PAUSE_MS] ?: 650
            ),
            exportStoragePath = pref[PreferencesKeys.STORAGE_PATH] ?: "AvaPardaz/Audios",
            isAutoSaveEnabled = pref[PreferencesKeys.AUTO_SAVE] ?: true
        )
    }

    suspend fun updateDefaultEngine(engine: TtsEngineType) {
        context.dataStore.edit { it[PreferencesKeys.DEFAULT_ENGINE] = engine.name }
    }

    suspend fun updateSpeechParams(speed: Float, pitch: Float) {
        context.dataStore.edit {
            it[PreferencesKeys.DEFAULT_SPEED] = speed
            it[PreferencesKeys.DEFAULT_PITCH] = pitch
        }
    }

    suspend fun updatePauseConfig(config: PauseConfig) {
        context.dataStore.edit {
            it[PreferencesKeys.SMART_PAUSE_ENABLED] = config.smartPauseEnabled
            it[PreferencesKeys.COMMA_PAUSE_MS] = config.commaPauseMs
            it[PreferencesKeys.PERIOD_PAUSE_MS] = config.periodPauseMs
            it[PreferencesKeys.PARAGRAPH_PAUSE_MS] = config.paragraphPauseMs
            it[PreferencesKeys.QUESTION_PAUSE_MS] = config.questionPauseMs
        }
    }
}
