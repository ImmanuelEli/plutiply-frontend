// Splash Screen Animation
window.addEventListener('load', function () {
    const splash = document.getElementById('splashScreen');
    const mainContent = document.getElementById('mainContent');

    // Wait for splash animation to complete (3.5 seconds)
    setTimeout(() => {
        // Start fading out splash
        splash.classList.add('fade-out');

        // Show main content at the same time
        mainContent.classList.add('show');

        // Remove splash from DOM after fade completes
        setTimeout(() => {
            splash.style.display = 'none';
        }, 800); // Css transition duration

    }, 3500); // Timer for loader
});

// Prevent page scroll when modal is open
function toggleBodyScroll(shouldLock) {
    if (shouldLock) {
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
    } else {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }
}


// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('menuToggle');

    if (navLinks && menuToggle) {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }
}


// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or "javascript:void(0)"
            if (href === '#' || href === 'javascript:void(0)') {
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                const menuToggle = document.getElementById('menuToggle');

                if (navLinks) {
                    navLinks.classList.remove('active');
                }
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 14, 39, 0.98)';
    } else {
        nav.style.background = 'rgba(10, 14, 39, 0.95)';
    }
});


// Open Auth Modal
function openAuthModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');
    toggleBodyScroll(true);

    // Reset forms
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => {
        form.classList.remove('active');
        if (form.tagName === 'FORM') {
            form.reset();
        }
    });

    // Clear password strength indicator
    const strengthBar = document.getElementById('strengthBar');
    if (strengthBar) {
        strengthBar.className = 'password-strength-bar';
    }

    // Clear error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.classList.remove('show'));

    // Switch to requested tab
    switchTab(tab);
}

// Close Auth Modal
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('active');
    toggleBodyScroll(false);
}

// Switch Between Login and Signup Tabs
function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form');

    // Remove active class from all tabs and forms
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));

    // Activate the selected tab and form
    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('signupForm').classList.add('active');
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function () {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeAuthModal();
            }
        });
    }
});


// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;

    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Check Password Strength
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const bar = document.getElementById('strengthBar');

    // Reset bar
    bar.className = 'password-strength-bar';

    if (!password) return;

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const length = password.length;

    // Weak: Less than 8 characters or missing basic requirements
    if (length < 8 || !(hasUpper && hasLower)) {
        bar.classList.add('strength-weak');
        return;
    }

    // Strong: 10+ characters with all requirements
    if (length >= 10 && hasUpper && hasLower && hasNumber && hasSymbol) {
        bar.classList.add('strength-strong');
        return;
    }

    // Medium: 8+ characters with basic requirements
    if (length >= 8 && hasUpper && hasLower && hasNumber) {
        bar.classList.add('strength-medium');
    }
}

// Password Match Validation
document.addEventListener('DOMContentLoaded', function () {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const error = document.getElementById('passwordError');

    if (confirmPassword && password && error) {
        // Function to check password match
        const checkPasswordMatch = function () {
            const passValue = password.value;
            const confirmValue = confirmPassword.value;

            // Only show error if:
            // 1. Confirm password has some value
            // 2. Password has some value
            // 3. They don't match
            // 4. Confirm password length is >= password length (user has finished typing)
            if (confirmValue && passValue && confirmValue.length >= passValue.length && passValue !== confirmValue) {
                error.classList.add('show');
            } else {
                error.classList.remove('show');
            }
        };

        // Check on both inputs
        confirmPassword.addEventListener('input', checkPasswordMatch);
        password.addEventListener('input', checkPasswordMatch);
    }
});

