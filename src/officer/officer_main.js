const sections = document.querySelectorAll('#dashboard-section, #issues-section')
const navItems = document.querySelectorAll('.nav-item')

function hideAllSections() {
    sections.forEach(section => {
        section.classList.add('hidden')
    })
}



navItems.forEach(navItem => {
    navItem.addEventListener('click', (e) => {

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