package com.project.odoohackthon

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.project.odoohackthon.navigation.AppHost

import com.project.odoohackthon.ui.theme.SkillSwapTheme

@Composable
fun App() {
    SkillSwapTheme  {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            AppHost(navController = rememberNavController())
        }
    }
}