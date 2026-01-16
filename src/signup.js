document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const email = document.getElementById('email').value

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        if (!res.ok) throw new Error('Signup failed. Please try again!')
            showToast("Account created sucessfully")
        const data = await res.json()
        console.log(data);
        
        window.location.href = './index.html'
    } catch (error) {
        showToast(error, true)
    }
})

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    
    toast.classList.remove('bg-red-500', 'bg-green-500');
    toast.classList.add(isError ? 'bg-red-500' : 'bg-green-500');

    toast.classList.remove('translate-y-20', 'opacity-0');

    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}