package com.avapardaz.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.Settings
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val titleFa: String, val icon: ImageVector) {
    data object Home : Screen("home", "خانه", Icons.Default.Home)
    data object Generate : Screen("generate", "تولید صوت", Icons.Default.GraphicEq)
    data object Projects : Screen("projects", "پروژه‌های من", Icons.Default.Folder)
    data object Models : Screen("models", "مدل‌ها", Icons.Default.Layers)
    data object Settings : Screen("settings", "تنظیمات", Icons.Default.Settings)

    companion object {
        val bottomNavItems = listOf(Home, Generate, Projects, Models, Settings)
    }
}
