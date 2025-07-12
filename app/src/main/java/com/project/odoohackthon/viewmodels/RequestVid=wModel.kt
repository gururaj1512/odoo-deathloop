package com.project.odoohackthon.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.project.odoohackthon.data.SwapRequest
import com.project.odoohackthon.data.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class SwapRequestViewModel : ViewModel() {

    private val _requests = MutableStateFlow<List<SwapRequest>>(emptyList())
    val requests: StateFlow<List<SwapRequest>> = _requests

    private val _filterStatus = MutableStateFlow("All")

    init {
        loadRequests()
    }

    fun loadRequests() {
        // Simulated data fetch
        viewModelScope.launch {
            val dummyRequests = listOf(
                SwapRequest(
                    id = "1",
                    fromUser = User(uid = "u1", name = "Marc Demo", email = "demo@mail.com", profileImageUrl = null),
                    yourSkill = "UI Design",
                    theirSkill = "JavaScript",
                    status = "Pending",
                    rating = 3.8
                ),
                SwapRequest(
                    id = "2",
                    fromUser = User(uid = "u2", name = "Sara Singh", email = "sara@mail.com"),
                    yourSkill = "Marketing",
                    theirSkill = "Photoshop",
                    status = "Rejected",
                    rating = 4.2
                )
            )
            _requests.value = dummyRequests
        }
    }

    fun updateRequestStatus(id: String, newStatus: String) {
        _requests.value = _requests.value.map {
            if (it.id == id) it.copy(status = newStatus) else it
        }
    }

    fun filterByStatus(status: String) {
        _filterStatus.value = status
        // If using Firebase or backend, trigger query with filter
    }
}
