package com.avapardaz.app.data.database

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.avapardaz.app.domain.model.AudioProject
import com.avapardaz.app.domain.model.EmotionTag
import com.avapardaz.app.domain.model.GenerationStatus
import com.avapardaz.app.domain.model.PauseConfig
import com.avapardaz.app.domain.model.TtsEngineType

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
) {
    fun toDomain(): AudioProject {
        return AudioProject(
            id = id,
            title = title,
            rawText = rawText,
            engineType = runCatching { TtsEngineType.valueOf(engineType) }.getOrDefault(TtsEngineType.VOICE_ENGINE),
            modelId = modelId,
            speakerId = speakerId,
            speed = speed,
            pitch = pitch,
            isSmartPauseEnabled = isSmartPauseEnabled,
            pauseConfig = PauseConfig(
                smartPauseEnabled = isSmartPauseEnabled,
                commaPauseMs = commaPauseMs,
                periodPauseMs = periodPauseMs,
                paragraphPauseMs = paragraphPauseMs,
                questionPauseMs = questionPauseMs
            ),
            emotionTag = runCatching { EmotionTag.valueOf(emotionTag) }.getOrDefault(EmotionTag.NEUTRAL),
            audioFilePath = audioFilePath,
            sampleRate = sampleRate,
            durationSeconds = durationSeconds,
            createdAt = createdAt,
            updatedAt = updatedAt,
            status = runCatching { GenerationStatus.valueOf(status) }.getOrDefault(GenerationStatus.DRAFT),
            errorMessage = errorMessage
        )
    }

    companion object {
        fun fromDomain(project: AudioProject): ProjectEntity {
            return ProjectEntity(
                id = project.id,
                title = project.title,
                rawText = project.rawText,
                engineType = project.engineType.name,
                modelId = project.modelId,
                speakerId = project.speakerId,
                speed = project.speed,
                pitch = project.pitch,
                isSmartPauseEnabled = project.isSmartPauseEnabled,
                commaPauseMs = project.pauseConfig.commaPauseMs,
                periodPauseMs = project.pauseConfig.periodPauseMs,
                paragraphPauseMs = project.pauseConfig.paragraphPauseMs,
                questionPauseMs = project.pauseConfig.questionPauseMs,
                emotionTag = project.emotionTag.name,
                audioFilePath = project.audioFilePath,
                sampleRate = project.sampleRate,
                durationSeconds = project.durationSeconds,
                createdAt = project.createdAt,
                updatedAt = project.updatedAt,
                status = project.status.name,
                errorMessage = project.errorMessage
            )
        }
    }
}
