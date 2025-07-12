package com.project.odoohackthon.navigation


import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import com.project.odoohackthon.data.datastore.UserSessionManager
import com.project.odoohackthon.ui.screens.AuthScreen.LoginScreen
import com.project.odoohackthon.ui.screens.AuthScreen.SignUpScreen
import com.project.odoohackthon.ui.screens.MainSCreens.MainFeedScreen
import com.project.odoohackthon.ui.screens.MainSCreens.UserDetailScreen
import com.project.odoohackthon.ui.screens.Profile.ProfileScreen
import com.project.odoohackthon.ui.screens.RequestScreen.SwapRequestScreen


import com.project.odoohackthon.ui.screens.SplashScreen
import com.project.odoohackthon.ui.screens.welcome.WelcomeScreenFirst
import com.project.odoohackthon.ui.screens.welcome.WelcomeScreenSecond
import com.project.odoohackthon.ui.screens.welcome.WelcomeScreenThird

import com.project.odoohackthon.viewmodels.AuthViewModel

@Composable
fun AppHost(navController: NavHostController) {
    val context = LocalContext.current
    val sessionManager = remember { UserSessionManager(context) }

    val authViewModel: AuthViewModel = viewModel(
        factory = object : ViewModelProvider.Factory {
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                return AuthViewModel(sessionManager) as T
            }
        }
    )

    NavHost(navController = navController, startDestination = Screen.SplashScreen.routes) {

        // Splash
        composable(Screen.SplashScreen.routes) {
            SplashScreen(navController = navController, authViewModel = authViewModel)
        }

        // Welcome Screens
        composable(Screen.WelcomeScreen1.routes) {
            WelcomeScreenFirst(navController)
        }
        composable(Screen.WelcomeScreen2.routes) {
            WelcomeScreenSecond(navController)
        }
        composable(Screen.WelcomeScreen3.routes) {
            WelcomeScreenThird(navController)
        }

        // Authentication
        composable(Screen.SignUp.routes) {
            SignUpScreen(navController = navController)
        }
        composable(Screen.Login.routes) {
            LoginScreen(navController = navController)
        }

        // Dashboard & Main
        composable(Screen.MainDashBoard.routes) {
            MainFeedScreen(navController)
        }

        composable("userDetail/{userId}") { backStackEntry ->
            val userId = backStackEntry.arguments?.getString("userId") ?: return@composable
            UserDetailScreen(userId = userId)
        }


        composable("swapRequests") {
            SwapRequestScreen(navController)
        }

// Add this to your AppHost navigation
        composable("profile") {
            ProfileScreen(navController = navController)
        }




//
//        // Profile
//        composable(Screen.Profile.routes) {
//            ProfileScreen(navController = navController, authViewModel = authViewModel)
//        }
//
//        // Create Post
//        composable(Screen.CreatePost.routes) {
//            CreatePostScreen(navController = navController, authViewModel = authViewModel)
//        }
//
//        // Applicants for a post
//        composable("applicants/{postId}") { backStackEntry ->
//            val postId = backStackEntry.arguments?.getString("postId") ?: return@composable
//            ApplicantsScreen(postId = postId, navController = navController)
//        }
    }
}