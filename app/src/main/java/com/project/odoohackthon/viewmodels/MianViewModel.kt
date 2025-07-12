package com.project.odoohackthon.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.project.odoohackthon.data.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {

    private val db = FirebaseFirestore.getInstance()
    private val currentUserId = FirebaseAuth.getInstance().currentUser?.uid

    private val _users = MutableStateFlow<List<User>>(emptyList())
    val users: StateFlow<List<User>> = _users

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _hasMore = MutableStateFlow(true)
    val hasMore: StateFlow<Boolean> = _hasMore

    private var lastUserSnapshot: DocumentSnapshot? = null

    private var currentSkillFilter: String? = null
    private var currentSearchQuery: String? = null

    init {
        loadMoreUsers(reset = true)
    }

    fun applyFilters(skill: String?, searchQuery: String?) {
        currentSkillFilter = skill
        currentSearchQuery = searchQuery
        loadMoreUsers(reset = true)
    }

    fun loadMoreUsers(reset: Boolean = false) {
        if (_isLoading.value || (!_hasMore.value && !reset)) return

        _isLoading.value = true
        if (reset) {
            _users.value = emptyList()
            lastUserSnapshot = null
            _hasMore.value = true
        }

        var query = db.collection("users")
            .orderBy("name")
            .limit(10)

        currentSkillFilter?.takeIf { it.isNotBlank() }?.let { skill ->
            query = db.collection("users")
                .whereArrayContains("skillsOffered", skill)
                .orderBy("name")
                .limit(10)
        }

        lastUserSnapshot?.let {
            query = query.startAfter(it)
        }

        query.get()
            .addOnSuccessListener { snapshot ->
                val fetched = snapshot.documents.mapNotNull { it.toObject(User::class.java) }

                // ✅ Filter out current user
                val filtered = fetched.filter { it.uid != currentUserId }

                // ✅ Apply search filter
                val searched = currentSearchQuery?.let { query ->
                    filtered.filter {
                        it.name.contains(query, true) ||
                                it.skillsOffered.any { skill -> skill.contains(query, true) }
                    }
                } ?: filtered

                _users.value += searched
                lastUserSnapshot = snapshot.documents.lastOrNull()
                _hasMore.value = snapshot.size() >= 10
                _isLoading.value = false
            }
            .addOnFailureListener {
                _isLoading.value = false
            }
    }

    fun sendSwapRequest(targetUserId: String) {
        val swapRequest = mapOf(
            "from" to currentUserId,
            "to" to targetUserId,
            "status" to "pending"
        )
        db.collection("swap_requests").add(swapRequest)
    }

    fun sendDetailedSwapRequest(
        targetUser: User,
        yourSkill: String,
        theirSkill: String,
        message: String
    ) {
        val request = mapOf(
            "from" to currentUserId,
            "to" to targetUser.uid,
            "yourSkill" to yourSkill,
            "theirSkill" to theirSkill,
            "message" to message,
            "status" to "pending",
            "timestamp" to FieldValue.serverTimestamp()
        )

        db.collection("swap_requests").add(request)
    }
}
