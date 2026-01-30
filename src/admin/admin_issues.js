import { fetchWithAuth } from '../login.js'
let username = localStorage.getItem('user')
const adminName = document.querySelector('.admin-name')
const issuesTable = document.querySelector('.issuesTable')
const usersTable = document.querySelector('.usersTable')
let currentPage = 1
const limit = 10
const nextBtn = document.getElementById('next-btn')
const prevBtn = document.getElementById('prev-btn')
let totalPages;
const numberButtonContainer = document.getElementById('numberButtonContainer')
const viewDetailsCard = document.getElementById('view-details-card')



let pages = []
let rangeWithDots = []
const pageAround = 2
let previousPage;
// let allOfficers = []
   
nextBtn.addEventListener('click', () => {
    if(currentPage < totalPages) {
        currentPage++
    getReports(currentPage, limit)
    }
   
   
})

prevBtn.addEventListener('click', () => {
    if(currentPage > 1) {
        currentPage--
    getReports(currentPage, limit)
    }
    
     
})

numberButtonContainer.addEventListener('click',async (e) => {
        let pageBtn = e.target.closest('button')
        
        if(pageBtn) {
    currentPage = Number(pageBtn.textContent)
    getReports(currentPage, limit)
        }
})



async function getReports(currentPage, limit) {
    try {
      adminName.textContent = username
        const res = await fetchWithAuth(`/api/issues?page=${currentPage}&limit=${limit}`)
        if (!res.ok) throw new Error('Error with all issues')
        const data = await res.json()
        
        const issues = data.issues
        currentPage = data.currentpage
        totalPages = data.totalPages
        issuesTable.innerHTML = ""
        numberButtonContainer.innerHTML = ""
        pages = []
        rangeWithDots = []
        await renderPagination(currentPage, totalPages)
        issues.forEach(issue => {
          let statbgColor;
          if(issue.status === 'Pending') {
          statbgColor = "bg-naija-yellow"
        } else if( issue.status === 'Acknowledged') {
            statbgColor = "bg-blue-500"
        } else if (issue.status === 'In-progress') {
            statbgColor = "bg-[#f97316]"
        } else if(issue.status === 'Resolved'){
            statbgColor = "bg-green-800"
        }
            let row = document.createElement('div')
            row.className = `w-full text-black border-b border-gray-400
                            md:grid md:grid-cols-[50px_1fr_1fr_150px_150px_150px] md:gap-4 md:px-2 md:py-4 md:items-center
                            flex flex-col gap-3 p-4 bg-white md:bg-transparent`

            row.innerHTML = `
                
                <div class="flex justify-between md:block">
                    <span class="font-semibold md:hidden">ID:</span>
                    <p>${issue.issueId}</p>
                </div>
                
                <div class="flex justify-between md:block">
                    <span class="font-semibold md:hidden">Username:</span>
                    <p class="overflow-x-auto text-right md:text-left">${issue.createdBy?.username || issue.createdBy}</p>
                </div>
                
                <div class="flex justify-between md:block">
                    <span class="font-semibold md:hidden">Title:</span>
                    <p class="overflow-x-auto text-right md:text-left">${issue.title}</p>
                </div>
                
                <div class="flex justify-between md:block">
                    <span class="font-semibold md:hidden">Officer:</span>
                    <p class="overflow-x-auto text-right md:text-left">${issue.officer}</p>
                </div>
                
                <div class="flex justify-between items-center md:block">
                    <span class="font-semibold md:hidden">Status:</span>
                    <div class="text-sm ${statbgColor} rounded w-fit px-3 py-2 font-semibold">
                        ${issue.status}
                    </div>
                </div>
                
                <div class="md:block">
                    <button class="view-btn flex items-center justify-center gap-2 border border-green-800 rounded px-3 py-2 w-full md:w-auto" data-id="${issue._id}">
                        <img src="../images/icon-menu.svg" class="w-5">
                        <span>View Details</span>
                    </button>
                </div>
            `

        
        issuesTable.append(row)
        
        });
        
    } catch (error) {
        alert(error.message)
    }
}

getReports(currentPage, limit)

async function getPagination(currentPage, totalPages) {
        for(let i = 1; i <= totalPages; i++) {
            if(i === 1 || i === totalPages || i >= (currentPage - pageAround) && i <= (currentPage + pageAround) ) {
                pages.push(i)
            }
        }

        await addElipsis()
}