// Generate Username
function generateUsername() {
    const fullNameInput = document.getElementById('fullName');
    const usernameInput = document.getElementById('username');

    if (!fullNameInput || !usernameInput) return;

    const fullName = fullNameInput.value.trim();

    // If no name is entered, use random generation
    if (!fullName) {
        alert('Please enter your full name first!');
        fullNameInput.focus();
        return;
    }

    // Remove special characters and split name into parts
    const nameParts = fullName
        .replace(/[^a-zA-Z\s]/g, '') // Remove non-letter characters except spaces
        .split(/\s+/) // Split by whitespace
        .filter(part => part.length > 0); // Remove empty parts

    if (nameParts.length === 0) {
        alert('Please enter a valid name!');
        return;
    }

    let username = '';

    // Different strategies for generating username
    const strategies = [
        // Strategy 1: FirstnameLastname + number (e.g., JohnDoe123)
        () => {
            if (nameParts.length >= 2) {
                return nameParts[0] + nameParts[nameParts.length - 1] + Math.floor(Math.random() * 10000);
            }
            return nameParts[0] + Math.floor(Math.random() * 10000);
        },

        // Strategy 2: First initial + Lastname + number (e.g., JDoe456)
        () => {
            if (nameParts.length >= 2) {
                return nameParts[0][0] + nameParts[nameParts.length - 1] + Math.floor(Math.random() * 10000);
            }
            return nameParts[0] + Math.floor(Math.random() * 10000);
        },

        // Strategy 3: Firstname + Last initial + number (e.g., JohnD789)
        () => {
            if (nameParts.length >= 2) {
                return nameParts[0] + nameParts[nameParts.length - 1][0] + Math.floor(Math.random() * 10000);
            }
            return nameParts[0] + Math.floor(Math.random() * 10000);
        },

        // Strategy 4: Firstname + underscore + number (e.g., John_1234)
        () => {
            return nameParts[0] + '_' + Math.floor(Math.random() * 10000);
        }
    ];

    // Randomly pick a strategy
    const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)];
    username = randomStrategy();

    // Ensure username meets requirements (3-20 characters)
    if (username.length < 3) {
        username = username + Math.floor(Math.random() * 1000);
    }
    if (username.length > 20) {
        username = username.substring(0, 17) + Math.floor(Math.random() * 100);
    }

    usernameInput.value = username;

    // Add a small animation effect
    usernameInput.style.animation = 'none';
    setTimeout(() => {
        usernameInput.style.animation = 'inputPulse 0.6s ease';
    }, 10);
}


// ==================== BACKEND API INTEGRATION ====================
const API_URL = 'http://localhost:5000/api';

