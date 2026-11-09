package com.avapardaz.app.data.database

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface ProjectDao {

    @Query("SELECT * FROM audio_projects ORDER BY updatedAt DESC")
    fun getAllProjects(): Flow<List<ProjectEntity>>

    @Query("SELECT * FROM audio_projects WHERE id = :id LIMIT 1")
    suspend fun getProjectById(id: String): ProjectEntity?

    @Query("SELECT * FROM audio_projects ORDER BY updatedAt DESC LIMIT :limit")
    fun getRecentProjects(limit: Int): Flow<List<ProjectEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProject(project: ProjectEntity)

    @Update
    suspend fun updateProject(project: ProjectEntity)

    @Delete
    suspend fun deleteProject(project: ProjectEntity)

    @Query("DELETE FROM audio_projects WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("UPDATE audio_projects SET title = :newTitle, updatedAt = :updatedAt WHERE id = :id")
    suspend fun updateTitle(id: String, newTitle: String, updatedAt: Long)
}
