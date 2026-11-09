package com.avapardaz.app.ui.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.HourglassEmpty
import androidx.compose.material.icons.filled.PlayArrow
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
import com.avapardaz.app.domain.model.TtsEngineType
import com.avapardaz.app.ui.theme.*

@Composable
fun HomeScreen(
    recentProjects: List<AudioProject>,
    onNavigateToGenerate: () -> Unit,
    onNavigateToModels: () -> Unit,
    onNavigateToProjects: () -> Unit,
    onOpenProject: (String) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundLight)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        // Hero Studio Banner
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = TurquoiseDark)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "آواپرداز | AvaPardaz",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "استودیوی هوشمند و آفلاین تولید محتوای صوتی و تبدیل متن فارسی به گفتار",
                        fontSize = 14.sp,
                        color = Color.White.copy(alpha = 0.9f),
                        lineHeight = 22.sp
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = onNavigateToGenerate,
                        colors = ButtonDefaults.buttonColors(containerColor = TurquoiseLight),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = null,
                            tint = TurquoiseDark
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "تولید صوت جدید",
                            fontWeight = FontWeight.Bold,
                            color = TurquoiseDark,
                            fontSize = 16.sp
                        )
                    }
                }
            }
        }

        // Engine Status Overview
        item {
            Text(
                text = "وضعیت موتورهای صوتی مستقل",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                EngineStatusMiniCard(
                    title = "Voice Engine",
                    tech = "Piper / VITS / MMS",
                    statusText = "اتصال در مرحله بعد",
                    isReady = false,
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToModels
                )
                EngineStatusMiniCard(
                    title = "Kokoro Engine",
                    tech = "Kokoro v0.19 Deep",
                    statusText = "اتصال در مرحله بعد",
                    isReady = false,
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToModels
                )
            }
        }

        // Recent Projects Section Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "آخرین پروژه‌ها",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = TextPrimary
                )
                TextButton(onClick = onNavigateToProjects) {
                    Text(text = "مشاهده همه", color = TurquoisePrimary)
                    Icon(
                        imageVector = Icons.Default.ChevronLeft,
                        contentDescription = null,
                        tint = TurquoisePrimary
                    )
                }
            }
        }

        if (recentProjects.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceCard)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "هنوز پروژه‌ای ثبت نشده است",
                            color = TextSecondary,
                            fontSize = 14.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "با دکمه «تولید صوت جدید» اولین پروژه خود را بسازید.",
                            color = TextTertiary,
                            fontSize = 12.sp
                        )
                    }
                }
            }
        } else {
            items(recentProjects) { project ->
                ProjectRecentRow(
                    project = project,
                    onClick = { onOpenProject(project.id) }
                )
            }
        }
    }
}

@Composable
fun EngineStatusMiniCard(
    title: String,
    tech: String,
    statusText: String,
    isReady: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier.clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(text = title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextPrimary)
            Text(text = tech, fontSize = 11.sp, color = TextTertiary)
            Spacer(modifier = Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = if (isReady) Icons.Default.CheckCircle else Icons.Default.HourglassEmpty,
                    contentDescription = null,
                    tint = if (isReady) AccentGreen else AccentAmber,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = statusText,
                    fontSize = 10.sp,
                    color = if (isReady) AccentGreen else AccentAmber,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@Composable
fun ProjectRecentRow(
    project: AudioProject,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = project.title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${project.engineType.displayName} • ${project.speakerId}",
                    fontSize = 11.sp,
                    color = TextSecondary
                )
            }
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(TurquoiseLight),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "پخش",
                    tint = TurquoiseDark,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}
