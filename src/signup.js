
const signupForm = document.getElementById('signup-form');
const usernameField = document.getElementById('username');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');

const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const spinner = document.getElementById('spinner');

const togglePassword = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');
const eyeSlashIcon = document.getElementById('eyeSlashIcon');

const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const toast = document.getElementById('toast');


function showToast(message, isError = false) {
    toast.textContent = message;
    
    
    toast.classList.remove('bg-red-500', 'bg-green-500');
    toast.classList.add(isError ? 'bg-red-500' : 'bg-green-500');

    
    toast.classList.remove('translate-y-20', 'opacity-0');

    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}


function updateBar(width, text, colorClass) {
    strengthBar.style.width = `${width}%`;
    
    strengthBar.className = `h-full transition-all duration-300 ease-out ${colorClass}`;
    strengthText.textContent = text;
    
    strengthText.className = `text-xs mt-1 font-medium ${colorClass.replace('bg-', 'text-')}`;
}


function validateForm() {
    const isUsernameValid = usernameField.value.trim().length >= 3;
    const isEmailValid = emailField.value.includes('@') && emailField.value.includes('.');
    const isPasswordValid = passwordField.value.length >= 6;

    if (isUsernameValid && isEmailValid && isPasswordValid) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

togglePassword.addEventListener('click', () => {
    const isPassword = passwordField.type === 'password';
    passwordField.type = isPassword ? 'text' : 'password';
    eyeIcon.classList.toggle('hidden');
    eyeSlashIcon.classList.toggle('hidden');
});

passwordField.addEventListener('input', () => {
    const val = passwordField.value;
    let score = 0;

    if (!val) {
        updateBar(0, 'Enter a password', 'bg-gray-200');
    } else {
        if (val.length > 6) score++; 
        if (/[A-Z]/.test(val)) score++; 
        if (/[0-9]/.test(val)) score++; 
        if (/[^A-Za-z0-9]/.test(val)) score++; 

        if (score === 1) {
            updateBar(25, 'Weak', 'bg-red-500');
        } else if (score === 2) {
            updateBar(50, 'Fair', 'bg-yellow-500');
        } else if (score === 3) {
            updateBar(75, 'Good', 'bg-blue-500');
        } else if (score === 4) {
            updateBar(100, 'Strong', 'bg-green-500');
        } else {
            updateBar(10, 'Very Weak', 'bg-red-400');
        }
    }
    validateForm();
});

usernameField.addEventListener('input', validateForm);
emailField.addEventListener('input', validateForm);


signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    
    submitBtn.disabled = true;
    spinner.classList.remove('hidden');
    btnText.textContent = 'Creating account...';

    const payload = {
        username: usernameField.value,
        email: emailField.value,
        password: passwordField.value
    };

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Signup failed');
        }

        showToast('Account created successfully!');
        
        
        setTimeout(() => {
            window.location.href = './index.html';
        }, 2000);

    } catch (error) {
        showToast(error.message, true);
        
        submitBtn.disabled = false;
        spinner.classList.add('hidden');
        btnText.textContent = 'Register';
    }
});