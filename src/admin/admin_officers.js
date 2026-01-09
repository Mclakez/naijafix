
import { fetchWithAuth } from '../login.js'
const token = localStorage.getItem('token')
const officersTable = document.querySelector('.officersTable')
const officerNextBtn = document.getElementById('officer-next-btn')
const officerPrevBtn = document.getElementById('officer-prev-btn')
let totalPages;
const officerNumberButtonContainer = document.getElementById('officerNumberButtonContainer')
const addOfficerBtn = document.querySelector('.add-officer-btn')
const form = document.querySelector('form')
let currentPage = 1
const limit = 1

let pages = []
let rangeWithDots = []
const pageAround = 2
let previousPage;

async function getOfficers(currentPage, limit) {
    try {
        const res = await fetchWithAuth(`http://localhost:3000/api/users/officers?page=${currentPage}&limit=${limit}`)

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
            const formattedDate = formatDate(officer.lastSeen)
            let row = document.createElement('div')
            

            row.className = `w-full text-black border-b border-gray-400
                            md:grid md:grid-cols-[1fr_1fr_150px_150px_150px_150px] md:gap-4 md:px-2 md:py-4 md:items-center
                            flex flex-col gap-3 p-4 bg-white md:bg-transparent`

            row.innerHTML = `
                
                <div class="flex justify-between md:block overflow-x-auto">
                    <span class="font-semibold md:hidden">Username:</span>
                    <p>${officer.username}</p>
                </div>
                
                <div class="flex justify-between md:block">
                    <span class="font-semibold md:hidden">Email:</span>
                    <p class="overflow-x-auto text-right md:text-left">${officer.email}</p>
                </div>
                
                <div class="flex justify-between md:block">
                    <span class="font-semibold md:hidden">Total issues:</span>
                    <p class="overflow-x-auto text-right md:text-left">${officer.totalIssues}</p>
                </div>
                
                <div class="flex justify-between md:block">
                    <span class="font-semibold md:hidden">Resolved issues:</span>
                    <p class="overflow-x-auto text-right md:text-left">${officer.issuesResolved}</p>
                </div>
                
                <div class="flex justify-between items-center md:block">
                    <span class="font-semibold md:hidden">Last online:</span>
                    <div class="overflow-x-auto text-right md:text-left">
                       ${formattedDate}
                    </div>
                </div>
                
                <div class="md:block relative">
                    <button class="officer-action-btn flex items-center justify-center gap-2 border border-green-800 rounded px-3 py-2 w-full md:w-auto" data-id="${officer._id}">
                        <img src="../images/icon-menu.svg" class="w-5">
                        <span>Action</span>
                    </button>
                    <div class="bg-white rounded absolute top-[calc(100%+0.5rem)] right-0 px-3 min-w-[250px] shadow-lg border border-green-800 action-container transition hidden">
                            <div class="flex  items-center justify-end my-2"><img src="/images/icon-menu-close.svg" class="w-4 officers-cancel-btn cursor-pointer"></div>
                            <div class="flex justify-end items-center gap-2 mb-2">
                                <button class="flex items-center px-3 py-2 ${suspendedBtnColor} rounded cursor-pointer officer-suspend-btn gap-2 hover:brightness-110 cursor-pointer transition" data-id="${officer._id}" ><img src="/images/ClockOutline.svg" class="w-4" ><span class="text-sm">${suspendedText}</span></button>
                                <button class="flex items-center px-3 py-2 bg-red-500 rounded cursor-pointer officer-delete-btn gap-2 hover:brightness-110 cursor-pointer transition" data-id="${officer._id}"><img src="/images/TrashOutline.svg" class="w-4"><span class="text-sm text-white">Delete</span></button>
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
    let officersAddCancelBtn = e.target.closest('.officers-add-cancel-btn')
  if(officersAddCancelBtn) {
         let actionContainer = officersAddCancelBtn.closest('form')
         actionContainer.classList.add('hidden')
  }
})



document.addEventListener('click', async (e) => {
    let officerDeleteBtn = e.target.closest('.officer-delete-btn')
  if(officerDeleteBtn) {
         let id = officerDeleteBtn.getAttribute('data-id')
         await deleteOfficer(id)
         await getOfficers(currentPage, limit)
  }
})

document.addEventListener('click', async (e) => {
    let officerSuspendBtn = e.target.closest('.officer-suspend-btn')
  if(officerSuspendBtn) {
         let id = officerSuspendBtn.getAttribute('data-id')
         console.log("officer check:",id)
         await suspendOfficer(id)
         await getOfficers(currentPage, limit)
  }
})

addOfficerBtn.addEventListener('click', async (e) => {
    form.classList.remove('hidden')
})

async function deleteOfficer(id) {
        try {
        const res = await fetchWithAuth(`http://localhost:3000/api/users/${id}`, {
            method: "DELETE"
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
            const res = await fetchWithAuth(`http://localhost:3000/api/users/suspend/${id}`, {
                method: "PATCH"
            })
        if (!res.ok) throw new Error('Error suspending officer')
        const data = await res.json()
    console.log(data)
        } catch(error) {
            alert(error.message)
        }
}

function formatDate(date) {
  let now = new Date()
  let past = new Date(date)

  let diffMs = now - past
  
  let diffMins = Math.floor(diffMs / (1000 * 60))
  let diffHrs = Math.floor(diffMs / (1000 *60 *60))
  let diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if(diffMins < 60) {
    return `${diffMins} min ago`
  }

  if(diffHrs < 24) {
    return `${diffHrs} hr${diffHrs === 1 ? '' : 's'} ago`
  }

  if(diffDays <= 31) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }

  let options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  }

  return past.toLocaleDateString('en-us', options)
}

form.addEventListener('submit', async (e) => {
    e.preventDefault()

        const formData = new FormData(form)
        const officerData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    }
        

    try {
        const res = await fetchWithAuth('http://localhost:3000/api/users/officers', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
        },

            body: JSON.stringify(officerData)
        })

        if (!res.ok) {  
            throw new Error('Officer failed')
        }
        const data = await res.json()
        console.log(data)
       await getOfficers(currentPage, limit)
            form.reset()
            form.classList.add('hidden')
       
        
    } catch (error) {
        console.error("Add officer failed", error.message)
    }
})
