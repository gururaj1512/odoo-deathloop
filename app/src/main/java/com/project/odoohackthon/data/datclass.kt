package com.project.odoohackthon.data

import com.google.gson.annotations.SerializedName
import kotlinx.serialization.Serializable

data class LoginRequest(
    val email: String,
    val password: String
)



data class LoginResponse(
    val success: Boolean,
    val token: String? = null,
    val message: String? = null,
    val user: User? = null
)

data class SignUpRequest(
    val name: String,
    val age: Int,
    val username: String,
    val email: String,
    val phone: String,
    val password: String
)


data class User(
    val uid: String = "",
    val name: String = "",
    val email: String = "",
    val location: String? = null,
    val profileImageUrl: String? = null,
    val skillsOffered: List<String> = emptyList(),
    val skillsWanted: List<String> = emptyList(),
    val availability: String = "Anytime",
    val isPublic: Boolean = true
)

data class SignUpResponse(
    val success: Boolean,
    val message: String? = null, // for failure cases
    val token: String? = null,   // for success case
    val user: User? = null       // null if already exists or error
)

data class UserProfile(
    val username: String,
    val email: String,
    val name: String?,
    val age: Int?,
    val phone: String?,
    val address: String?,
    val profilePicUrl: String?
)


data class PostUpload(
    val username: String,
    val caption: String,
    val imageUrl: String
)

data class Post(
    @SerializedName("_id")
    val id: String,
    @SerializedName("title")
    val username: String, // OR title, depending on your mapping
    @SerializedName("content")
    val caption: String,
    val email: String,
    val mediaUrl: String?,
    @SerializedName("createdAt")
    val timestamp: String
)
data class FeedResponse(
    val success: Boolean,
    val page: Int,
    val total: Int,
    val feeds: List<Post>
)
data class ProfileRequest(
    val email :String
)

data class ProfileUpdateRequest(
    val email: String,
    val name: String?,
    val role: String?
)


data class CreatePostResponse(
    val success: Boolean,
    val message: String,
    val feed: Feed?
)
data class Feed(
    val _id: String,
    val title: String,
    val content: String,
    val email: String,
    val mediaUrl: String?,     // Nullable in case of no media
    val mediaType: String?,    // Nullable (image or video)
    val createdAt: String,
    val __v: Int               // Mongoose version field
)
data class DisplayPost(
    val _id: String,          // <-- Required to apply
    val username: String,
    val avatarUrl: String?,
    val caption: String,
    val mediaUrl: String?,
    val timestamp: String
)

data class ApplyRequest(
    val userId: String,
    val message: String = ""  // Optional
)

data class ApplyResponse(
    val success: Boolean,
    val message: String
)
@Serializable
data class ApplicantResponse(
    val success: Boolean,
    val count: Int,
    val applicants: List<Applicant>
)

@Serializable
data class Applicant(
    val _id: String,
    val postId: String,
    val applicantId: ApplicantUser,
    val message: String = "",
    val status: String,
    val appliedAt: String
)

@Serializable
data class ApplicantUser(
    val _id: String,
    val name: String,
    val email: String,
    val avatar: Avatar?
)
@Serializable
data class Avatar(val public_id : String , val url: String)



data class SwapRequest(
    val id: String = "",
    val fromUser: User,
    val yourSkill: String,
    val theirSkill: String,
    val message: String? = "",
    val status: String = "Pending", // "Pending", "Accepted", "Rejected"
    val rating: Double = 0.0
)
