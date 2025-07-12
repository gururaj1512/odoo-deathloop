package com.project.odoohackthon.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

val AppShapes = Shapes(
    // Extra Small - for small chips, badges, indicators
    extraSmall = RoundedCornerShape(6.dp),

    // Small - for buttons, input fields, small cards
    small = RoundedCornerShape(12.dp),

    // Medium - for cards, dialogs, containers
    medium = RoundedCornerShape(20.dp),

    // Large - for bottom sheets, large cards, modals
    large = RoundedCornerShape(28.dp),

    // Extra Large - for special containers, hero sections
    extraLarge = RoundedCornerShape(36.dp)
)

// Custom shapes for specific components - Modern & Consistent
object CustomShapes {
    val buttonShape = RoundedCornerShape(12.dp)
    val cardShape = RoundedCornerShape(20.dp)
    val chipShape = RoundedCornerShape(24.dp)
    val textFieldShape = RoundedCornerShape(12.dp)
    val bottomSheetShape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)
    val fabShape = RoundedCornerShape(20.dp)
    val dialogShape = RoundedCornerShape(24.dp)
    val imageShape = RoundedCornerShape(16.dp)
    val containerShape = RoundedCornerShape(18.dp)
}