import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import UserProfile from './components/UserProfile.jsx';
import DashboardUsers from './components/DashboardUsers.jsx';
import SkillSwap from './components/SkillSwap.jsx';
import MyRequests from './components/MyRequests.jsx';
import AllFriends from './components/AllFriends.jsx';
import Chat from './components/Chat.jsx';
import Roadmap from './components/Roadmap.jsx';
import Chatbot from './components/Chatbot.jsx';
import AiSkillSuggestPage from './components/components/AiSkillSuggestPage.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/components/Footer.jsx';
function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <Chatbot />
    </>
  );
}

function PrivateRoute({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? children : <Navigate to="/login" replace />;
}

function AuthRedirect() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/ai-skill-suggest/*" element={<PrivateRoute><AiSkillSuggestPage /></PrivateRoute>} />
          <Route path="/dashboard-users" element={<PrivateRoute><DashboardUsers /></PrivateRoute>} />
          <Route path="/skillswap/:userId" element={<PrivateRoute><SkillSwap /></PrivateRoute>} />
          <Route path="/my-requests" element={<PrivateRoute><MyRequests /></PrivateRoute>} />
          <Route path="/friends" element={<PrivateRoute><AllFriends /></PrivateRoute>} />
          <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
          <Route path="/chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
          <Route path="/chat/:friendId" element={<PrivateRoute><Chat /></PrivateRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;