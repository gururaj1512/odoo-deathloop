package com.project.odoohackthon.data.datastore

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.project.odoohackthon.data.User
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.Serializable


import kotlinx.serialization.encodeToString

import kotlinx.serialization.json.Json
private val Context.dataStore by preferencesDataStore("user_session")

@Serializable
data class CachedUser(
    val uid: String,
    val name: String,
    val email: String,
    val profileImageUrl: String? = null,
    val location: String? = null
)



class UserSessionManager(private val context: Context) {

    companion object {
        private val USER_JSON = stringPreferencesKey("user_json")
    }

    val userData: Flow<CachedUser?> = context.dataStore.data.map { preferences ->
        preferences[USER_JSON]?.let {
            try {
                Json.decodeFromString<CachedUser>(it)
            } catch (e: Exception) {
                null
            }
        }
    }

    suspend fun saveUser(user: User) {
        val cached = CachedUser(
            uid = user.uid,
            name = user.name,
            email = user.email,
            profileImageUrl = user.profileImageUrl,
            location = user.location
        )
        val json = Json.encodeToString(cached)
        context.dataStore.edit { it[USER_JSON] = json }
    }

    suspend fun clearUser() {
        context.dataStore.edit { it.clear() }
    }
}