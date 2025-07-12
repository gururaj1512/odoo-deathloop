import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logOut, getUserRole, getUserData } from '../firebase';
import Navbar from './Navbar.jsx';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      navigate('/login');
      return;
    }
    setUser(u);
    getUserRole(u.uid).then(setUserRole);
    getUserData(u.uid).then(setUserData);
  }, [navigate]);

  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="auth-card">
          <h2>Access Denied</h2>
          <p>Please login to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar user={user} userRole={userRole} userData={userData} />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2>Welcome to Your Dashboard</h2>
          <p>You are logged in as: <strong>{userRole || 'user'}</strong></p>
        </div>
        <div className="dashboard-content">
          <div className="user-info-card">
            <h3>User Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Username:</label>
                <span>{userData?.username || 'Not set'}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <label>User ID:</label>
                <span>{user.uid}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span className={`role-badge ${userRole}`}>{userRole || 'user'}</span>
              </div>
              <div className="info-item">
                <label>Last Login:</label>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
          {userRole === 'admin' ? (
            <div className="admin-panel">
              <h3>Admin Panel</h3>
              <div className="admin-actions">
                <button className="btn-primary">Manage Users</button>
                <button className="btn-primary">System Settings</button>
                <button className="btn-primary">View Analytics</button>
              </div>
            </div>
          ) : (
            <div className="user-panel">
              <h3>User Panel</h3>
              <div className="user-actions">
                <button className="btn-primary">View Profile</button>
                <button className="btn-primary">My Activities</button>
                <button className="btn-primary">Settings</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard; 