package com.avapardaz.app

import android.app.Application
import com.avapardaz.app.data.database.AppDatabase
import com.avapardaz.app.data.preferences.UserPreferencesDataStore
import com.avapardaz.app.data.repository.ProjectRepositoryImpl
import com.avapardaz.app.engine.kokoro.KokoroEngineImpl
import com.avapardaz.app.engine.manager.ModelManager
import com.avapardaz.app.engine.manager.TtsEngineManager
import com.avapardaz.app.engine.voice.VoiceEngineImpl

class AvaPardazApplication : Application() {

    lateinit var database: AppDatabase
        private set

    lateinit var preferences: UserPreferencesDataStore
        private set

    lateinit var modelManager: ModelManager
        private set

    lateinit var engineManager: TtsEngineManager
        private set

    lateinit var projectRepository: ProjectRepositoryImpl
        private set

    override fun onCreate() {
        super.onCreate()
        
        database = AppDatabase.getDatabase(this)
        preferences = UserPreferencesDataStore(this)
        modelManager = ModelManager(this)

        val voiceEngine = VoiceEngineImpl(this, modelManager)
        val kokoroEngine = KokoroEngineImpl(this, modelManager)
        engineManager = TtsEngineManager(voiceEngine, kokoroEngine)

        projectRepository = ProjectRepositoryImpl(
            context = this,
            projectDao = database.projectDao()
        )
    }
}
