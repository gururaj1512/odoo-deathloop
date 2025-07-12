import { signIn } from '../firebase.js';

export class Login {
  constructor() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    return `
      <div class="auth-container">
        <div class="auth-card">
          <h2>Login</h2>
          <form id="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required>
            </div>
            <button type="submit" class="btn-primary">Login</button>
          </form>
          <p class="auth-link">
            Don't have an account? <a href="#" id="signup-link">Sign Up</a>
          </p>
          <div id="error-message" class="error-message"></div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const form = document.getElementById('login-form');
    const signupLink = document.getElementById('signup-link');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });

    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigateToSignUp();
    });
  }

  async handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Clear previous error
    errorMessage.textContent = '';

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // Redirect to dashboard
        window.location.hash = '#dashboard';
      } else {
        errorMessage.textContent = result.error;
      }
    } catch (error) {
      errorMessage.textContent = 'An error occurred during login';
    }
  }

  navigateToSignUp() {
    window.location.hash = '#signup';
  }
} 