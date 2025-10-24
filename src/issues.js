const mainContainer = document.getElementById('main-container')
const myReportsBtn = document.getElementById('my-report-btn')
const allReportsBtn = document.getElementById('all-report-btn')
const token = localStorage.getItem('token')

async function getAllIssues() {
    try {
        const res = await fetch('http://localhost:3000/api/issues', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Error with all issues')

        const issues = await res.json()
        console.log(issues)
        issues.forEach(issue => {
            let card = document.createElement('article')
            card.className = `bg-white rounded-xl shadow-md overflow-hidden `
            card.innerHTML = `<div class="bg-[url('./images/5de09a7068512cd7e5cdae70566ce4cd.jpg')] bg-cover h-50">

        </div>
        <div class="px-3 grid gap-2 py-4">
          <h3 class="text-xl font-semibold">Heavy Rainfall at Third Mainland bridge</h3>
          <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
            Pending
          </div>
          <p>Lagos, Nigeria</p>
          <button class="details-btn bg-green-800 flex justify-center py-3 rounded text-white font-semibold">View Details</button>
        </div>`
        console.log(issue);
        
        mainContainer.appendChild(card)
        });
        
    } catch (error) {
        alert(error.message)
    }
}

getAllIssues()

async function getMyIssues() {
    try {
        const res = await fetch('http://localhost:3000/api/issues/my')
        if (!res.ok) throw new Error('Error swith my issues')

        const issues = await res.json()
        issues.forEach(issue => {
            let card = document.createElement('article')
            card.className = `bg-white rounded-xl shadow-md overflow-hidden `
            card.innerHTML = `<div class="bg-[url('./images/5de09a7068512cd7e5cdae70566ce4cd.jpg')] bg-cover h-50">

        </div>
        <div class="px-3 grid gap-2 py-4">
          <h3 class="text-xl font-semibold">Heavy Rainfall at Third Mainland bridge</h3>
          <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
            Pending
          </div>
          <p>Lagos, Nigeria</p>
          <button class="details-btn bg-green-800 flex justify-center py-3 rounded text-white font-semibold">View Details</button>
        </div>`

        mainContainer.appendChild(card)
        });
        
    } catch (error) {
        alert(error.message)
    }
}

allReportsBtn.addEventListener('click', (e) => {
    getAllIssues()
    allReportsBtn.classList.add("bg-naija-yellow rounded")
    myReportsBtn.classList.remove("bg-naija-yellow rounded")
})

myReportsBtn.addEventListener('click', (e) => {
    getMyIssues()
    allReportsBtn.classList.remove("bg-naija-yellow rounded")
    myReportsBtn.classList.add("bg-naija-yellow rounded")
})