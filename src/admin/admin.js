const token = localStorage.getItem('token')
const issuesTable = document.querySelector('.issuesTable')

async function getReports() {
    try {
        const res = await fetch('http://localhost:3000/api/issues?page=2&limit=10', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Error with all issues')
        const issues = await res.json()
        
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

getReports()