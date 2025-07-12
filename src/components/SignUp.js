import { signUp } from '../firebase.js';

export class SignUp {
  constructor() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    return `
      <div class="auth-container">
        <div class="auth-card">
          <h2>Sign Up</h2>
          <form id="signup-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required minlength="6">
            </div>
            <div class="form-group">
              <label for="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" required minlength="6">
            </div>
            <div class="form-group">
              <label for="role">Role</label>
              <select id="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" class="btn-primary">Sign Up</button>
          </form>
          <p class="auth-link">
            Already have an account? <a href="#" id="login-link">Login</a>
          </p>
          <div id="error-message" class="error-message"></div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const form = document.getElementById('signup-form');
    const loginLink = document.getElementById('login-link');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSignUp();
    });

    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigateToLogin();
    });
  }

  async handleSignUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.getElementById('role').value;
    const errorMessage = document.getElementById('error-message');

    // Clear previous error
    errorMessage.textContent = '';

    // Validation
    if (password !== confirmPassword) {
      errorMessage.textContent = 'Passwords do not match';
      return;
    }

    if (password.length < 6) {
      errorMessage.textContent = 'Password must be at least 6 characters';
      return;
    }

    try {
      const result = await signUp(email, password, role);
      
      if (result.success) {
        // Redirect to dashboard
        window.location.hash = '#dashboard';
      } else {
        errorMessage.textContent = result.error;
      }
    } catch (error) {
      errorMessage.textContent = 'An error occurred during sign up';
    }
  }

  navigateToLogin() {
    window.location.hash = '#login';
  }
} 