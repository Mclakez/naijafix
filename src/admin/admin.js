const token = localStorage.getItem('token')
const issuesTable = document.querySelector('.issuesTable')
let currentPage = 1
const limit = 10
const nextBtn = document.getElementById('next-btn')
const prevBtn = document.getElementById('prev-btn')
let totalPages;
const numberButtonContainer = document.getElementById('numberButtonContainer')
let pages = []
   
nextBtn.addEventListener('click', () => {
    if(currentPage < totalPages) {
        currentPage++
    getReports(currentPage, limit)
    }
    console.log('next')
    console.log(currentPage, limit)
})

prevBtn.addEventListener('click', () => {
    if(currentPage > 1) {
        currentPage--
    getReports(currentPage, limit)
    }
    console.log('prev')
     console.log(currentPage, limit)
})



async function getReports(currentPage, limit) {
    try {
        const res = await fetch(`http://localhost:3000/api/issues?page=${currentPage}&limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Error with all issues')
        const data = await res.json()
        const issues = data.issues
        currentPage = data.currentpage
        totalPages = data.totalPages
        issuesTable.innerHTML = ""
        numberButtonContainer.innerHTML = ""
        pages = []
        await renderPagination(currentPage, totalPages)
        issues.forEach(issue => {
            let row = document.createElement('div')
            row.className = `w-full grid grid-cols-[100px_1fr_1fr_150px_150px_150px] gap-4 text-black px-2 py-4 bg-transparent items-center border-b border-gray-400`

            row.innerHTML = `
                <p>${issue.issueId}</p>
                <p class="overflow-x-auto">${issue.createdBy?.username || issue.createdBy}</p>
                <p class="overflow-x-auto">${issue.title}</p>
                <p class="overflow-x-auto">Bankole</p>
                <div>
                    <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
                    ${issue.status}
                    </div>
                </div> 
                <div>
                    <button class="flex  items-center gap-2 border border-green-800 rounded px-3 py-2 data-id="${issue._id}">
                        <img src="../images/icon-menu.svg" class="w-5">
                        <span>View Details</span>
                    </button>
                </div>
            `

        
        issuesTable.prepend(row)
        
        });
        
    } catch (error) {
        alert(error.message)
    }
}

getReports(currentPage, limit)

async function getPagination(currentPage, totalPages) {
        pages.push("1")
        pages.push(currentPage)
        pages.push(totalPages)
        console.log(pages)
}

async function renderPagination(currentPage, totalPages) {
    await getPagination(currentPage, totalPages)
    pages.forEach(page => {
        let btn = document.createElement('button')
        btn.textContent = page
        btn.className = `border border-green-800 px-6 py-3 text-lg`
        numberButtonContainer.appendChild(btn)
    })
}