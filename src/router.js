import { SignUp } from './components/SignUp.js';
import { Login } from './components/Login.js';
import { Dashboard } from './components/Dashboard.js';
import { onAuthChange, getCurrentUser } from './firebase.js';

export class Router {
  constructor() {
    this.currentComponent = null;
    this.init();
  }

  init() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });

    // Listen for auth state changes
    onAuthChange((user) => {
      this.handleRoute();
    });

    // Handle initial route
    this.handleRoute();
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1) || 'login';
    const user = getCurrentUser();

    // Clear current content
    const app = document.querySelector('#app');
    app.innerHTML = '';

    // Route logic
    if (hash === 'signup') {
      this.currentComponent = new SignUp();
      app.innerHTML = this.currentComponent.render();
      this.currentComponent.attachEventListeners();
    } else if (hash === 'login') {
      this.currentComponent = new Login();
      app.innerHTML = this.currentComponent.render();
      this.currentComponent.attachEventListeners();
    } else if (hash === 'dashboard') {
      if (user) {
        this.currentComponent = new Dashboard();
        app.innerHTML = this.currentComponent.render();
        this.currentComponent.attachEventListeners();
      } else {
        // Redirect to login if not authenticated
        window.location.hash = '#login';
      }
    } else {
      // Default to login
      window.location.hash = '#login';
    }
  }
} 