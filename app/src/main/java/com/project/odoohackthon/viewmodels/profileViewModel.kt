package com.project.odoohackthon.viewmodels


import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.project.odoohackthon.data.User
import com.project.odoohackthon.data.datastore.UserSessionManager

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class ProfileViewModel(private val sessionManager: UserSessionManager) : ViewModel() {

    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user

    private val _isEditing = MutableStateFlow(false)
    val isEditing: StateFlow<Boolean> = _isEditing

    fun loadUser() {
        viewModelScope.launch {
            sessionManager.userData.collect { cachedUser ->
                _user.value = cachedUser?.let {
                    User(
                        uid = it.uid,
                        name = it.name,
                        email = it.email,
                        location = null,
                        profileImageUrl = it.profileImageUrl,
                        skillsOffered = emptyList(),
                        skillsWanted = emptyList(),
                        availability = "Anytime",
                        isPublic = true
                    )
                }
            }
        }
    }

    fun toggleEdit() {
        _isEditing.value = !_isEditing.value
    }

    fun updateField(field: String, value: String) {
        _user.value = _user.value?.copy(
            name = if (field == "name") value else _user.value!!.name,
            email = if (field == "email") value else _user.value!!.email,
            location = if (field == "location") value else _user.value!!.location,
            availability = if (field == "availability") value else _user.value!!.availability
        )
    }

    fun updatePublicStatus(isPublic: Boolean) {
        _user.value = _user.value?.copy(isPublic = isPublic)
    }

    fun updateProfileImage(newUri: Uri) {
        _user.value = _user.value?.copy(profileImageUrl = newUri.toString())
    }

    fun saveChanges() {
        viewModelScope.launch {
            _user.value?.let {
                sessionManager.saveUser(it)
                _isEditing.value = false
            }
        }
    }
}
