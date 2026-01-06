const token = localStorage.getItem('token')
import { fetchWithAuth } from '../login.js'
const username = localStorage.getItem('user')
const issuesTable = document.querySelector('.issuesTable')
let currentPage = 1
const limit = 10
const nextBtn = document.getElementById('next-btn')
const prevBtn = document.getElementById('prev-btn')
let totalPages;
const numberButtonContainer = document.getElementById('numberButtonContainer')
const viewDetailsCard = document.getElementById('view-details-card')
const pendingText = document.querySelector('.pending-report')
const acknowledgedText = document.querySelector('.acknowledged-report')
const inProgressText = document.querySelector('.in-progress-report')
const resolvedText = document.querySelector('.resolved-report')

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



async function getReports(name,currentPage, limit) {
    try {
        const res = await fetchWithAuth(`http://localhost:3000/api/issues/officer/${name}?page=${currentPage}&limit=${limit}`)
        if (!res.ok) throw new Error('Error with all issues')
        const data = await res.json()
        
        const issues = data.officerIssues
        currentPage = data.currentpage
        totalPages = data.totalPages
        issuesTable.innerHTML = ""
        numberButtonContainer.innerHTML = ""
        pages = []
        rangeWithDots = []
        
        pendingText.textContent = issues.filter(issue => issue.status === 'Pending').length
         acknowledgedText.textContent = issues.filter(issue => issue.status === 'Acknowledged').length
          inProgressText.textContent = issues.filter(issue => issue.status === 'In-progress').length
        resolvedText.textContent = issues.filter(issue => issue.status === 'Resolved').length
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
            row.className = `w-full grid grid-cols-[50px_1fr_1fr_150px_150px] gap-4 text-black px-2 py-4 bg-transparent items-center border-b border-gray-400`

            row.innerHTML = `
                <p>${issue.issueId}</p>
                <p class="overflow-x-auto">${issue.createdBy?.username || issue.createdBy}</p>
                <p class="overflow-x-auto">${issue.title}</p>
                <div>
                    <div class="text-sm ${statbgColor} rounded w-fit px-3 py-2 font-semibold ">
                    ${issue.status}
                    </div>
                </div> 
                <div>
                    <button class="view-btn flex items-center gap-2 border border-green-800 rounded px-3 py-2 " data-id="${issue._id}">
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

getReports(username,currentPage, limit)

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
        const res = await fetchWithAuth(`http://localhost:3000/api/issues/${id}`)
        if (!res.ok) throw new Error('Failed to load issue details')
        const issue = await res.json()
        const imgUrl = issue.issueImage ? `/uploads/${encodeURIComponent(issue.issueImage)}` : './images/placeholder.jpg'
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
          proofHtml = `
          <form id="report-form" enctype="multipart/form-data" class="grid gap-6 px-4 my-8 mx-auto relative w-full max-w-3xl">
     <div>
      <label for="uploadBox" class="text-xl font-semibold">Add Fix Photo</label>
       <div id="uploadBox" class="relative rounded-xl w-full h-50 md:h-100 bg-gray-300 border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer overflow-hidden hover:border-green-500 transition-colors">
        <input name="fixImage" id="imageInput" type="file" accept="image/*"  hidden>
        <i class="fa-solid fa-image text-5xl" id="uploadIcon"></i>
        <img id="previewImage" alt="Preview" class="absolute inset-0 mx-auto my-auto object-fit hidden rounded">
      </div>
     </div>

      <button type="submit" class="bg-green-800 flex justify-center py-3 rounded w-full text-white font-semibold rounded mx-2">Submit Report</button>
    </form>`
        }
        
        viewDetailsCard.dataset.id = `${issue._id}`
        viewDetailsCard.innerHTML = `
            <div class="max-w-7xl mx-auto flex justify-between justify-end items-center px-4 py-6 text-white">
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
                  <div class="py-2 px-3 rounded bg-gray-200 flex items-center gap-2 min-w-[200px]"><span class="status-text">${issue.status}</span><img src="/images/ChevronDown.svg" class="select-status-btn"></div>
                  <ul class="status-list-container absolute w-full bg-gray-300 top-full mt-2 rounded flex flex-col items-center max-h-[250px] overflow-y-auto overflow-x-auto py-2 gap-2 hidden">
                  <li class="text-left px-2 w-full status-list-element cursor-pointer">Pending</li>
                  <li class="text-left px-2 w-full status-list-element cursor-pointer">Acknowledged</li>
                  <li class="text-left px-2 w-full status-list-element cursor-pointer">In-progress</li>
                  <li class="text-left px-2 w-full status-list-element cursor-pointer">Resolved</li>
                  </ul>
                </div>
           
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
  let selectStatusBtn = e.target.closest('.select-status-btn')
  const statusListContainer = document.querySelector('.status-list-container')
  
  if(selectStatusBtn) {
    if(statusListContainer.classList.contains("hidden")) { 
      statusListContainer.classList.remove("hidden")
    } else {
      statusListContainer.classList.add("hidden")
    }
  }
})

document.addEventListener('click', (e) => {
  let statusListElement = e.target.closest('.status-list-element')
  if(statusListElement) {
         let id = viewDetailsCard.dataset.id
         let statusListContainer = statusListElement.parentElement
         statusListContainer.classList.add("hidden")
         let statusText = viewDetailsCard.querySelector('.status-text')
         statusText.textContent = statusListElement.textContent
         sendStatusUpdate(id, statusListElement.textContent.trim())
  }
})


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

async function sendStatusUpdate(id, text) {
  try {
    const res = await fetch(`http://localhost:3000/api/issues/status/${id}`, {
      method: "PATCH",
      headers: { 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: text
    })
    })
    if (!res.ok) {
      const errorText = await res.text() // Get raw response
      console.error('Server error:', errorText)
      throw new Error(`Failed to update status: ${res.status}`)
    }
    let data = await res.json()
    console.log(res)
    console.log("Json:", data)
  } catch(err) {
    console.error('Full error:', err)
    alert(err.message)
  }
}

