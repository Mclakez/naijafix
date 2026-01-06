document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const email = document.getElementById('email').value

    try {
        const res = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        if (!res.ok) throw new Error('Signup failed')
            alert('Account created')
        const data = await res.json()
        console.log(data);
        
        window.location.href = './index.html'
    } catch (error) {
        alert(error.message)
    }
})