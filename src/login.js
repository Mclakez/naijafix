document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Login failed');
}


        const data = await res.json()
        console.log(data)       
        localStorage.setItem('token', data.token)
        const role = data.user.role

        if(role === "officer") {
            window.location.href = './officer/officer_home.html'
        } else if(role === "admin") {
            window.location.href = './admin/admin_home.html'
        } else {
            window.location.href = './issues.html'
        }
        
    } catch (error) {
        alert(error.message)
    }
})