package com.avapardaz.app.ui.models

import androidx.compose.foundation.background
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
import com.avapardaz.app.domain.model.ModelInfo
import com.avapardaz.app.domain.model.ModelStatus
import com.avapardaz.app.domain.model.TtsEngineType
import com.avapardaz.app.ui.theme.*

@Composable
fun ModelsScreen(
    models: List<ModelInfo>,
    defaultEngine: TtsEngineType,
    onSelectDefaultEngine: (TtsEngineType) -> Unit,
    onImportLocalModel: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundLight)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        // Engine Selector Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "موتور صوتی پیش‌فرض استودیو",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    TtsEngineType.values().forEach { engine ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = defaultEngine == engine,
                                onClick = { onSelectDefaultEngine(engine) },
                                colors = RadioButtonDefaults.colors(selectedColor = TurquoisePrimary)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Column {
                                Text(
                                    text = engine.displayName,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = TextPrimary
                                )
                                Text(
                                    text = engine.technicalFamily,
                                    fontSize = 11.sp,
                                    color = TextTertiary
                                )
                            }
                        }
                    }
                }
            }
        }

        // Import Local Model Button
        item {
            OutlinedButton(
                onClick = onImportLocalModel,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(imageVector = Icons.Default.FileOpen, contentDescription = null, tint = TurquoisePrimary)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "معرفی فایل مدل جدید از حافظه دستگاه (ONNX / Weights)",
                    color = TurquoiseDark,
                    fontSize = 13.sp
                )
            }
        }

        // Models List Header
        item {
            Text(
                text = "مدل‌های ثبت‌شده و تعاریف فنی",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = TextPrimary
            )
        }

        items(models) { model ->
            ModelCardItem(model = model)
        }
    }
}

@Composable
fun ModelCardItem(model: ModelInfo) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
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
                    text = model.nameFa,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = TextPrimary
                )
                val mb = model.sizeBytes / (1024 * 1024)
                Text(
                    text = "${mb} MB",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = model.description,
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
                    text = "نرخ نمونه: ${model.sampleRate} Hz",
                    fontSize = 11.sp,
                    color = TextTertiary
                )
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(
                            when (model.status) {
                                ModelStatus.INSTALLED -> Color(0xFFD1FAE5)
                                ModelStatus.CONTRACT_PENDING -> Color(0xFFFEF3C7)
                                else -> Color(0xFFFEE2E2)
                            }
                        )
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = model.status.labelFa,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = when (model.status) {
                            ModelStatus.INSTALLED -> Color(0xFF065F46)
                            ModelStatus.CONTRACT_PENDING -> Color(0xFF92400E)
                            else -> Color(0xFF991B1B)
                        }
                    )
                }
            }
        }
    }
}
