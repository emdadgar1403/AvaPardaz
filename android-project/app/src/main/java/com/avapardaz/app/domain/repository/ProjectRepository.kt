package com.avapardaz.app.domain.repository

import com.avapardaz.app.domain.model.AudioProject
import kotlinx.coroutines.flow.Flow
import java.io.File

interface ProjectRepository {
    fun getAllProjects(): Flow<List<AudioProject>>
    fun getRecentProjects(limit: Int = 5): Flow<List<AudioProject>>
    suspend fun getProjectById(id: String): AudioProject?
    suspend fun saveProject(project: AudioProject)
    suspend fun updateProject(project: AudioProject)
    suspend fun deleteProject(project: AudioProject)
    suspend fun renameProject(id: String, newTitle: String)
    suspend fun cloneProject(sourceId: String): Result<AudioProject>
    suspend fun exportProjectToJson(project: AudioProject, targetFile: File): Result<File>
    suspend fun importProjectFromJson(jsonString: String): Result<AudioProject>
}
