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

function MainLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/ai-skill-suggest/*" element={<AiSkillSuggestPage />} /><Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-users" element={<DashboardUsers />} />
          <Route path="/skillswap/:userId" element={<SkillSwap />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/friends" element={<AllFriends />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/chat/:friendId" element={<Chat />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;