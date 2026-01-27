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
        if (!res.ok) throw new Error('Signup failed')
            alert('Account created')
        const data = await res.json()
        
        window.location.href = './index.html'
    } catch (error) {
        alert(error.message)
    }
})
