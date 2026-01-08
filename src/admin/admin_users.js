import { fetchWithAuth } from '../login.js'

const token = localStorage.getItem('token')
const usersTable = document.querySelector('.usersTable')
const userNextBtn = document.getElementById('user-next-btn')
const userPrevBtn = document.getElementById('user-prev-btn')
let totalPages;
const userNumberButtonContainer = document.getElementById('userNumberButtonContainer')
let currentPage = 1
const limit = 1

let pages = []
let rangeWithDots = []
const pageAround = 2
let previousPage;

async function getUsers(currentPage, limit) {
    try {
        const res = await fetchWithAuth(`http://localhost:3000/api/users?page=${currentPage}&limit=${limit}`)
        if (!res.ok) throw new Error('Error with all users')
        const data = await res.json()
    console.log(data)

    const users = data.usersWithIssuesCount
        currentPage = data.currentpage
        totalPages = data.totalPages
        usersTable.innerHTML = ""
        userNumberButtonContainer.innerHTML = ""
        pages = []
        rangeWithDots = []
        await renderPagination(currentPage, totalPages)
        users.forEach((user, index) => {
            let displayIndex = index + 1
            const serialNumber = ((currentPage - 1) * limit) + displayIndex
            const suspendedText = user.suspension === "suspended" ? "Unsuspend" : "Suspend"
            const suspendedBtnColor = user.suspension === "suspended" ? "bg-gray-400" : "bg-naija-yellow"
            let row = document.createElement('div')
            row.className = `w-full grid grid-cols-[100px_1fr_1fr_150px_150px] gap-4 text-black px-2 py-4 bg-transparent items-center border-b border-gray-400`

            row.innerHTML = `
                <p>${serialNumber}</p>
                <p class="overflow-x-auto">${user.username}</p>
                <p class="overflow-x-auto">${user.email}</p>
                
                <div>
                    <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
                    ${user.totalIssues}
                    </div>
                </div> 
                <div class="relative">
                    <button class="user-action-btn flex items-center gap-2 border border-green-800 rounded px-3 py-2 w-full" data-id="${user._id}">
                        <img src="../images/icon-menu.svg" class="w-5">
                        <span>Action</span>
                        </button>
                        <div class="bg-white rounded absolute top-[calc(100%+0.5rem)] right-0 px-3 min-w-[300px] shadow-lg border border-green-800 action-container transition hidden">
                            <div class="flex  items-center justify-end my-2"><img src="/images/icon-menu-close.svg" class="w-4 users-cancel-btn cursor-pointer"></div>
                            <div class="flex justify-center items-center gap-2 mb-2">
                                <button class="flex items-center px-3 py-2 ${suspendedBtnColor} rounded cursor-pointer user-suspend-btn gap-2 hover:brightness-110 transition" data-id="${user._id}" ><img src="/images/ClockOutline.svg" class="w-4" ><span class="text-sm">${suspendedText}</span></button>
                                <button class="flex items-center px-3 py-2 bg-red-500 rounded cursor-pointer user-delete-btn gap-2 hover:brightness-110 transition" data-id="${user._id}"><img src="/images/TrashOutline.svg" class="w-4"><span class="text-sm text-white">Delete</span></button>
                            </div>
                        </div>
                </div>
            `

        console.log(user._id)
        usersTable.append(row)
        
        });
    } catch(error) {
        alert(error.message)
    }

    
}

getUsers(currentPage, limit)

userNextBtn.addEventListener('click',async () => {
    if(currentPage < totalPages) {
        currentPage++
   await getUsers(currentPage, limit)
    }
   
   
})

userPrevBtn.addEventListener('click',async () => {
    if(currentPage > 1) {
        currentPage--
    await getUsers(currentPage, limit)
    }
    
     
})

userNumberButtonContainer.addEventListener('click',async (e) => {
        let pageBtn = e.target.closest('button')
        
        if(pageBtn) {
    currentPage = Number(pageBtn.textContent)
    await getUsers(currentPage, limit)
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
    userNumberButtonContainer.innerHTML = ""
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
        userNumberButtonContainer.appendChild(btn)
        
    })
    await activePageHighlight()
}

async function activePageHighlight() {
    let numberBtns = userNumberButtonContainer.querySelectorAll('button')
    numberBtns.forEach(btn => {
        let number = parseInt(btn.textContent)
        if(number === currentPage) {
            
            btn.classList.add('bg-green-800')
            btn.classList.add('text-white')
            
        }
    })
}


document.addEventListener('click', async (e) => {
    let userActionBtn = e.target.closest('.user-action-btn')
  if(userActionBtn) {
         let actionContainers = document.querySelectorAll('.action-container')
         actionContainers.forEach(container => {
            container.classList.add('hidden')
         })
         let actionBtnContainer = userActionBtn.parentElement
         let actionContainer = actionBtnContainer.querySelector('.action-container')
         actionContainer.classList.remove('hidden')
  }
})

document.addEventListener('click', async (e) => {
    let usersCancelBtn = e.target.closest('.users-cancel-btn')
  if(usersCancelBtn) {
         let actionContainer = usersCancelBtn.closest('.action-container')
         actionContainer.classList.add('hidden')
  }
})



document.addEventListener('click', async (e) => {
    let userDeleteBtn = e.target.closest('.user-delete-btn')
  if(userDeleteBtn) {
         let id = userDeleteBtn.getAttribute('data-id')
         await deleteUser(id)
         await getUsers(currentPage, limit)
  }
})

document.addEventListener('click', async (e) => {
    let userSuspendBtn = e.target.closest('.user-suspend-btn')
  if(userSuspendBtn) {
         let id = userSuspendBtn.getAttribute('data-id')
         console.log("User check:",id)
         await suspendUser(id)
         await getUsers(currentPage, limit)
  }
})


async function deleteUser(id) {
        try {
        const res = await fetchWithAuth(`http://localhost:3000/api/users/${id}`, {
            method: "DELETE"
        })
        if (!res.ok) throw new Error('Error deleting users')
        const data = await res.json()
    console.log(data)
    } catch(err) {
        alert(err.message)
    }
}

async function suspendUser(id) {
        try {
            const res = await fetchWithAuth(`http://localhost:3000/api/users/suspend/${id}`, {
                method: "PATCH"
            })
        if (!res.ok) throw new Error('Error suspending users')
        const data = await res.json()
    console.log(data)
        } catch(error) {
            alert(error.message)
        }
}