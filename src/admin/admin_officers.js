const token = localStorage.getItem('token')
const officersTable = document.querySelector('.officersTable')
const officerNextBtn = document.getElementById('officer-next-btn')
const officerPrevBtn = document.getElementById('officer-prev-btn')
let totalPages;
const officerNumberButtonContainer = document.getElementById('officerNumberButtonContainer')
let currentPage = 1
const limit = 1

let pages = []
let rangeWithDots = []
const pageAround = 2
let previousPage;

async function getOfficers(currentPage, limit) {
    try {
        const res = await fetch(`http://localhost:3000/api/users/officers?page=${currentPage}&limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        console.log(res)
        if (!res.ok) throw new Error('Error with all officers')
        const data = await res.json()
    console.log(data)

    const officers = data.officers
        currentPage = data.currentpage
        totalPages = data.totalPages
        officersTable.innerHTML = ""
        officerNumberButtonContainer.innerHTML = ""
        pages = []
        rangeWithDots = []
        await renderPagination(currentPage, totalPages)
        officers.forEach((officer) => {
            const suspendedText = officer.suspension === "suspended" ? "Unsuspend" : "Suspend"
            const suspendedBtnColor = officer.suspension === "suspended" ? "bg-gray-400" : "bg-naija-yellow"
            let row = document.createElement('div')
            row.className = `w-full grid grid-cols-[1fr_1fr_150px_150px_150px_150px] gap-4 text-black px-2 py-4 bg-transparent items-center border-b border-gray-400`

            row.innerHTML = `
                <p class="overflow-x-auto">${officer.username}</p>
                <p class="overflow-x-auto">${officer.email}</p>
                
                <div>
                    <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
                    ${officer.totalIssues}
                    </div>
                </div> 

                <div>
                    <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
                    ${officer.issuesResolved}
                    </div>
                </div> 

                <p>21 Aug 2024</p>
                
                <div class="relative">
                    <button class="officer-action-btn flex items-center gap-2 border border-green-800 rounded px-3 py-2 " data-id="${officer._id}">
                        <img src="../images/icon-menu.svg" class="w-5">
                        <span>Action</span>
                    </button>
                    <div class="bg-white rounded absolute top-[calc(100%+0.5rem)] right-0 px-3 min-w-[300px] shadow-lg border border-green-800 action-container hidden">
                            <div class="flex  items-center justify-end my-2"><img src="/images/icon-menu-close.svg" class="w-4 officers-cancel-btn cursor-pointer"></div>
                            <div class="flex justify-center items-center gap-2 mb-2">
                                <button class="flex items-center px-3 py-2 ${suspendedBtnColor} rounded cursor-pointer officer-suspend-btn gap-2" data-id="${officer._id}" ><img src="/images/ClockOutline.svg" class="w-4" ><span class="text-sm">${suspendedText}</span></button>
                                <button class="flex items-center px-3 py-2 bg-red-500 rounded cursor-pointer officer-delete-btn gap-2" data-id="${officer._id}"><img src="/images/TrashOutline.svg" class="w-4"><span class="text-sm text-white">Delete</span></button>
                            </div>
                        </div>
                </div>
            `

        
        officersTable.append(row)
        
        });
    } catch(error) {
        alert(error.message)
    }

    
}

getOfficers(currentPage, limit)

officerNextBtn.addEventListener('click',async () => {
    if(currentPage < totalPages) {
        currentPage++
   await getOfficers(currentPage, limit)
    }
   
   
})

officerPrevBtn.addEventListener('click',async () => {
    if(currentPage > 1) {
        currentPage--
    await getOfficers(currentPage, limit)
    }
    
     
})

officerNumberButtonContainer.addEventListener('click',async (e) => {
        let pageBtn = e.target.closest('button')
        
        if(pageBtn) {
    currentPage = Number(pageBtn.textContent)
    await getOfficers(currentPage, limit)
        }
})


async function getPagination(currentPage, totalPages) {
        for(let i = 1; i <= totalPages; i++) {
            if(i === 1 || i === totalPages || i >= (currentPage - pageAround) && i <= (currentPage + pageAround) ) {
                pages.push(i)
            }
        }

        await addElipsis()
}

async function addElipsis() {
    officerNumberButtonContainer.innerHTML = ""
        pages.forEach(page => {
            if(previousPage && page - previousPage > 1) {
            rangeWithDots.push('...')
        }
        rangeWithDots.push(page)
        
        previousPage = page
        
        })
        
        
}

async function renderPagination(currentPage, totalPages) {
    await getPagination(currentPage, totalPages)
    rangeWithDots.forEach(page => {
        let btn = document.createElement('button')
        btn.textContent = page
        btn.className = `border border-green-800 px-6 py-3 text-lg`
        officerNumberButtonContainer.appendChild(btn)
        
    })
    await activePageHighlight()
}

async function activePageHighlight() {
    let numberBtns = officerNumberButtonContainer.querySelectorAll('button')
    numberBtns.forEach(btn => {
        let number = parseInt(btn.textContent)
        if(number === currentPage) {
            
            btn.classList.add('bg-green-800')
            btn.classList.add('text-white')
            
        }
    })
}

document.addEventListener('click', async (e) => {
    let officerActionBtn = e.target.closest('.officer-action-btn')
  if(officerActionBtn) {
         let actionContainers = document.querySelectorAll('.action-container')
         actionContainers.forEach(container => {
            container.classList.add('hidden')
         })
         let actionBtnContainer = officerActionBtn.parentElement
         let actionContainer = actionBtnContainer.querySelector('.action-container')
         actionContainer.classList.remove('hidden')
  }
})

document.addEventListener('click', async (e) => {
    let officersCancelBtn = e.target.closest('.officers-cancel-btn')
  if(officersCancelBtn) {
         let actionContainer = officersCancelBtn.closest('.action-container')
         actionContainer.classList.add('hidden')
  }
})



document.addEventListener('click', async (e) => {
    let officerDeleteBtn = e.target.closest('.officer-delete-btn')
  if(officerDeleteBtn) {
         let id = officerDeleteBtn.getAttribute('data-id')
         await deleteofficer(id)
         await getofficers(currentPage, limit)
  }
})

document.addEventListener('click', async (e) => {
    let officerSuspendBtn = e.target.closest('.officer-suspend-btn')
  if(officerSuspendBtn) {
         let id = officerSuspendBtn.getAttribute('data-id')
         console.log("officer check:",id)
         await suspendofficer(id)
         await getofficers(currentPage, limit)
  }
})


async function deleteofficer(id) {
        try {
        const res = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: "DELETE",
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Error deleting officer')
        const data = await res.json()
    console.log(data)
    } catch(err) {
        alert(err.message)
    }
}

async function suspendOfficer(id) {
        try {
            const res = await fetch(`http://localhost:3000/api/users/suspend/${id}`, {
                method: "PATCH",
                headers: { 'Authorization': `Bearer ${token}` }
            })
        if (!res.ok) throw new Error('Error suspending officer')
        const data = await res.json()
    console.log(data)
        } catch(error) {
            alert(error.message)
        }
}