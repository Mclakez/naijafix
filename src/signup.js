const form = document.getElementById('signup-form');
const eyeOpen = document.getElementById('eyeOpen');
const eyeClose = document.getElementById('eyeClose');
const toggleBtn = document.getElementById('toggle');
const passwordInput = document.getElementById('password');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        f
        if (!validateForm()) {
            return;
        }

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value.trim();
        
        setButtonLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Signup failed. Please try again!');
            }

            const data = await res.json();
            console.log(data);
            
            showToast("Account created successfully!");
            
            setTimeout(() => {
                window.location.href = './index.html';
            }, 1500);
            
        } catch (error) {
            showToast(error.message, true);
            setButtonLoading(false);
        }
    });
}

function validateForm() {
    let isValid = true;
    
    clearError('username');
    clearError('email');
    clearError('password');
    
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    
    if (username === '') {
        showError('username', 'Username is required');
        isValid = false;
    } else if (username.length < 3) {
        showError('username', 'Username must be at least 3 characters');
        isValid = false;
    }
    
    
    if (email === '') {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (password === '') {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    return isValid;
}


function isValidEmail(email) {
    // Simple email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}-error`);
    
    input.classList.add('input-error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}-error`);
    
    input.classList.remove('input-error');
    errorElement.classList.remove('show');
}


function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    
    if (toast.hideTimeout) {
        clearTimeout(toast.hideTimeout);
    }
    
    toast.classList.remove('bg-red-500', 'bg-green-500');
    toast.classList.add(isError ? 'bg-red-500' : 'bg-green-500');
    
    toast.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
    toast.classList.add('pointer-events-auto');
    
    toast.hideTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
        toast.classList.remove('pointer-events-auto');
    }, 3000);
}

function setButtonLoading(isLoading) {
    const btn = document.getElementById('signup-btn');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('btn-spinner');
    
    if (isLoading) {
        btn.disabled = true;
        btn.classList.add('opacity-75', 'cursor-not-allowed');
        btnText.textContent = 'Creating account...';
        spinner.classList.remove('hidden');
    } else {
        btn.disabled = false;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
        btnText.textContent = 'Sign Up';
        spinner.classList.add('hidden');
    }
}

['username', 'email', 'password'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        clearError(id);
    });
});

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === "password";
        
        passwordInput.type = isPassword ? "text" : "password";
        eyeOpen.classList.toggle('hidden', !isPassword);
        eyeClose.classList.toggle('hidden', isPassword);
    });
}