import { fetchWithAuth } from '../login.js'
const logOutBtn = document.querySelector('.log-out-btn')

const sections = document.querySelectorAll('#dashboard-section, #issues-section')
const navItems = document.querySelectorAll('.nav-item')
const mobileMenuBtn = document.getElementById('mobile-menu-btn')
const sidebar = document.getElementById('sidebar')
const sidebarOverlay = document.getElementById('sidebar-overlay')

function hideAllSections() {
    sections.forEach(section => {
        section.classList.add('hidden')
    })
}



navItems.forEach(navItem => {
    navItem.addEventListener('click', (e) => {
        if (window.innerWidth < 768) {
            sidebar.classList.add('-translate-x-full')
            sidebarOverlay.classList.add('hidden')
        }
    let sectionToDisplay = navItem.getAttribute('data-section')
    showSection(`${sectionToDisplay}-section`)
    navItems.forEach(nav => {
            nav.classList.remove('bg-naija-yellow', 'text-black', 'rounded-2xl')
            nav.classList.add('text-white')
        })
        navItem.classList.add('bg-naija-yellow', 'text-black', 'rounded-2xl')
        navItem.classList.remove('text-white')
    })
})

function showSection(section) {
    hideAllSections()
    let displaySection = document.querySelector(`#${section}`)
    displaySection.classList.remove('hidden')
}

showSection('dashboard-section')

mobileMenuBtn?.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full')
    sidebarOverlay.classList.remove('hidden')
})

sidebarOverlay?.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full')
    sidebarOverlay.classList.add('hidden')
})

logOutBtn.addEventListener('click', async () => {
    try{
        let res = await fetchWithAuth('http://localhost:3000/api/users/logout', {
            method: "POST"
        })
        console.log(res)
        if(!res.ok) {
         throw new Error("Logout response failed");
        }
        localStorage.clear()
        window.location.href = "/index.html"
        console.log('logout')
    } catch(err) {
        console.error(err.message)
    }
    
})
