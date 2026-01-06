let accessToken = null

const form = document.getElementById('login-form')
if (form){
    form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        })
        console.log(res)

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Login failed');
}


        const data = await res.json()       
        
        localStorage.setItem('suspension', data.user.suspension)
        localStorage.setItem('id', data.user.id)
        localStorage.setItem('user', data.user.username)
        const role = data.user.role
        accessToken = data.accessToken
        

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
}
export async function fetchWithAuth(url, options = {} ){
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
        await refreshAccessToken()
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
    accessToken = data.accessToken
    return accessToken
}