// const form = document.getElementById('report-form')
// const imageInput = document.getElementById('imageInput')
// const successMessage = document.getElementById('message')
// const previewImage = document.getElementById('previewImage')
// const uploadIcon = document.getElementById('uploadIcon')


document.addEventListener('submit', async (e) => {     

    if (e.target.id === 'report-form') {
    e.preventDefault()
    
    const form = e.target
    const imageInput = form.querySelector('#imageInput')
    const issueId = viewDetailsCard.dataset.id
    if (!imageInput.files || !imageInput.files[0]) {
      alert('Please select an image before submitting')
      return
    }
    
    const formData = new FormData()
    formData.append('fixImage', imageInput.files[0])
    
    try {
      const res = await fetch(`http://localhost:3000/api/issues/fix/${issueId}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('Server error:', errorText)
        throw new Error(`Failed to upload fix image: ${res.status}`)
      }
      
      const data = await res.json()
      console.log('Fix image uploaded successfully:', data)
      
      await getIssueDetails(issueId)
      
    } catch (err) {
      console.error('Upload error:', err)
      alert(`Error uploading proof of fix: ${err.message}`)
    }
  }
})





document.addEventListener('change', (e) => {
    const file = e.target.files[0]
    const uploadBox = document.getElementById('uploadBox')
    const previewImage = document.getElementById('previewImage')
    const uploadIcon = document.getElementById('uploadIcon')
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            previewImage.src = e.target.result
            previewImage.classList.remove('hidden')
            uploadIcon.classList.add('hidden')
        }
        reader.readAsDataURL(file)
    }
})

document.addEventListener('click', (e) => {
  if (e.target.closest('#uploadBox')) {
    const imageInput = document.getElementById('imageInput')
    if (imageInput) {
      imageInput.click()
    }
  }
})