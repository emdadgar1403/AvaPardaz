package com.avapardaz.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection

private val AvaPardazLightColorScheme = lightColorScheme(
    primary = TurquoisePrimary,
    onPrimary = Color.White,
    primaryContainer = TurquoiseLight,
    onPrimaryContainer = TurquoiseDark,
    secondary = TurquoiseAccent,
    onSecondary = Color.White,
    background = BackgroundLight,
    onBackground = TextPrimary,
    surface = SurfaceCard,
    onSurface = TextPrimary,
    outline = DividerColor
)

@Composable
fun AvaPardazTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    // Force RTL layout direction across the entire Jetpack Compose hierarchy for Persian
    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        MaterialTheme(
            colorScheme = AvaPardazLightColorScheme,
            content = content
        )
    }
}
