const token = localStorage.getItem('token')
const usersTable = document.querySelector('.usersTable')
let currentPage = 1
const limit = 10
let totalPages;

let pages = []
let rangeWithDots = []
const pageAround = 2
let previousPage;

async function getUsers(currentPage, limit) {
    try {
        const res = await fetch(`http://localhost:3000/api/users?page=${currentPage}&limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Error with all users')
        const data = await res.json()
    console.log(data)

    const users = data.usersWithIssuesCount
        currentPage = data.currentpage
        totalPages = data.totalPages
        usersTable.innerHTML = ""
        // numberButtonContainer.innerHTML = ""
        // pages = []
        // rangeWithDots = []
        // await renderPagination(currentPage, totalPages)
        users.forEach((user, index) => {
            let displayIndex = index + 1
            let row = document.createElement('div')
            row.className = `w-full grid grid-cols-[100px_1fr_1fr_150px_150px] gap-4 text-black px-2 py-4 bg-transparent items-center border-b border-gray-400`

            row.innerHTML = `
                <p>${displayIndex}</p>
                <p class="overflow-x-auto">${user.username}</p>
                <p class="overflow-x-auto">${user.email}</p>
                
                <div>
                    <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
                    ${user.totalIssues}
                    </div>
                </div> 
                <div>
                    <button class="view-btn flex items-center gap-2 border border-green-800 rounded px-3 py-2 " data-id="${user._id}">
                        <img src="../images/icon-menu.svg" class="w-5">
                        <span>View Details</span>
                    </button>
                </div>
            `

        
        usersTable.append(row)
        
        });
    } catch(error) {
        alert(error.message)
    }

    
}

getUsers(currentPage, limit)
