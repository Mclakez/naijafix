const eyeOpen = document.getElementById('eyeOpen')
const eyeClose = document.getElementById('eyeClose')
const toggleBtn = document.getElementById('toggle')
const passwordInput = document.getElementById('password')

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    if (!validateForm()) {
                return;
            }
    const username = document.getElementById('username').value.trim()
    const password = document.getElementById('password').value.trim()
    const email = document.getElementById('email').value.trim()

    setButtonLoading(true);

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        if (!res.ok) throw new Error('Signup failed. Please try again!')
            showToast("Account created sucessfully")
        const data = await res.json()
        
        window.location.href = './index.html'
    } catch (error) {
        showToast(error.message, true)
        setButtonLoading(false);
    }
})

// function showToast(message, isError = false) {
//     const toast = document.getElementById('toast');
//     toast.textContent = message;
//     toast.classList.remove('bg-red-500', 'bg-green-500');
//     toast.classList.add(isError ? 'bg-red-500' : 'bg-green-500');

//     toast.classList.remove('translate-y-20', 'opacity-0');

//     setTimeout(() => {
//         toast.classList.add('translate-y-20', 'opacity-0');
//     }, 3000);
// }

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    // Clear any existing timeout
    if (toast.hideTimeout) {
        clearTimeout(toast.hideTimeout);
    }
    
    // Set background color
    toast.classList.remove('bg-red-500', 'bg-green-500');
    toast.classList.add(isError ? 'bg-red-500' : 'bg-green-500');
    
    // Show toast
    toast.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
    toast.classList.add('pointer-events-auto');
    
    // Hide after 3 seconds
    toast.hideTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
        toast.classList.remove('pointer-events-auto');
    }, 3000);
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

function validateForm() {
            let isValid = true;
            
            // Clear all previous errors
            clearError('username');
            clearError('email');
            clearError('password');
            
            // Get input values
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Validate username
            if (username === '') {
                showError('username', 'Username is required');
                isValid = false;
            } else if (username.length < 3) {
                showError('username', 'Username must be at least 3 characters');
                isValid = false;
            }
            
            // Validate email
            if (email === '') {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate password
            if (password === '') {
                showError('password', 'Password is required');
                isValid = false;
            } else if (password.length < 6) {
                showError('password', 'Password must be at least 6 characters');
                isValid = false;
            }
            
            return isValid;
        }


        function setButtonLoading(isLoading) {
            const btn = document.getElementById('submit-btn');
            const btnText = document.getElementById('btn-text');
            const spinner = document.getElementById('btn-spinner');
            
            if (isLoading) {
                btn.disabled = true;
                btn.classList.add('opacity-75', 'cursor-not-allowed');
                btnText.textContent = 'Creating...';
                spinner.classList.remove('hidden');
            } else {
                btn.disabled = false;
                btn.classList.remove('opacity-75', 'cursor-not-allowed');
                btnText.textContent = 'Register';
                spinner.classList.add('hidden');
            }
        }

        ['username', 'email', 'password'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                clearError(id);
            });
        });



        toggle.addEventListener('click', () => {
            let isPassword = passwordInput.type === "password"

            passwordInput.type = isPassword ? "text" : "password"
            eyeOpen.classList.toggle('hidden', !isPassword)
            eyeClose.classList.toggle('hidden', isPassword)
        })