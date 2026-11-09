package com.avapardaz.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.avapardaz.app.data.preferences.UserSettings
import com.avapardaz.app.domain.model.AudioProject
import com.avapardaz.app.domain.model.ModelInfo
import com.avapardaz.app.domain.model.TtsEngineType
import com.avapardaz.app.ui.dashboard.HomeScreen
import com.avapardaz.app.ui.generate.GenerateScreen
import com.avapardaz.app.ui.models.ModelsScreen
import com.avapardaz.app.ui.navigation.Screen
import com.avapardaz.app.ui.projects.ProjectsScreen
import com.avapardaz.app.ui.settings.SettingsScreen
import com.avapardaz.app.ui.theme.AvaPardazTheme
import com.avapardaz.app.ui.theme.TurquoiseDark
import com.avapardaz.app.ui.theme.TurquoisePrimary

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val app = application as? AvaPardazApplication

        setContent {
            AvaPardazTheme {
                var currentScreen by remember { mutableStateOf<Screen>(Screen.Home) }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    topBar = {
                        CenterAlignedTopAppBar(
                            title = {
                                Text(
                                    text = currentScreen.titleFa,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 17.sp,
                                    color = TurquoiseDark
                                )
                            },
                            colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                                containerColor = MaterialTheme.colorScheme.background
                            )
                        )
                    },
                    bottomBar = {
                        NavigationBar(
                            containerColor = MaterialTheme.colorScheme.surface
                        ) {
                            Screen.bottomNavItems.forEach { screen ->
                                val selected = currentScreen == screen
                                NavigationBarItem(
                                    selected = selected,
                                    onClick = { currentScreen = screen },
                                    icon = {
                                        Icon(
                                            imageVector = screen.icon,
                                            contentDescription = screen.titleFa
                                        )
                                    },
                                    label = {
                                        Text(
                                            text = screen.titleFa,
                                            fontSize = 11.sp,
                                            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
                                        )
                                    },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = TurquoisePrimary,
                                        selectedTextColor = TurquoisePrimary,
                                        indicatorColor = MaterialTheme.colorScheme.primaryContainer
                                    )
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    Surface(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        when (currentScreen) {
                            Screen.Home -> HomeScreen(
                                recentProjects = emptyList(),
                                onNavigateToGenerate = { currentScreen = Screen.Generate },
                                onNavigateToModels = { currentScreen = Screen.Models },
                                onNavigateToProjects = { currentScreen = Screen.Projects },
                                onOpenProject = { currentScreen = Screen.Generate }
                            )

                            Screen.Generate -> GenerateScreen(
                                onSaveProject = { /* Save via repository */ }
                            )

                            Screen.Projects -> ProjectsScreen(
                                projects = emptyList(),
                                onOpenProject = { currentScreen = Screen.Generate },
                                onRenameProject = { _, _ -> },
                                onCloneProject = { },
                                onExportJson = { },
                                onShareAudio = { },
                                onDeleteProject = { }
                            )

                            Screen.Models -> ModelsScreen(
                                models = emptyList(),
                                defaultEngine = TtsEngineType.VOICE_ENGINE,
                                onSelectDefaultEngine = { },
                                onImportLocalModel = { }
                            )

                            Screen.Settings -> SettingsScreen(
                                userSettings = UserSettings(),
                                onExportBackup = { },
                                onImportBackup = { }
                            )
                        }
                    }
                }
            }
        }
    }
}
