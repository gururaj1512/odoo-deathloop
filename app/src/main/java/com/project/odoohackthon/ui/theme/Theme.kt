package com.project.odoohackthon.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme

import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val LightColorScheme = lightColorScheme(
    primary = Primary,
    onPrimary = OnPrimary,
    primaryContainer = ChipBackground,
    onPrimaryContainer = ChipText,

    secondary = Secondary,
    onSecondary = OnSecondary,
    secondaryContainer = AccentLight,
    onSecondaryContainer = Accent,

    tertiary = Accent,
    onTertiary = OnPrimary,

    background = Background,
    onBackground = OnBackground,

    surface = Surface,
    onSurface = OnSurface,
    surfaceVariant = SurfaceVariant,
    onSurfaceVariant = OnSurfaceVariant,

    outline = BorderColor,
    outlineVariant = FocusedBorderColor,

    error = Error,
    onError = OnPrimary,

    inverseSurface = OnSurface,
    inverseOnSurface = Surface,
    inversePrimary = PrimaryVariant
)

@Composable
fun SkillSwapTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = AppTypography,
        shapes = AppShapes,
        content = content
    )
}