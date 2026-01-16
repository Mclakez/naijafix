// Element Selectors
const loginForm = document.getElementById('login-form');
const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const submitBtn = loginForm.querySelector('button[type="submit"]');
const toast = document.getElementById('toast');

// Password Toggle Elements
const togglePassword = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');
const eyeSlashIcon = document.getElementById('eyeSlashIcon');

// UI Helper: Toast Notifications
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.remove('bg-red-500', 'bg-green-500', 'translate-y-20', 'opacity-0');
    toast.classList.add(isError ? 'bg-red-500' : 'bg-green-500');

    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// UI Helper: Password Toggle Logic
if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const isPassword = passwordField.type === 'password';
        passwordField.type = isPassword ? 'text' : 'password';
        eyeIcon.classList.toggle('hidden');
        eyeSlashIcon.classList.toggle('hidden');
    });
}

// Form Submission Logic
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. UI Loading State
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Verifying...';
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

        const username = usernameField.value;
        const password = passwordField.value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Invalid credentials');
            }

            const data = await res.json();

            // 2. Success Logic
            showToast('Login successful! Redirecting...');

            // Store user data
            localStorage.setItem('suspension', data.user.suspension);
            localStorage.setItem('id', data.user.id);
            localStorage.setItem('user', data.user.username);
            sessionStorage.setItem('accessToken', data.accessToken);

            // Role-based redirection
            setTimeout(() => {
                const role = data.user.role;
                if (role === "officer") {
                    window.location.href = './officer/officer_home.html';
                } else if (role === "admin") {
                    window.location.href = './admin/admin_home.html';
                } else {
                    window.location.href = './issues.html';
                }
            }, 1500);

        } catch (error) {
            // 3. Error Logic
            showToast(error.message, true);
            
            // Reset Button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });
}

// AUTH HELPERS (Your existing fetchWithAuth logic)
export async function fetchWithAuth(url, options = {}) {
    let accessToken = sessionStorage.getItem('accessToken');
    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
        },
        credentials: 'include'
    };

    let res = await fetch(url, authOptions);

    if (res.status === 401) {
        accessToken = await refreshAccessToken();
        if (accessToken) {
            authOptions.headers['Authorization'] = `Bearer ${accessToken}`;
            res = await fetch(url, authOptions);
        }
    }
    return res;
}

async function refreshAccessToken() {
    try {
        const res = await fetch('/api/auth/refresh', { credentials: 'include' });
        if (res.status === 401) {
            sessionStorage.removeItem('accessToken');
            window.location.href = './login.html';
            return null;
        }
        const data = await res.json();
        sessionStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
    } catch (err) {
        window.location.href = './login.html';
        return null;
    }
}