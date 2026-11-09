package com.avapardaz.app.ui.settings

import androidx.compose.foundation.background
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
import com.avapardaz.app.data.preferences.UserSettings
import com.avapardaz.app.ui.theme.*

@Composable
fun SettingsScreen(
    userSettings: UserSettings,
    onExportBackup: () -> Unit,
    onImportBackup: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundLight)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        // General Section
        item {
            SettingCard(title = "تنظیمات عمومی استودیو") {
                SettingRow(
                    title = "زبان و جهت رابط کاربری",
                    subtitle = "فارسی (راست‌چین - RTL)",
                    icon = Icons.Default.Language
                )
                Divider(color = DividerColor, modifier = Modifier.padding(vertical = 8.dp))
                SettingRow(
                    title = "ذخیره خودکار پیش‌نویس پروژه‌ها",
                    subtitle = if (userSettings.isAutoSaveEnabled) "فعال" else "غیرفعال",
                    icon = Icons.Default.Save
                )
            }
        }

        // Audio Storage Path
        item {
            SettingCard(title = "مسیر ذخیره‌سازی فایل‌ها") {
                SettingRow(
                    title = "پوشه خروجی صوت در حافظه محلی",
                    subtitle = userSettings.exportStoragePath,
                    icon = Icons.Default.FolderSpecial
                )
            }
        }

        // Backup & Restore
        item {
            SettingCard(title = "پشتیبان‌گیری و انتقال داده‌ها") {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Button(
                        onClick = onExportBackup,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = TurquoisePrimary),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(imageVector = Icons.Default.FileUpload, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "خروجی JSON", fontSize = 12.sp)
                    }

                    OutlinedButton(
                        onClick = onImportBackup,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(imageVector = Icons.Default.FileDownload, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "ورود JSON", fontSize = 12.sp)
                    }
                }
            }
        }

        // About & Version Info
        item {
            SettingCard(title = "درباره آواپرداز") {
                Text(
                    text = "آواپرداز | AvaPardaz",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "نسخه: 1.0.0-alpha (معماری مستقل Jetpack Compose + Room + DataStore)",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "این استودیو با رعایت کامل حریم خصوصی، پردازش آفلاین متن فارسی و معماری مستقل چند موتوره توسعه یافته است.",
                    fontSize = 12.sp,
                    color = TextTertiary,
                    lineHeight = 18.sp
                )
            }
        }
    }
}

@Composable
fun SettingCard(
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = title,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp,
                color = TurquoiseDark
            )
            Spacer(modifier = Modifier.height(12.dp))
            content()
        }
    }
}

@Composable
fun SettingRow(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(TurquoiseLight),
            contentAlignment = Alignment.Center
        ) {
            Icon(imageVector = icon, contentDescription = null, tint = TurquoiseDark, modifier = Modifier.size(20.dp))
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(text = title, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = TextPrimary)
            Text(text = subtitle, fontSize = 11.sp, color = TextSecondary)
        }
    }
}
