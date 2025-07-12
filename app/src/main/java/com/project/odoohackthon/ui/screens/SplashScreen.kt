package com.project.odoohackthon.ui.screens



import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember

import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavHostController
import com.project.odoohackthon.navigation.Screen
import com.project.odoohackthon.viewmodels.AuthViewModel

import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first

@Composable
fun SplashScreen(navController: NavHostController, authViewModel: AuthViewModel) {
    val user by authViewModel.user
    val successLogin by authViewModel.successLogin

    LaunchedEffect(Unit) {
        delay(2000)

        if (successLogin && user != null) {
            navController.navigate(Screen.MainDashBoard.routes) {
                popUpTo(Screen.SplashScreen.routes) { inclusive = true }
            }
        } else {
            navController.navigate(Screen.WelcomeScreen1.routes) {
                popUpTo(Screen.SplashScreen.routes) { inclusive = true }
            }
        }
    }

    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text("🚀 Skill Swap", style = MaterialTheme.typography.headlineLarge)
    }
}
