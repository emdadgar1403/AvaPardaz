package com.avapardaz.app.ui.projects

import androidx.compose.foundation.background
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.avapardaz.app.domain.model.AudioProject
import com.avapardaz.app.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ProjectsScreen(
    projects: List<AudioProject>,
    onOpenProject: (AudioProject) -> Unit,
    onRenameProject: (String, String) -> Unit,
    onCloneProject: (String) -> Unit,
    onExportJson: (AudioProject) -> Unit,
    onShareAudio: (AudioProject) -> Unit,
    onDeleteProject: (AudioProject) -> Unit
) {
    var selectedProjectForActions by remember { mutableStateOf<AudioProject?>(null) }
    var projectToDelete by remember { mutableStateOf<AudioProject?>(null) }
    var projectToRename by remember { mutableStateOf<AudioProject?>(null) }
    var renameInput by remember { mutableStateOf("") }

    Box(modifier = Modifier.fillMaxSize()) {
        if (projects.isEmpty()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Icon(
                    imageVector = Icons.Default.FolderOpen,
                    contentDescription = null,
                    tint = TextTertiary,
                    modifier = Modifier.size(64.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "هنوز هیچ پروژه‌ای ایجاد نشده است",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "پروژه‌های شما پس از ساخت در این بخش مدیریت خواهند شد.",
                    fontSize = 13.sp,
                    color = TextSecondary
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .background(BackgroundLight)
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(vertical = 16.dp)
            ) {
                items(projects, key = { it.id }) { project ->
                    ProjectCardItem(
                        project = project,
                        onClick = { onOpenProject(project) },
                        onLongClick = { selectedProjectForActions = project },
                        onMoreClick = { selectedProjectForActions = project }
                    )
                }
            }
        }

        // Action Bottom Sheet
        selectedProjectForActions?.let { project ->
            ModalBottomSheet(
                onDismissRequest = { selectedProjectForActions = null },
                containerColor = SurfaceCard,
                shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 12.dp)
                ) {
                    Text(
                        text = project.title,
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    ActionRow(icon = Icons.Default.Edit, title = "ویرایش متن و پارامترها") {
                        selectedProjectForActions = null
                        onOpenProject(project)
                    }
                    ActionRow(icon = Icons.Default.DriveFileRenameOutline, title = "تغییر نام پروژه") {
                        renameInput = project.title
                        projectToRename = project
                        selectedProjectForActions = null
                    }
                    ActionRow(icon = Icons.Default.ContentCopy, title = "ساخت کپی مستقل (همراه فایل صوتی)") {
                        selectedProjectForActions = null
                        onCloneProject(project.id)
                    }
                    ActionRow(icon = Icons.Default.Code, title = "خروجی گرفتن ساختار پروژه (JSON)") {
                        selectedProjectForActions = null
                        onExportJson(project)
                    }
                    ActionRow(icon = Icons.Default.Share, title = "اشتراک‌گذاری فایل صوتی") {
                        selectedProjectForActions = null
                        onShareAudio(project)
                    }
                    Divider(modifier = Modifier.padding(vertical = 8.dp), color = DividerColor)
                    ActionRow(
                        icon = Icons.Default.Delete,
                        title = "حذف پروژه",
                        tint = AccentRed
                    ) {
                        projectToDelete = project
                        selectedProjectForActions = null
                    }
                    Spacer(modifier = Modifier.height(24.dp))
                }
            }
        }

        // Delete Confirmation Dialog
        projectToDelete?.let { project ->
            AlertDialog(
                onDismissRequest = { projectToDelete = null },
                title = { Text(text = "حذف پروژه صوتی") },
                text = {
                    Text(text = "آیا از حذف کامل «${project.title}» و فایل‌های صوتی متصل به آن اطمینان دارید؟")
                },
                confirmButton = {
                    Button(
                        onClick = {
                            onDeleteProject(project)
                            projectToDelete = null
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AccentRed)
                    ) {
                        Text(text = "حذف")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { projectToDelete = null }) {
                        Text(text = "انصراف")
                    }
                }
            )
        }

        // Rename Dialog
        projectToRename?.let { project ->
            AlertDialog(
                onDismissRequest = { projectToRename = null },
                title = { Text(text = "تغییر نام پروژه") },
                text = {
                    OutlinedTextField(
                        value = renameInput,
                        onValueChange = { renameInput = it },
                        label = { Text("نام جدید") },
                        modifier = Modifier.fillMaxWidth()
                    )
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (renameInput.isNotBlank()) {
                                onRenameProject(project.id, renameInput)
                            }
                            projectToRename = null
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = TurquoisePrimary)
                    ) {
                        Text(text = "ذخیره")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { projectToRename = null }) {
                        Text(text = "انصراف")
                    }
                }
            )
        }
    }
}

@Composable
fun ProjectCardItem(
    project: AudioProject,
    onClick: () -> Unit,
    onLongClick: () -> Unit,
    onMoreClick: () -> Unit
) {
    val dateFormat = remember { SimpleDateFormat("yyyy/MM/dd HH:mm", Locale.getDefault()) }
    val formattedDate = remember(project.updatedAt) { dateFormat.format(Date(project.updatedAt)) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp)),
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = project.title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = TextPrimary,
                    modifier = Modifier.weight(1f)
                )
                IconButton(onClick = onMoreClick) {
                    Icon(imageVector = Icons.Default.MoreVert, contentDescription = "عملیات")
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = project.rawText.take(90).let { if (project.rawText.length > 90) "$it..." else it },
                fontSize = 12.sp,
                color = TextSecondary,
                lineHeight = 18.sp
            )
            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "$formattedDate • ${project.engineType.technicalFamily}",
                    fontSize = 11.sp,
                    color = TextTertiary
                )
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(TurquoiseLight)
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "${project.durationSeconds.toInt()} ثانیه",
                        fontSize = 11.sp,
                        color = TurquoiseDark,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
fun ActionRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    tint: Color = TextPrimary,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .clickable { onClick() }
            .padding(vertical = 12.dp, horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(imageVector = icon, contentDescription = null, tint = tint, modifier = Modifier.size(20.dp))
        Spacer(modifier = Modifier.width(12.dp))
        Text(text = title, fontSize = 14.sp, color = tint, fontWeight = FontWeight.Medium)
    }
}
