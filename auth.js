/**
 * BinMan - Professional Authentication System
 * 
 * Features:
 * - Firebase Authentication Integration
 * - Secure Password Management
 * - Robust Error Handling
 * - Social Authentication Options
 * - Persistent Login Sessions
 * - Responsive Design Support
 */

// Firebase Authentication Setup
document.addEventListener('DOMContentLoaded', function() {
    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDGvs46ZTsKuhXCxThlOyG4EpZKKzm5tMk",
        authDomain: "binman-60239.firebaseapp.com",
        projectId: "binman-60239",
        storageBucket: "binman-60239.firebasestorage.app",
        messagingSenderId: "770527519026",
        appId: "1:770527519026:web:2b41b74b5e7228be06b72b",
        measurementId: "G-H0NXW91EG3"
    };
    
    // Initialize Firebase
    try {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return;
    }
    
    const auth = firebase.auth();
    
    // DOM Element References
    const elements = {
        // Modal and container elements
        authModal: document.getElementById('authModal'),
        modalTitle: document.getElementById('modalTitle'),
        
        // Buttons
        loginBtn: document.getElementById('loginBtn'),
        signupBtn: document.getElementById('signupBtn'),
        socialButtons: document.querySelectorAll('.social-button'),
        closeModalBtn: document.querySelector('.close-modal'),
        logoutBtn: document.getElementById('logoutBtn'),
        
        // Tabs
        authTabs: document.querySelectorAll('.auth-tab'),
        tabSwitchers: document.querySelectorAll('.tab-switch'),
        
        // Forms
        loginForm: document.getElementById('loginForm'),
        signupForm: document.getElementById('signupForm'),
        
        // Error containers
        loginError: document.getElementById('loginError'),
        signupError: document.getElementById('signupError'),
        loginSuccess: document.getElementById('loginSuccess'),
        signupSuccess: document.getElementById('signupSuccess'),
        
        // User profile elements
        userProfile: document.getElementById('userProfile'),
        userAvatar: document.getElementById('userAvatar'),
        userName: document.getElementById('userName'),
        
        // Password fields
        loginPassword: document.getElementById('loginPassword'),
        signupPassword: document.getElementById('signupPassword'),
        loginPasswordToggle: document.getElementById('loginPasswordToggle'),
        signupPasswordToggle: document.getElementById('signupPasswordToggle'),
        
        // Loading indicators
        loginSubmitBtn: document.querySelector('#loginForm .auth-submit'),
        signupSubmitBtn: document.querySelector('#signupForm .auth-submit')
    };

    // Input validation parameters
    const validation = {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        password: {
            minLength: 6,
            message: 'Password must be at least 6 characters'
        },
        name: {
            minLength: 2,
            message: 'Name must be at least 2 characters'
        }
    };
    
    // Check if elements exist before proceeding
    if (!elements.authModal || !elements.loginBtn || !elements.signupBtn) {
        console.error('Required auth elements not found in the DOM');
        return;
    }
    
    // Check if user is already logged in
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            console.log('User signed in:', user.email);
            updateUserProfile(user);
            showUserProfile();
        } else {
            // User is signed out
            console.log('User signed out');
            hideUserProfile();
        }
    });
    
    // Show the authentication modal
    function showAuthModal(tab = 'login') {
        // Reset forms and errors before showing
        resetForms();
        
        // Set the active tab
        activateTab(tab);
        
        // Show the modal with animation
        elements.authModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Focus the first input of the active form
        setTimeout(() => {
            const activeForm = document.querySelector('.auth-form.active');
            if (activeForm) {
                const firstInput = activeForm.querySelector('input');
                if (firstInput) firstInput.focus();
            }
        }, 300);
    }
    
    // Hide the authentication modal
    function hideAuthModal() {
        elements.authModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        resetForms();
    }
    
    // Activate a specific tab
    function activateTab(tabName) {
        // Update tab styling
        elements.authTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Show the corresponding form
        if (elements.loginForm) elements.loginForm.classList.toggle('active', tabName === 'login');
        if (elements.signupForm) elements.signupForm.classList.toggle('active', tabName === 'signup');
        
        // Update modal title
        if (elements.modalTitle) {
            elements.modalTitle.textContent = tabName === 'login' ? 'Welcome Back' : 'Create Account';
        }
    }
    
    // Reset all form fields and errors
    function resetForms() {
        // Reset form fields
        if (elements.loginForm) elements.loginForm.reset();
        if (elements.signupForm) elements.signupForm.reset();
        
        // Hide all error messages
        hideElement(elements.loginError);
        hideElement(elements.signupError);
        hideElement(elements.loginSuccess);
        hideElement(elements.signupSuccess);
        
        // Reset button states
        resetButtonState(elements.loginSubmitBtn);
        resetButtonState(elements.signupSubmitBtn);
    }
    
    // Toggle password visibility
    function togglePasswordVisibility(passwordField, iconElement) {
        if (!passwordField || !iconElement) return;
        
        const type = passwordField.type === 'password' ? 'text' : 'password';
        passwordField.type = type;
        
        // Toggle icon
        if (type === 'text') {
            iconElement.classList.remove('fa-eye');
            iconElement.classList.add('fa-eye-slash');
        } else {
            iconElement.classList.remove('fa-eye-slash');
            iconElement.classList.add('fa-eye');
        }
    }
    
    // Validate form input
    function validateInput(input, rules) {
        if (!input || !rules) return true;
        
        const value = input.value.trim();
        
        // Required check
        if (input.hasAttribute('required') && !value) {
            return 'This field is required';
        }
        
        // Email validation
        if (input.type === 'email' && rules.pattern && !rules.pattern.test(value)) {
            return rules.message || 'Invalid email format';
        }
        
        // Minimum length validation
        if (rules.minLength && value.length < rules.minLength) {
            return rules.message || `Must be at least ${rules.minLength} characters`;
        }
        
        return true;
    }
    
    // Show error message
    function showError(element, message) {
        if (!element) return;
        element.textContent = message;
        element.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideElement(element);
        }, 5000);
    }
    
    // Show success message
    function showSuccess(element, message) {
        if (!element) return;
        element.textContent = message;
        element.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            hideElement(element);
        }, 3000);
    }
    
    // Hide element helper
    function hideElement(element) {
        if (element) element.style.display = 'none';
    }
    
    // Set button to loading state
    function setButtonLoading(button, isLoading = true) {
        if (!button) return;
        
        if (isLoading) {
            // Store original text
            button.dataset.originalText = button.innerHTML;
            
            // Show loading indicator
            button.innerHTML = '<span class="auth-loading"></span> Processing...';
            button.disabled = true;
        } else {
            resetButtonState(button);
        }
    }
    
    // Reset button state
    function resetButtonState(button) {
        if (!button) return;
        
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
            delete button.dataset.originalText;
        }
        
        button.disabled = false;
    }

    // Update user profile information
    function updateUserProfile(user) {
        if (!user) return;
        
        // Get display name (use email if name not set)
        const displayName = user.displayName || user.email.split('@')[0];
        
        // Update user name display
        if (elements.userName) {
            elements.userName.textContent = displayName;
        }
        
        // Update avatar with initial
        if (elements.userAvatar) {
            const initial = displayName.charAt(0).toUpperCase();
            elements.userAvatar.textContent = initial;
        }
        
        // Save to localStorage for session persistence
        localStorage.setItem('binmanUser', JSON.stringify({
            uid: user.uid,
            displayName: displayName,
            email: user.email,
            photoURL: user.photoURL
        }));
    }
    
    // Show user profile in the UI
    function showUserProfile() {
        if (elements.userProfile) elements.userProfile.style.display = 'flex';
        if (elements.loginBtn) elements.loginBtn.style.display = 'none';
        if (elements.signupBtn) elements.signupBtn.style.display = 'none';
    }
    
    // Hide user profile in the UI
    function hideUserProfile() {
        if (elements.userProfile) elements.userProfile.style.display = 'none';
        if (elements.loginBtn) elements.loginBtn.style.display = 'inline-block';
        if (elements.signupBtn) elements.signupBtn.style.display = 'inline-block';
        localStorage.removeItem('binmanUser');
    }

    // Handle login with email/password
    function handleLogin(email, password) {
        setButtonLoading(elements.loginSubmitBtn, true);
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login successful
                console.log('Login successful:', userCredential.user.email);
                showSuccess(elements.loginSuccess, 'Login successful!');
                setTimeout(() => {
                    hideAuthModal();
                }, 1000);
            })
            .catch((error) => {
                // Handle login errors
                console.error('Login error:', error);
                let errorMessage = 'Login failed. Please check your credentials.';
                
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'No account found with this email address.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Incorrect password. Please try again.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many failed login attempts. Please try again later.';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'This account has been disabled. Please contact support.';
                        break;
                }
                
                showError(elements.loginError, errorMessage);
            })
            .finally(() => {
                setButtonLoading(elements.loginSubmitBtn, false);
            });
    }
    
    // Handle signup with email/password
    function handleSignup(name, email, password) {
        setButtonLoading(elements.signupSubmitBtn, true);
        
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Update user profile with name
                return userCredential.user.updateProfile({
                    displayName: name
                });
            })
            .then(() => {
                // Signup successful
                console.log('Signup successful');
                showSuccess(elements.signupSuccess, 'Account created successfully!');
                setTimeout(() => {
                    hideAuthModal();
                }, 1000);
            })
            .catch((error) => {
                // Handle signup errors
                console.error('Signup error:', error);
                let errorMessage = 'Signup failed. Please try again.';
                
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'An account with this email already exists.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password is too weak. Please use at least 6 characters.';
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = 'Email/password accounts are not enabled.';
                        break;
                }
                
                showError(elements.signupError, errorMessage);
            })
            .finally(() => {
                setButtonLoading(elements.signupSubmitBtn, false);
            });
    }
    
    // Handle social authentication (Google)
    function handleSocialAuth(provider) {
        let authProvider;
        
        switch (provider) {
            case 'google':
                authProvider = new firebase.auth.GoogleAuthProvider();
                break;
            case 'facebook':
                authProvider = new firebase.auth.FacebookAuthProvider();
                break;
            default:
                console.error('Unsupported auth provider:', provider);
                return;
        }
        
        auth.signInWithPopup(authProvider)
            .then((result) => {
                // Social login successful
                console.log(`${provider} login successful:`, result.user.email);
                hideAuthModal();
            })
            .catch((error) => {
                // Handle social login errors
                console.error(`${provider} login error:`, error);
                const errorContainer = document.querySelector('.auth-form.active .auth-error');
                if (errorContainer) {
                    showError(errorContainer, `${provider} login failed: ${error.message}`);
                }
            });
    }
    
    // Handle user logout
    function handleLogout() {
        auth.signOut()
            .then(() => {
                console.log('User signed out successfully');
                hideUserProfile();
            })
            .catch((error) => {
                console.error('Logout error:', error);
            });
    }

    // Event Listeners
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('login');
        });
    }
    
    if (elements.signupBtn) {
        elements.signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('signup');
        });
    }
    
    if (elements.closeModalBtn) {
        elements.closeModalBtn.addEventListener('click', hideAuthModal);
    }
    
    if (elements.authModal) {
        elements.authModal.addEventListener('click', (e) => {
            if (e.target === elements.authModal) {
                hideAuthModal();
            }
        });
    }
    
    elements.authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            activateTab(tab.dataset.tab);
        });
    });
    
    elements.tabSwitchers.forEach(switcher => {
        switcher.addEventListener('click', (e) => {
            e.preventDefault();
            activateTab(switcher.dataset.tab);
        });
    });
    
    if (elements.loginPasswordToggle && elements.loginPassword) {
        elements.loginPasswordToggle.addEventListener('click', () => {
            togglePasswordVisibility(elements.loginPassword, elements.loginPasswordToggle.querySelector('i'));
        });
    }
    
    if (elements.signupPasswordToggle && elements.signupPassword) {
        elements.signupPasswordToggle.addEventListener('click', () => {
            togglePasswordVisibility(elements.signupPassword, elements.signupPasswordToggle.querySelector('i'));
        });
    }
    
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form inputs
            const email = elements.loginForm.querySelector('input[type="email"]').value.trim();
            const password = elements.loginForm.querySelector('input[type="password"]').value;
            
            // Validate email
            const emailValidation = validateInput(
                elements.loginForm.querySelector('input[type="email"]'), 
                validation.email
            );
            
            if (emailValidation !== true) {
                showError(elements.loginError, emailValidation);
                return;
            }
            
            // Validate password (just check if it's not empty)
            if (!password) {
                showError(elements.loginError, 'Please enter your password');
                return;
            }
            
            // Proceed with login
            handleLogin(email, password);
        });
    }
    
    if (elements.signupForm) {
        elements.signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form inputs
            const name = elements.signupForm.querySelector('input[type="text"]').value.trim();
            const email = elements.signupForm.querySelector('input[type="email"]').value.trim();
            const password = elements.signupForm.querySelector('input[type="password"]').value;
            
            // Validate name
            const nameValidation = validateInput(
                elements.signupForm.querySelector('input[type="text"]'), 
                validation.name
            );
            
            if (nameValidation !== true) {
                showError(elements.signupError, nameValidation);
                return;
            }
            
            // Validate email
            const emailValidation = validateInput(
                elements.signupForm.querySelector('input[type="email"]'), 
                validation.email
            );
            
            if (emailValidation !== true) {
                showError(elements.signupError, emailValidation);
                return;
            }
            
            // Validate password
            const passwordValidation = validateInput(
                elements.signupForm.querySelector('input[type="password"]'), 
                validation.password
            );
            
            if (passwordValidation !== true) {
                showError(elements.signupError, passwordValidation);
                return;
            }
            
            // Proceed with signup
            handleSignup(name, email, password);
        });
    }
    
    elements.socialButtons?.forEach(button => {
        button.addEventListener('click', () => {
            const provider = button.dataset.provider;
            if (provider) {
                handleSocialAuth(provider);
            } else {
                console.error('No provider specified for social button');
            }
        });
    });
    
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', handleLogout);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.authModal.classList.contains('active')) {
            hideAuthModal();
        }
    });

    // Try to restore user profile from localStorage (for page reloads)
    function initializeFromLocalStorage() {
        const savedUser = JSON.parse(localStorage.getItem('binmanUser'));
        if (savedUser && !auth.currentUser) {
            // Temporarily show user profile while Firebase auth state catches up
            if (elements.userName) elements.userName.textContent = savedUser.displayName;
            if (elements.userAvatar) elements.userAvatar.textContent = savedUser.displayName.charAt(0).toUpperCase();
            showUserProfile();
        }
    }
    
    // Initialize
    initializeFromLocalStorage();
    
    // Log initialization completion
    console.log('BinMan authentication system initialized');
}); 