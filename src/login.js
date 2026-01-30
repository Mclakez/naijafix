const form = document.getElementById('login-form')

const eyeOpen = document.getElementById('eyeOpen')
const eyeClose = document.getElementById('eyeClose')
const toggleBtn = document.getElementById('toggle')
const passwordInput = document.getElementById('password')


if (form){

     ['username', 'password'].forEach(id => {
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
    form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (!validateForm()) {
                return;
            }

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    setButtonLoading(true)

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        })
        

        if (!res.ok) {
            const errorData = await res.json();
            console.log(errorData.message)
            throw new Error('Login failed');
}


        const data = await res.json()       
        
        localStorage.setItem('suspension', data.user.suspension)
        localStorage.setItem('id', data.user.id)
        localStorage.setItem('user', data.user.username)
        const role = data.user.role
        sessionStorage.setItem('accessToken', data.accessToken) 

        if(role === "officer") {
            window.location.href = './officer/officer_home.html'
        } else if(role === "admin") {
            window.location.href = './admin/admin_home.html'
        } else {
            window.location.href = './issues.html'
        }
        
    } catch (error) {
       showToast(error.message, true)
        setButtonLoading(false);
    } finally {
        setButtonLoading(false)
        
       
    }
})
}
export async function fetchWithAuth(url, options = {} ){
    let accessToken = sessionStorage.getItem('accessToken')
    const authOptions = {
        ...options,
        headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
    },
    credentials: 'include'

}

    let res = await fetch(url, authOptions)

    if(res.status === 401) {
        accessToken = await refreshAccessToken()
        authOptions.headers['Authorization'] = `Bearer ${accessToken}`
        res = await fetch(url, authOptions)
    }

    return res
}

async function refreshAccessToken() {
    let res = await fetch('/api/auth/refresh', {
        credentials: 'include'
    } )

    if(res.status === 401) {
        accessToken = null
        window.location.href = './login'
    }
    let data = await res.json()
    sessionStorage.setItem('accessToken', data.accessToken) 
    return data.accessToken
}

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
            clearError('password');
            
            // Get input values
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            // Validate username
            if (username === '') {
                showError('username', 'Username is required');
                isValid = false;
            } else if (username.length < 3) {
                showError('username', 'Username must be at least 3 characters');
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
            const btn = document.getElementById('login-btn');
            const btnText = document.getElementById('btn-text');
            const spinner = document.getElementById('btn-spinner');
            
            if (isLoading) {
                btn.disabled = true;
                btn.classList.add('opacity-75', 'cursor-not-allowed');
                btnText.textContent = 'Logging in...';
                spinner.classList.remove('hidden');
            } else {
                btn.disabled = false;
                btn.classList.remove('opacity-75', 'cursor-not-allowed');
                btnText.textContent = 'Login';
                spinner.classList.add('hidden');
            }
        }

        


        