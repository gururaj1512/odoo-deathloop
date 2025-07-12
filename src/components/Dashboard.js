import { getCurrentUser, logOut, getUserRole } from '../firebase.js';

export class Dashboard {
  constructor() {
    this.user = null;
    this.userRole = null;
    this.init();
  }

  async init() {
    this.user = getCurrentUser();
    if (this.user) {
      this.userRole = await getUserRole(this.user.uid);
    }
    this.render();
    this.attachEventListeners();
  }

  render() {
    if (!this.user) {
      return `
        <div class="dashboard-container">
          <div class="auth-card">
            <h2>Access Denied</h2>
            <p>Please login to access the dashboard.</p>
            <a href="#login" class="btn-primary">Go to Login</a>
          </div>
        </div>
      `;
    }

    return `
      <div class="dashboard-container">
        <nav class="dashboard-nav">
          <div class="nav-brand">
            <h1>Dashboard</h1>
          </div>
          <div class="nav-user">
            <span>Welcome, ${this.user.email}</span>
            <span class="user-role">(${this.userRole || 'user'})</span>
            <button id="logout-btn" class="btn-secondary">Logout</button>
          </div>
        </nav>
        
        <main class="dashboard-main">
          <div class="dashboard-header">
            <h2>Welcome to Your Dashboard</h2>
            <p>You are logged in as: <strong>${this.userRole || 'user'}</strong></p>
          </div>
          
          <div class="dashboard-content">
            <div class="user-info-card">
              <h3>User Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Email:</label>
                  <span>${this.user.email}</span>
                </div>
                <div class="info-item">
                  <label>User ID:</label>
                  <span>${this.user.uid}</span>
                </div>
                <div class="info-item">
                  <label>Role:</label>
                  <span class="role-badge ${this.userRole}">${this.userRole || 'user'}</span>
                </div>
                <div class="info-item">
                  <label>Last Login:</label>
                  <span>${new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            ${this.renderRoleBasedContent()}
          </div>
        </main>
      </div>
    `;
  }

  renderRoleBasedContent() {
    if (this.userRole === 'admin') {
      return `
        <div class="admin-panel">
          <h3>Admin Panel</h3>
          <div class="admin-actions">
            <button class="btn-primary">Manage Users</button>
            <button class="btn-primary">System Settings</button>
            <button class="btn-primary">View Analytics</button>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="user-panel">
          <h3>User Panel</h3>
          <div class="user-actions">
            <button class="btn-primary">View Profile</button>
            <button class="btn-primary">My Activities</button>
            <button class="btn-primary">Settings</button>
          </div>
        </div>
      `;
    }
  }

  attachEventListeners() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await this.handleLogout();
      });
    }
  }

  async handleLogout() {
    try {
      const result = await logOut();
      if (result.success) {
        window.location.hash = '#login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
} 