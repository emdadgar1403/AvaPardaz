package com.avapardaz.app.ui.generate

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.avapardaz.app.audio.processing.PersianTextNormalizer
import com.avapardaz.app.domain.model.*
import com.avapardaz.app.ui.theme.*

@Composable
fun GenerateScreen(
    onSaveProject: (AudioProject) -> Unit
) {
    var textInput by remember { mutableStateOf("") }
    var selectedEngine by remember { mutableStateOf(TtsEngineType.VOICE_ENGINE) }
    var selectedSpeaker by remember { mutableStateOf("piper_fa_nima") }
    var speed by remember { mutableFloatStateOf(1.0f) }
    var pitch by remember { mutableFloatStateOf(0.0f) }
    var smartPauseEnabled by remember { mutableStateOf(true) }
    var commaPauseMs by remember { mutableIntStateOf(300) }
    var periodPauseMs by remember { mutableIntStateOf(600) }
    var paragraphPauseMs by remember { mutableIntStateOf(900) }
    var selectedEmotion by remember { mutableStateOf(EmotionTag.NEUTRAL) }
    var isAdvancedExpanded by remember { mutableStateOf(false) }
    var sampleRate by remember { mutableIntStateOf(22050) }

    var isGenerating by remember { mutableStateOf(false) }
    var statusMessage by remember { mutableStateOf<String?>(null) }
    var showHonestNotice by remember { mutableStateOf(false) }

    val wordCount = remember(textInput) { PersianTextNormalizer.countWords(textInput) }
    val charCount = remember(textInput) { PersianTextNormalizer.countCharacters(textInput) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundLight)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        // Persian Text Input Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "متن ورودی استودیو",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = textInput,
                        onValueChange = { textInput = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(min = 140.dp),
                        placeholder = {
                            Text(
                                text = "متن فارسی خود را برای تبدیل به صوت وارد کنید...",
                                fontSize = 13.sp,
                                color = TextTertiary
                            )
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = TurquoisePrimary,
                            unfocusedBorderColor = DividerColor
                        ),
                        shape = RoundedCornerShape(10.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "تعداد کلمات: $wordCount",
                            fontSize = 12.sp,
                            color = TextSecondary
                        )
                        Text(
                            text = "تعداد نویسه‌ها: $charCount",
                            fontSize = 12.sp,
                            color = TextSecondary
                        )
                    }
                }
            }
        }

        // Engine & Voice Selection Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "انتخاب موتور و گوینده",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    // Engine Selection Tabs
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(BackgroundLight)
                            .padding(4.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (selectedEngine == TtsEngineType.VOICE_ENGINE) TurquoisePrimary else Color.Transparent)
                                .clickable {
                                    selectedEngine = TtsEngineType.VOICE_ENGINE
                                    selectedSpeaker = "piper_fa_nima"
                                }
                                .padding(vertical = 10.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "Voice Engine",
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = if (selectedEngine == TtsEngineType.VOICE_ENGINE) Color.White else TextSecondary
                            )
                        }
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (selectedEngine == TtsEngineType.KOKORO_ENGINE) TurquoisePrimary else Color.Transparent)
                                .clickable {
                                    selectedEngine = TtsEngineType.KOKORO_ENGINE
                                    selectedSpeaker = "kokoro_fa_maryam"
                                }
                                .padding(vertical = 10.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "Kokoro Engine",
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = if (selectedEngine == TtsEngineType.KOKORO_ENGINE) Color.White else TextSecondary
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    Text(text = "گوینده انتخابی:", fontSize = 13.sp, color = TextSecondary)
                    Spacer(modifier = Modifier.height(6.dp))
                    // Speaker Radio Options
                    val speakers = if (selectedEngine == TtsEngineType.VOICE_ENGINE) {
                        listOf(
                            "piper_fa_nima" to "نیما (کتاب صوتی و مستند)",
                            "piper_fa_sara" to "سارا (پادکست و آموزش)",
                            "mms_fa_ramtin" to "رامتین (مدل MMS فراگیر)"
                        )
                    } else {
                        listOf(
                            "kokoro_fa_maryam" to "مریم (رمان و لحن احساسی)",
                            "kokoro_fa_arash" to "آرش (پادکست تخصصی و رسمی)"
                        )
                    }

                    speakers.forEach { (id, name) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { selectedSpeaker = id }
                                .padding(vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = (selectedSpeaker == id),
                                onClick = { selectedSpeaker = id },
                                colors = RadioButtonDefaults.colors(selectedColor = TurquoisePrimary)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = name, fontSize = 13.sp, color = TextPrimary)
                        }
                    }
                }
            }
        }

        // Voice Controls (Speed & Pitch)
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "تنظیمات سرعت و ارتفاع صدا",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "سرعت گفتار: ${(speed * 10).toInt() / 10f}x",
                        fontSize = 13.sp,
                        color = TextSecondary
                    )
                    Slider(
                        value = speed,
                        onValueChange = { speed = it },
                        valueRange = 0.5f..2.0f,
                        colors = SliderDefaults.colors(
                            thumbColor = TurquoisePrimary,
                            activeTrackColor = TurquoisePrimary
                        )
                    )

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "زیر و بمی صدا (Pitch): ${(pitch * 10).toInt() / 10f}",
                        fontSize = 13.sp,
                        color = TextSecondary
                    )
                    Slider(
                        value = pitch,
                        onValueChange = { pitch = it },
                        valueRange = -5.0f..5.0f,
                        colors = SliderDefaults.colors(
                            thumbColor = TurquoiseDark,
                            activeTrackColor = TurquoiseDark
                        )
                    )
                }
            }
        }

        // Smart Pauses & Emotions
        item {
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
                        Column {
                            Text(
                                text = "مکث هوشمند علائم نگارشی",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = TextPrimary
                            )
                            Text(
                                text = "اعمال مکث خودکار بر روی کاما، نقطه و بندها",
                                fontSize = 11.sp,
                                color = TextTertiary
                            )
                        }
                        Switch(
                            checked = smartPauseEnabled,
                            onCheckedChange = { smartPauseEnabled = it },
                            colors = SwitchDefaults.colors(checkedThumbColor = TurquoisePrimary)
                        )
                    }

                    if (smartPauseEnabled) {
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            PauseBadge(label = "کاما: ${commaPauseMs}ms", modifier = Modifier.weight(1f))
                            PauseBadge(label = "نقطه: ${periodPauseMs}ms", modifier = Modifier.weight(1f))
                            PauseBadge(label = "بند: ${paragraphPauseMs}ms", modifier = Modifier.weight(1f))
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "لحن و احساس بیان:",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = TextSecondary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        EmotionTag.values().take(3).forEach { tag ->
                            val isSelected = selectedEmotion == tag
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSelected) TurquoiseLight else BackgroundLight)
                                    .clickable { selectedEmotion = tag }
                                    .padding(vertical = 8.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = tag.labelFa.substringBefore(" "),
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isSelected) TurquoiseDark else TextSecondary
                                )
                            }
                        }
                    }
                }
            }
        }

        // Collapsible Advanced Settings
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { isAdvancedExpanded = !isAdvancedExpanded },
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "تنظیمات پیشرفته مهندسی صوت",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = TextPrimary
                        )
                        Icon(
                            imageVector = if (isAdvancedExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                            contentDescription = null,
                            tint = TextSecondary
                        )
                    }

                    AnimatedVisibility(visible = isAdvancedExpanded) {
                        Column(modifier = Modifier.padding(top = 12.dp)) {
                            Text(
                                text = "نرخ نمونه‌برداری خروجی (Sample Rate): $sampleRate Hz",
                                fontSize = 12.sp,
                                color = TextSecondary
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                listOf(16000, 22050, 24000).forEach { rate ->
                                    FilterChip(
                                        selected = sampleRate == rate,
                                        onClick = { sampleRate = rate },
                                        label = { Text("$rate Hz", fontSize = 11.sp) }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Action Buttons & Honest Status Callout
        item {
            if (showHonestNotice) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7))
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Info,
                                contentDescription = null,
                                tint = AccentAmber,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "گزارش وضعیت واقعی موتورهای صوتی",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = Color(0xFF92400E)
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "قرارداد معماری و اتصال انتزاعی $selectedEngine تعریف شده است. وضعیت فعلی: «اتصال در مرحله بعد (تعریف قرارداد فنی)». هیچ موتور یا صدای ساختگی جعل نخواهد شد.",
                            fontSize = 12.sp,
                            color = Color(0xFF92400E),
                            lineHeight = 18.sp
                        )
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = {
                        showHonestNotice = true
                        statusMessage = "بررسی قرارداد فنی موتور $selectedEngine..."
                    },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = TurquoisePrimary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(imageVector = Icons.Default.GraphicEq, contentDescription = null)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "شروع تولید صوت", fontWeight = FontWeight.Bold)
                }

                OutlinedButton(
                    onClick = {
                        showHonestNotice = false
                        statusMessage = null
                    },
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(text = "توقف", color = AccentRed)
                }
            }
        }
    }
}

@Composable
fun PauseBadge(label: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(BackgroundLight)
            .padding(vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(text = label, fontSize = 11.sp, color = TextSecondary)
    }
}
