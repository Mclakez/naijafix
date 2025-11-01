const mainContainer = document.getElementById('main-container')
const myReportsBtn = document.getElementById('my-report-btn')
const allReportsBtn = document.getElementById('all-report-btn')
const token = localStorage.getItem('token')
const detailsSection = document.getElementById('details-section')

async function getAllIssues() {
    try {
        const res = await fetch('http://localhost:3000/api/issues', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Error with all issues')
        const issues = await res.json()
        
        issues.forEach(issue => {
            let card = document.createElement('article')
            card.className = `bg-white rounded-xl shadow-md overflow-hidden `
            card.innerHTML = `<div class="bg-cover h-50" style="background-image: url('/uploads/${encodeURIComponent(issue.issueImage)}')">

        </div>
        <div class="px-3 grid gap-2 py-4">
          <h3 class="text-xl font-semibold">${issue.title}</h3>
          <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
            ${issue.status}
          </div>
          <p>${issue.location}</p>
          <button class="details-btn bg-green-800 flex justify-center py-3 rounded text-white font-semibold" data-id="${issue._id}">View Details</button>
        </div>`
        
        
        mainContainer.appendChild(card)
        });
        
    } catch (error) {
        alert(error.message)
    }
}

getAllIssues()

async function getMyIssues() {
    try {
        const res = await fetch('http://localhost:3000/api/issues/my', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Error with my issues')
        mainContainer.innerHTML = ""
        const issues = await res.json()
        issues.forEach(issue => {
            let card = document.createElement('article')
            card.className = `bg-white rounded-xl shadow-md overflow-hidden `
            card.innerHTML = `<div class="bg-cover h-50" style="background-image: url('/uploads/${encodeURIComponent(issue.issueImage || "placeholder.jpg")}')">

        </div>
        <div class="px-3 grid gap-2 py-4">
          <h3 class="text-xl font-semibold">${issue.title}</h3>
          <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
            ${issue.status}
          </div>
          <p>${issue.location}</p>
          <button class="details-btn bg-green-800 flex justify-center py-3 rounded text-white font-semibold" data-id="${issue._id}">View Details</button>
        </div>`

        mainContainer.appendChild(card)
        });
        
    } catch (error) {
        alert(error.message)
    }
}

allReportsBtn.addEventListener('click', (e) => {
    mainContainer.innerHTML = ""
    getAllIssues()
    allReportsBtn.classList.add("bg-naija-yellow")
    allReportsBtn.classList.remove("outline")
    myReportsBtn.classList.remove("bg-naija-yellow")
    myReportsBtn.classList.add("outline")
})

myReportsBtn.addEventListener('click', (e) => {
    getMyIssues()
    allReportsBtn.classList.remove("bg-naija-yellow")
    allReportsBtn.classList.add("outline")
    myReportsBtn.classList.add("bg-naija-yellow")
    myReportsBtn.classList.remove("outline")
})

document.addEventListener('click', async (e) => {
    let viewBtn = e.target.closest('.details-btn')
    if(!viewBtn) return
    const id = viewBtn.getAttribute("data-id")
    console.log('Fetching details for ID:', id)
    try{
        const res = await fetch(`http://localhost:3000/api/issues/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to load issue details')
        const issue = await res.json()
        console.log(issue)
        const imgUrl = issue.issueImage ? `/uploads/${encodeURIComponent(issue.issueImage)}` : './images/placeholder.jpg'

        detailsSection.innerHTML = `<div  class="bg-green-800 flex justify-between items-center px-4 py-6 text-white mb-8">
            <button class="back-btn text-xl cursor-pointer">&larr;</button>
            <h4 class="text-white font-semibold">Details</h4>
          </div>

          <div class="grid gap-12 px-4 mx-auto max-w-4xl">
            <article aria-labelledby="sighting-title" class="border border-gray-400 px-4 py-2 bg-white">
            <div class="bg-cover h-72" style="background-image: url('${imgUrl}')"></div>
            
            <div class="grid gap-2">
              <h3 class="text-xl font-semibold">${issue.title}</h3>
              <p class="line-clamp-8 text-lg">${issue.description}</p>
              <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
                ${issue.status}
              </div>
              <p class="text-sm ">${issue.location}</p>
              <p class="text-sm ">Reported ${new Date(issue.createdAt).toLocaleString()}</p>
              <p class="italic text-sm">Submitted by ${issue.createdBy?.name || issue.createdBy || 'User'}</p>
            </div>
            </article>
          </div>`
        detailsSection.classList.remove('hidden')

    } catch(error) {
        alert('Error on getting details,' + error.message)
    }

    
})