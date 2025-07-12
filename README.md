# Firebase Authentication Dashboard

A modern web application with Firebase authentication, featuring sign up, login, and role-based dashboard functionality.

## Features

- 🔐 Firebase Authentication (Email/Password)
- 👥 User Registration with Role Selection (User/Admin)
- 🔑 Secure Login System
- 📊 Role-based Dashboard
- 🎨 Modern, Responsive UI
- 📱 Mobile-friendly Design

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
4. Set up Firestore Database:
   - Go to Firestore Database
   - Create database in test mode
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app icon (</>) to add a web app
   - Copy the configuration object

### 2. Update Firebase Configuration

Open `src/firebase.js` and replace the `firebaseConfig` object with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Authentication Flow

1. **Sign Up**: Users can create accounts with email/password and select a role (User or Admin)
2. **Login**: Existing users can sign in with their credentials
3. **Dashboard**: After successful authentication, users are redirected to a role-based dashboard

### User Roles

- **User**: Standard user with basic dashboard access
- **Admin**: Administrative user with additional management options

### Navigation

- `#login` - Login page
- `#signup` - Registration page
- `#dashboard` - User dashboard (requires authentication)

## Project Structure

```
src/
├── components/
│   ├── Login.js          # Login component
│   ├── SignUp.js         # Registration component
│   └── Dashboard.js      # Dashboard component
├── firebase.js           # Firebase configuration and auth functions
├── router.js             # Application routing
├── main.js              # Application entry point
└── style.css            # Styling
```

## Firebase Security Rules

Make sure to set up proper Firestore security rules for the `users` collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features Implemented

- ✅ User registration with email/password
- ✅ User login/logout functionality
- ✅ Role-based user management (User/Admin)
- ✅ Firestore user collection creation
- ✅ Protected dashboard routes
- ✅ Modern, responsive UI design
- ✅ Error handling and validation
- ✅ Authentication state management

## Next Steps

To enhance the application, consider adding:

- Password reset functionality
- Email verification
- Social authentication (Google, Facebook, etc.)
- User profile management
- Admin user management panel
- Activity logging
- Real-time data updates