async function addElipsis() {
    numberButtonContainer.innerHTML = ""
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
        numberButtonContainer.appendChild(btn)
        activePageHighlight()
    })
}

function activePageHighlight() {
    let numberBtns = numberButtonContainer.querySelectorAll('button')
    numberBtns.forEach(btn => {
        let number = parseInt(btn.textContent)
        if(number === currentPage) {
            
            btn.classList.add('bg-green-800')
            btn.classList.add('text-white')
            
        }
    })
}

document.addEventListener('click',async (e) => {
        let viewBtn = e.target.closest('.view-btn')
        
        if(viewBtn) {
            let dataId = viewBtn.getAttribute("data-id")
            await getIssueDetails(dataId)
        }
})



export async function getIssueDetails(id) {
  try{
        const res = await fetchWithAuth(`/api/issues/${id}`)
        if (!res.ok) throw new Error('Failed to load issue details')
        const issue = await res.json()
        const imgUrl = issue.issueImage ? `${issue.issueImage}` : './images/placeholder.jpg'
        const proofImage = issue.fixImage ? `/uploads/${encodeURIComponent(issue.fixImage)}` : null
        let statbgColor;
          if(issue.status === 'Pending') {
          statbgColor = "bg-naija-yellow"
        } else if( issue.status === 'Acknowledged') {
            statbgColor = "bg-blue-500"
        } else if (issue.status === 'In-progress') {
            statbgColor = "bg-[#f97316]"
        } else if(issue.status === 'Resolved'){
            statbgColor = "bg-green-800"
        }
        let proofHtml;

        if(proofImage) {
          proofHtml = `
        <article class="border border-gray-400 px-4 py-2 bg-white">
            <h4 class="mb-4 text-3xl font-semibold">Proof of fix</h4>
            <div style="background-image: url('${proofImage}'); background-size: cover; background-position: center;" class="h-72 rounded"></div>
        </article>
    `
        } else {
          proofHtml = ''
        }
        
        viewDetailsCard.dataset.id = `${issue._id}`
        viewDetailsCard.innerHTML = `
            <div class="max-w-7xl mx-auto flex justify-end items-center px-4 py-6 text-white">
              <img src="/images/icon-menu-close.svg" class="w-2 details-cancel-btn">
            </div>
          

          <div class="grid gap-12 px-4 mx-auto max-w-4xl">
            <article aria-labelledby="sighting-title" class="border border-gray-400 px-4 py-2 bg-white">
            <div class="bg-contain bg-no-repeat h-72" style="background-image: url('${imgUrl}')"></div>
            
            <div class="grid gap-2">
              <h3 class="text-xl font-semibold">${issue.title}</h3>
              <p class="line-clamp-8 text-lg">${issue.description}</p>
              <div class="text-sm ${statbgColor} rounded w-fit px-3 py-2 font-semibold ">
                ${issue.status}
              </div>
              <p class="text-sm ">${issue.location}</p>
              <p class="text-sm ">Reported ${formatDate(issue.createdAt)}</p>
              <p class="italic text-sm">Submitted by ${issue.createdBy?.username || issue.createdBy || 'User'}</p>
            </div>
            
            <div class="flex gap-2 items-center my-6">

                <div class="relative">
                  <div class="py-2 px-3 rounded bg-gray-200 flex justify-between items-center gap-2 w-fit md:min-w-[200px]"><span class="officer-text">${issue.officer || "Select officer"}</span><img src="/images/ChevronDown.svg" class="select-officer-btn cursor-pointer"></div>
                  <ul class="officers-list-container absolute w-full bg-gray-300 top-full mt-2 rounded flex-col items-center max-h-[250px] overflow-y-auto overflow-x-auto py-2 gap-2 transition hidden"></ul>
                </div>
                <button class="bg-red-500 py-2 px-3 rounded flex items-center text-white gap-2 delete-btn hover:brightness-110 cursor-pointer transition" data-id="${issue._id}"><img src="/images/TrashOutline.svg"><span>Delete issue</span></button>
           
             </div>
            </article>
            <article class="border border-gray-400 px-4 py-2 bg-white">
            
            <ul>

              ${issue.comments.map(comment => {
          return ` <li>
                <div class="flex justify-between">
                  <span class="font-semibold">${comment.userID.username}</span>
                  <span>${formatDate(comment.date)}</span>
                </div>
                <div class="relative comment-container">
                <p class="comment-text break-words break-all line-clamp-4 text-lg transition-[max-height] duration-500 ease-in-out">${comment.comment}</p>

                <button id="overlay" class="see-more-btn absolute bottom-0 right-0 bg-gradient-to-l from-white text-blue-600 cursor-pointer pl-40 text-lg">... see more</button>
            </div>
            <hr class="my-4 bg-none border-[0.5px] border-gray-500">
              </li>`
              }).join('')
}

            </ul>

            


            
        </article>

        ${proofHtml}

      </div>

        
          `

          viewDetailsCard.style.display = "block"

        const commentParagraphs = viewDetailsCard.querySelectorAll('.comment-text')
        
        commentParagraphs.forEach(paragraph => {
          
          setTimeout(() => {
          let visibleHeight = paragraph.clientHeight
          let fullHeight = paragraph.scrollHeight
          const seeMoreBtn = paragraph.closest("li").querySelector(".see-more-btn")
          if(fullHeight > visibleHeight) {
             seeMoreBtn.style.display = "block"
          } else {
            seeMoreBtn.style.display = "none"
          }
          
          }, 0);
        })
        // detailsSection.classList.remove('hidden')
        // document.body.classList.add("overflow-y-hidden")
      

    } catch(error) {
        alert('Error on getting details,' + error.message)
    }

}

