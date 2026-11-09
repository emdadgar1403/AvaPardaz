package com.avapardaz.app.data.repository

import android.content.Context
import com.avapardaz.app.data.database.ProjectDao
import com.avapardaz.app.data.database.ProjectEntity
import com.avapardaz.app.domain.model.AudioProject
import com.avapardaz.app.domain.repository.ProjectRepository
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import java.io.File
import java.util.UUID

class ProjectRepositoryImpl(
    private val context: Context,
    private val projectDao: ProjectDao,
    private val gson: Gson = GsonBuilder().setPrettyPrinting().create()
) : ProjectRepository {

    private val audioDir: File by lazy {
        File(context.filesDir, "audio_outputs").apply {
            if (!exists()) mkdirs()
        }
    }

    override fun getAllProjects(): Flow<List<AudioProject>> {
        return projectDao.getAllProjects().map { list ->
            list.map { it.toDomain() }
        }
    }

    override fun getRecentProjects(limit: Int): Flow<List<AudioProject>> {
        return projectDao.getRecentProjects(limit).map { list ->
            list.map { it.toDomain() }
        }
    }

    override suspend fun getProjectById(id: String): AudioProject? {
        return withContext(Dispatchers.IO) {
            projectDao.getProjectById(id)?.toDomain()
        }
    }

    override suspend fun saveProject(project: AudioProject) {
        withContext(Dispatchers.IO) {
            projectDao.insertProject(ProjectEntity.fromDomain(project))
        }
    }

    override suspend fun updateProject(project: AudioProject) {
        withContext(Dispatchers.IO) {
            val updated = project.copy(updatedAt = System.currentTimeMillis())
            projectDao.updateProject(ProjectEntity.fromDomain(updated))
        }
    }

    override suspend fun deleteProject(project: AudioProject) {
        withContext(Dispatchers.IO) {
            // Delete project record
            projectDao.deleteById(project.id)
            // Delete associated audio file if present
            project.audioFilePath?.let { path ->
                val file = File(path)
                if (file.exists() && file.isFile) {
                    file.delete()
                }
            }
        }
    }

    override suspend fun renameProject(id: String, newTitle: String) {
        withContext(Dispatchers.IO) {
            projectDao.updateTitle(id, newTitle.trim(), System.currentTimeMillis())
        }
    }

    /**
     * Strict requirement: Cloned project must make a 100% independent physical copy
     * of the audio file, ensuring neither project modifies the other's audio.
     */
    override suspend fun cloneProject(sourceId: String): Result<AudioProject> {
        return withContext(Dispatchers.IO) {
            val source = projectDao.getProjectById(sourceId)?.toDomain()
                ?: return@withContext Result.failure(IllegalArgumentException("پروژه مبدأ یافت نشد."))

            val newId = UUID.randomUUID().toString()
            var newAudioPath: String? = null

            // Clone audio file independently if exists
            source.audioFilePath?.let { oldPath ->
                val oldFile = File(oldPath)
                if (oldFile.exists() && oldFile.isFile) {
                    val clonedFile = File(audioDir, "audio_${newId}.wav")
                    oldFile.copyTo(clonedFile, overwrite = true)
                    newAudioPath = clonedFile.absolutePath
                }
            }

            val clonedProject = source.copy(
                id = newId,
                title = "${source.title} (کپی)",
                audioFilePath = newAudioPath,
                createdAt = System.currentTimeMillis(),
                updatedAt = System.currentTimeMillis()
            )

            projectDao.insertProject(ProjectEntity.fromDomain(clonedProject))
            Result.success(clonedProject)
        }
    }

    override suspend fun exportProjectToJson(project: AudioProject, targetFile: File): Result<File> {
        return withContext(Dispatchers.IO) {
            try {
                val jsonString = gson.toJson(project)
                targetFile.writeText(jsonString, Charsets.UTF_8)
                Result.success(targetFile)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    override suspend fun importProjectFromJson(jsonString: String): Result<AudioProject> {
        return withContext(Dispatchers.IO) {
            try {
                val parsed = gson.fromJson(jsonString, AudioProject::class.java)
                // Assign fresh ID to avoid collisions
                val newProject = parsed.copy(
                    id = UUID.randomUUID().toString(),
                    title = "${parsed.title} (وارد شده)",
                    createdAt = System.currentTimeMillis(),
                    updatedAt = System.currentTimeMillis(),
                    audioFilePath = null // Fresh import starts without local audio unless re-synthesized
                )
                projectDao.insertProject(ProjectEntity.fromDomain(newProject))
                Result.success(newProject)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
}
