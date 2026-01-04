const mainContainer = document.getElementById('main-container')
const myReportsBtn = document.getElementById('my-report-btn')
const allReportsBtn = document.getElementById('all-report-btn')
const token = localStorage.getItem('token')
const detailsSection = document.getElementById('details-section')
const commentSection = document.getElementById('comment-section')
const suspensionState = localStorage.getItem('suspension')
console.log(suspensionState,"Issues getting")

async function getAllIssues() {
    try {
        const res = await fetch('http://localhost:3000/api/issues', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Error with all issues')
        const issues = await res.json()
        
        issues.forEach(issue => {
            let card = document.createElement('article')
            card.className = `bg-white rounded-xl shadow-md overflow-hidden h-full`
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
        
        mainContainer.prepend(card)
        });
        if(suspensionState === "suspended") {
    const detailsBtn = document.querySelectorAll('.details-btn')
          detailsBtn.forEach(btn => {
            btn.disabled = true
       btn.classList.add('opacity-50', 'cursor-not-allowed')
       btn.title = "Account suspended"
          })
    
       
    
    alert("Your account is currently suspended. You cannot report new issues or comment on existing ones.")
}
        
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
            card.className = `bg-white rounded-xl shadow-md overflow-hidden h-full `
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

        mainContainer.prepend(card)
        });
        if(suspensionState === "suspended") {
    const detailsBtn = document.querySelectorAll('.details-btn')
          detailsBtn.forEach(btn => {
            btn.disabled = true
       btn.classList.add('opacity-50', 'cursor-not-allowed')
       btn.title = "Account suspended"
          })
    
       
    
    alert("Your account is currently suspended. You cannot report new issues or comment on existing ones.")
}
        
    } catch (error) {
        alert(error.message)
    }
}

export async function loadIssues(filter) {
  mainContainer.innerHTML = ""
  if(filter === 'my') {
    await getMyIssues()
  } else {
    await getAllIssues()
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
    await getIssueDetails(id)
    
})

export async function getIssueDetails(id) {
  try{
        const res = await fetch(`http://localhost:3000/api/issues/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to load issue details')
        const issue = await res.json()
        const imgUrl = issue.issueImage ? `/uploads/${encodeURIComponent(issue.issueImage)}` : './images/placeholder.jpg'
        const proofImage = issue.fixImage ? `/uploads/${encodeURIComponent(issue.fixImage)}` : null
        let proofHtml;

        if(proofImage) {
          proofHtml =`
        <article class="border border-gray-400 px-4 py-2 bg-white">
            <h4 class="mb-4 text-3xl font-semibold">Proof of fix</h4>
            <div style="background-image: url('${proofImage}'); background-size: cover; background-position: center;" class="h-72 rounded"></div>
        </article>
    `
        } else {
          proofHtml = ''
        }
        

        detailsSection.innerHTML = `<div  class="bg-green-800  mb-8  ">
            <div class="max-w-7xl mx-auto flex justify-between items-center px-4 py-6 text-white">
              <button class="back-btn text-xl cursor-pointer">&larr;</button>
              <h4 class="text-white font-semibold">Details</h4>
            </div>
          </div>

          <div class="grid gap-12 px-4 mx-auto max-w-4xl">
            <article aria-labelledby="sighting-title" class="border border-gray-400 px-4 py-2 bg-white">
            <div class="bg-contain bg-no-repeat h-72" style="background-image: url('${imgUrl}')"></div>
            
            <div class="grid gap-2">
              <h3 class="text-xl font-semibold">${issue.title}</h3>
              <p class="line-clamp-8 text-lg">${issue.description}</p>
              <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
                ${issue.status}
              </div>
              <p class="text-sm ">${issue.location}</p>
              <p class="text-sm ">Reported ${formatDate(issue.createdAt)}</p>
              <p class="italic text-sm">Submitted by ${issue.createdBy?.username || issue.createdBy || 'User'}</p>
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
            <button id="leave-comment-btn" class="leave-comment-btn bg-green-800 flex justify-center items-center gap-3 py-3 px-3 rounded w-fit text-white font-semibold" data-id="${id}"><span>&#128172;</span> <span>Leave a comment</span></button>
        </article>

        ${proofHtml}

        <img src="./images/nfix1.png" alt="logo" srcset="" class="w-40 mt-8">
      </div>

        
          `

        const commentParagraphs = detailsSection.querySelectorAll('.comment-text')
        
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
        
        detailsSection.classList.remove('hidden')
        document.body.classList.add("overflow-y-hidden")
      

    } catch(error) {
        alert('Error on getting details,' + error.message)
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