document.addEventListener('click', (e) => {
  let detailsCancelBtn = e.target.closest('.details-cancel-btn')
  if(detailsCancelBtn) {
    viewDetailsCard.style.display = "none"
  }
})

document.addEventListener('click',async (e) => {
  let deleteBtn = e.target.closest('.delete-btn')
  if(deleteBtn) {
    let id = deleteBtn.getAttribute('data-id')
    await deleteIssue(id)
  }
})

document.addEventListener('click',async (e) => {
  let selectOfficerBtn = e.target.closest('.select-officer-btn')
  const officersListContainer = document.querySelector('.officers-list-container')
  
  if(selectOfficerBtn) {
    officersListContainer.innerHTML = ""
    if(officersListContainer.classList.contains("hidden")) {
      let officers = await getAllOfficers()
    officers.forEach(officer => {
      let officerListElement = document.createElement('li')
      officerListElement.className = `text-left px-2 w-full officer-list-element cursor-pointer hover:brightness-110`
      officerListElement.innerHTML = `
      ${officer.username}
      `
      officersListContainer.classList.remove("hidden")
      officersListContainer.appendChild(officerListElement)
    })
    } else {
      officersListContainer.classList.add("hidden")
    }
  }
})

document.addEventListener('click', async (e) => {
  let officerListElement = e.target.closest('.officer-list-element')
  if(officerListElement) {
         let id = viewDetailsCard.dataset.id
         let officerListContainer = officerListElement.parentElement
         officerListContainer.classList.add("hidden")
         let officerText = viewDetailsCard.querySelector('.officer-text')
         officerText.textContent = officerListElement.textContent
         await sendOfficerUpdate(id, officerListElement.textContent.trim())
         await getReports(currentPage, limit)
  }
})

async function deleteIssue(id) {
  try {
          const res = await fetchWithAuth(`/api/issues/delete/${id}`, {
              method: 'DELETE'
          })
  
          if (!res.ok) {  
              throw new Error('Issue deletion failed')
          }
  
          const data = await res.json()
          viewDetailsCard.style.display = "none"
          await getReports(currentPage, limit)
          
      } catch (error) {
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

async function getAllOfficers() {
  try {
    const res = await fetchWithAuth(`/api/users/officers`)
        
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || `Server error: ${res.status}`)
        }
        
        const data = await res.json()
        console.log('Officers data:', data)
        return data.officers
  } catch (error) {
    console.error('Full error:', error)
    alert(error.message)
  }
}

async function sendOfficerUpdate(id, text) {
  try {
    const res = await fetchWithAuth(`/api/issues/officers/${id}`, {
      method: "PATCH",
      headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      officer: `${text}`
    })
    })
    let data = await res.json()
    console.log(res)
    console.log("Json:", data)
  } catch(err) {
    console.error('Full error:', err)
    alert(err.message)
  }
}