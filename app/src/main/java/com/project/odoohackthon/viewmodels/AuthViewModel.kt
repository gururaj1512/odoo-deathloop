package com.project.odoohackthon.viewmodels

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import androidx.compose.runtime.*
import com.project.odoohackthon.data.User
import com.project.odoohackthon.data.datastore.UserSessionManager
import kotlinx.coroutines.flow.firstOrNull

class AuthViewModel(private val sessionManager: UserSessionManager) : ViewModel() {

    private val auth = FirebaseAuth.getInstance()
    private val firestore = FirebaseFirestore.getInstance()

    private val _user = mutableStateOf<User?>(null)
    val user: State<User?> = _user

    private val _loading = mutableStateOf(false)
    val loading: State<Boolean> = _loading

    private val _successLogin = mutableStateOf(false)
    val successLogin: State<Boolean> = _successLogin

    private val _successSignup = mutableStateOf(false)
    val successSignup: State<Boolean> = _successSignup

    private val _loginMessage = mutableStateOf<String?>(null)
    val loginMessage: State<String?> = _loginMessage

    private val _signUpMessage = mutableStateOf<String?>(null)
    val signUpMessage: State<String?> = _signUpMessage

    init {
        autoLogin()
    }

    private fun autoLogin() {
        viewModelScope.launch {
            try {
                val cachedUser = sessionManager.userData.firstOrNull()

                if (cachedUser != null && cachedUser.name.isNotBlank() && cachedUser.email.isNotBlank()) {
                    _user.value = User(
                        uid = cachedUser.uid,
                        name = cachedUser.name,
                        email = cachedUser.email,
                        location = cachedUser.location,
                        profileImageUrl = cachedUser.profileImageUrl
                    )
                    _successLogin.value = true
                    Log.d("AutoLogin", "✅ Auto-login with user: ${cachedUser.name}")
                } else {
                    Log.d("AutoLogin", "❌ No valid session found")
                }

            } catch (e: Exception) {
                Log.e("AutoLogin", "❌ Exception in autoLogin: ${e.localizedMessage}")
            }
        }
    }


    fun login(email: String, password: String) {
        _loading.value = true
        auth.signInWithEmailAndPassword(email, password)
            .addOnCompleteListener { task ->
                _loading.value = false
                if (task.isSuccessful) {
                    val uid = auth.currentUser?.uid ?: return@addOnCompleteListener
                    firestore.collection("users").document(uid).get()
                        .addOnSuccessListener { doc ->
                            val user = doc.toObject(User::class.java)
                            if (user != null) {
                                _user.value = user
                                _successLogin.value = true
                                _loginMessage.value = "Welcome, ${user.name}!"
                                viewModelScope.launch {
                                    sessionManager.saveUser(user)
                                }
                                Log.d("Login", "✅ Login successful: ${user.name}")
                            }
                        }
                        .addOnFailureListener { e ->
                            _loginMessage.value = "Failed to load user data."
                            Log.e("Login", "❌ Firestore fetch error: ${e.localizedMessage}")
                        }
                } else {
                    _loginMessage.value = task.exception?.localizedMessage ?: "Login failed"
                    Log.e("Login", "❌ Firebase Auth error: ${task.exception?.localizedMessage}")
                }
            }
    }

    fun signup(
        name: String,
        email: String,
        password: String,
        location: String?,
        skillsOffered: List<String> = emptyList(),
        skillsWanted: List<String> = emptyList(),
        availability: String = "Anytime",
        isPublic: Boolean = true
    ) {
        _loading.value = true
        auth.createUserWithEmailAndPassword(email, password)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val uid = auth.currentUser?.uid ?: return@addOnCompleteListener
                    val newUser = User(
                        uid = uid,
                        name = name,
                        email = email,
                        location = location,
                        skillsOffered = skillsOffered,
                        skillsWanted = skillsWanted,
                        availability = availability,
                        isPublic = isPublic
                    )
                    firestore.collection("users").document(uid).set(newUser)
                        .addOnSuccessListener {
                            _user.value = newUser
                            _successSignup.value = true
                            _signUpMessage.value = "Welcome, $name!"
                            viewModelScope.launch {
                                sessionManager.saveUser(newUser)
                            }
                            Log.d("Signup", "✅ User created: $name")
                        }
                        .addOnFailureListener { e ->
                            _signUpMessage.value = "Failed to save user data."
                            _successSignup.value = false
                            Log.e("Signup", "❌ Firestore save error: ${e.localizedMessage}")
                        }
                } else {
                    _signUpMessage.value = task.exception?.localizedMessage ?: "Signup failed"
                    _successSignup.value = false
                    Log.e("Signup", "❌ Firebase Auth error: ${task.exception?.localizedMessage}")
                }
                _loading.value = false
            }
    }

    fun logout(onLoggedOut: () -> Unit) {
        viewModelScope.launch {
            auth.signOut()
            sessionManager.clearUser()
            delay(100)
            _user.value = null
            _successLogin.value = false
            Log.d("Logout", "🚪 User logged out")
            onLoggedOut()
        }
    }
}