// Toast notification helper
function showMessage(message, type = 'success') {
    const existingMsg = document.querySelector('.toast-message');
    if (existingMsg) existingMsg.remove();

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#22c55e' : '#f44336'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add toast animation styles
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(toastStyle);

// Form Submission Handlers
document.addEventListener('DOMContentLoaded', function () {
    // ===== LOGIN FORM =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const requestData = {
                emailOrPhone: formData.get('email'),
                password: formData.get('password')
            };

            const submitBtn = this.querySelector('.btn-modal');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    localStorage.setItem('plutiply_token', data.data.token);
                    localStorage.setItem('plutiply_user', JSON.stringify(data.data.user));

                    showMessage(`Welcome back, ${data.data.user.fullName}! 👋`, 'success');

                    setTimeout(() => {
                        closeAuthModal();
                        this.reset();
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showMessage(data.message || 'Login failed', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('Connection error. Check if server is running.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ===== SIGNUP FORM =====
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');

            // Validate passwords match
            if (password !== confirmPassword) {
                showMessage('Passwords do not match!', 'error');
                return;
            }

            // Check terms
            const termsAccepted = document.getElementById('terms').checked;
            if (!termsAccepted) {
                showMessage('Please accept the Terms & Conditions', 'error');
                return;
            }

            const requestData = {
                fullName: formData.get('fullName'),
                username: formData.get('username'),
                email: formData.get('email'),
                phoneNumber: formData.get('phone'),
                countryCode: document.getElementById('countryCode').value,
                password: password,
                referralCode: formData.get('referralCode') || null
            };



            // Generate random username
            function generateUsername() {
                const fullNameInput = document.getElementById('fullName');
                const usernameInput = document.getElementById('username');

                if (!fullNameInput.value.trim()) {
                    alert('Please enter your full name first');
                    fullNameInput.focus();
                    return;
                }

                // Take first name and add random numbers
                const firstName = fullNameInput.value.trim().split(' ')[0].toLowerCase();
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                const username = `${firstName}${randomNum}`;

                usernameInput.value = username;
            }
            const submitBtn = this.querySelector('.btn-modal');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    localStorage.setItem('plutiply_token', data.data.token);
                    localStorage.setItem('plutiply_user', JSON.stringify(data.data.user));

                    showMessage('Account created successfully! 🎉', 'success');

                    setTimeout(() => {
                        closeAuthModal();
                        this.reset();
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showMessage(data.message || 'Registration failed', 'error');
                }
            } catch (error) {
                console.error('Signup error:', error);
                showMessage('Connection error. Check if server is running.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Check if user is already logged in
    const token = localStorage.getItem('plutiply_token');
    const user = localStorage.getItem('plutiply_user');
    if (token && user) {
        console.log('User already logged in:', JSON.parse(user));
    }
});


// Google Sign-In (Placeholder)
function googleSignIn() {

}



// Load Country Codes from API
// Load Country Codes from API
async function loadCountryCodes() {
    const select = document.getElementById('countryCode');

    if (!select) return;

    // Set Ghana as immediate default (in case API is slow)
    select.innerHTML = '<option value="+233" selected>🇬🇭 +233 Ghana</option>';

    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2,flag');
        const countries = await response.json();

        // Sort countries alphabetically
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

        // Clear select
        select.innerHTML = '';

        // Add Ghana first (always at top and selected)
        const ghanaOption = document.createElement('option');
        ghanaOption.value = '+233';
        ghanaOption.textContent = '🇬🇭 +233 Ghana';
        ghanaOption.selected = true;
        select.appendChild(ghanaOption);

        // Add separator
        const separator = document.createElement('option');
        separator.disabled = true;
        separator.textContent = '─────────────────';
        select.appendChild(separator);

        // Add other countries
        countries.forEach(country => {
            // Skip Ghana since we already added it at top
            if (country.cca2 === 'GH') return;

            const callingCode = country.idd.root + (country.idd.suffixes?.[0] || '');

            if (callingCode && callingCode !== '+') {
                const option = document.createElement('option');
                option.value = callingCode;
                option.textContent = `${country.flag} ${callingCode} ${country.name.common}`;
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading country codes:', error);
        loadFallbackCountryCodes();
    }
}

// Fallback Country Codes (if API fails)
function loadFallbackCountryCodes() {
    const select = document.getElementById('countryCode');

    if (!select) return;

    select.innerHTML = `
        <option value="+233" selected>🇬🇭 +233 Ghana</option>
        <option disabled>─────────────────</option>
        <option value="+234">🇳🇬 +234 Nigeria</option>
        <option value="+254">🇰🇪 +254 Kenya</option>
        <option value="+27">🇿🇦 +27 South Africa</option>
        <option value="+256">🇺🇬 +256 Uganda</option>
        <option value="+255">🇹🇿 +255 Tanzania</option>
        <option value="+1">🇺🇸 +1 USA</option>
        <option value="+44">🇬🇧 +44 UK</option>
    `;
}


// Initialize country codes on page load
document.addEventListener('DOMContentLoaded', function () {
    loadCountryCodes();
});


// Close mobile menu when clicking outside
document.addEventListener('click', function (e) {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('nav');

    if (navLinks && menuToggle && nav) {
        // If click is outside nav and menu is open
        if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    }
});

// Prevent form submission on Enter key in certain inputs (optional)
document.addEventListener('DOMContentLoaded', function () {
    const preventEnterSubmit = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');

    preventEnterSubmit.forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Move to next input
                const form = this.closest('form');
                const inputs = Array.from(form.querySelectorAll('input, select, button'));
                const index = inputs.indexOf(this);
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        });
    });
});

// Add animation to service cards on scroll (optional enhancement)
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .feature-item, .step');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function () {
    animateOnScroll();
});

// Console welcome message
console.log('%c🚀 Welcome to Plutiply!', 'color: #22c55e; font-size: 20px; font-weight: bold;');
console.log('%cYour Reliable Digital Transaction Partner', 'color: #888; font-size: 14px;');
console.log('%c⚠️ Warning: Do not paste any code here unless you know what you are doing!', 'color: #f44336; font-size: 12px; font-weight: bold;');

