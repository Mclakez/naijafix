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
          <button class="details-btn bg-green-800 flex justify-center py-3 rounded text-white font-semibold" data-id=${issue._id}>View Details</button>
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
            card.innerHTML = `<div class="bg-cover h-50" style="background-image: url('/uploads/${encodeURIComponent(issue.issueImage)}')">

        </div>
        <div class="px-3 grid gap-2 py-4">
          <h3 class="text-xl font-semibold">${issue.title}</h3>
          <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
            ${issue.status}
          </div>
          <p>${issue.location}</p>
          <button class="details-btn bg-green-800 flex justify-center py-3 rounded text-white font-semibold">View Details</button>
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

document.addEventListener('click', (e) => {
    let viewBtn = e.target.closest('.details-btn')
    if(!viewBtn) return
    const id = viewBtn.getAttribute("data-id")
    
    detailsSection.innerHTML = `<div  class="bg-green-800 flex justify-between items-center px-4 py-6 text-white mb-8">
        <button class="back-btn text-xl cursor-pointer">&larr;</button>
        <h4 class="text-white font-semibold">Details</h4>
      </div>

      <div class="grid gap-12 px-4 mx-auto max-w-4xl">
        <article aria-labelledby="sighting-title" class="border border-gray-400 px-4 py-2 bg-white">
        <div class="bg-[url('./images/5de09a7068512cd7e5cdae70566ce4cd.jpg')] bg-cover h-72"></div>
        
        <div class="grid gap-2">
          <h3 class="text-xl font-semibold">Heavy Rainfall at Third Mainland bridge</h3>
        
            
            <div class="relative text-container">
                <p id="text" class="line-clamp-8 text-lg">I was drifting through town, lost in thought, when I stepped into the street without looking. A piercing shriek sliced through the air—an old woman, her voice cracking like dead leaves, screamed for me to stop. I froze and turned just in time to see a bus thunder past, a blast of air clawing at my face. My heart pounded as I looked across to thank her, but the street was empty. No trace of her remained. That’s when the chill set in—she looked exactly like my grandmother, who we buried seven years ago. I still remember the floral scarf she wore... the same one we buried her in.</p>

                <button id="overlay" class="see-more-btn absolute bottom-0 right-0 bg-gradient-to-l from-white text-blue-600 cursor-pointer pl-40 text-lg">... see more</button>
            </div>
            <div class="text-sm bg-naija-yellow rounded w-fit px-3 py-2 font-semibold ">
            Pending
          </div>

          <p class="text-sm ">Lagos, Nigeria</p>
          <p class="text-sm ">Reported 28th July 2025</p>
          <p class="italic text-sm">Submitted by User1</p>
        </div>
        </article>

        <article class="border border-gray-400 px-4 py-2 bg-white">
            <ul>
              <li>
                <div class="flex justify-between">
                  <span class="font-semibold">Sukura001</span>
                  <span>13h ago</span>
                </div>
                <div class="relative comment-container">
                <p id="text" class="comment-text line-clamp-4 text-lg transition-[max-height] duration-500 ease-in-out">I was drifting through town, lost in thought, when I stepped into the street without looking. A piercing shriek sliced through the air—an old woman, her voice cracking like dead leaves, screamed for me to stop. I froze and turned just in time to see a bus thunder past, a blast of air clawing at my face. My heart pounded as I looked across to thank her, but the street was empty. No trace of her remained. That’s when the chill set in—she looked exactly like my grandmother, who we buried seven years ago. I still remember the floral scarf she wore... the same one we buried her in.</p>

                <button id="overlay" class="see-more-btn absolute bottom-0 right-0 bg-gradient-to-l from-white text-blue-600 cursor-pointer pl-40 text-lg">... see more</button>
            </div>
            <hr class="my-4">
              </li>
              
              <li>
                <div class="flex justify-between">
                  <span class="font-semibold">Sukura001</span>
                  <span>13h ago</span>
                </div>
                <div class="relative comment-container">
                <p id="text" class="comment-text line-clamp-4 text-lg transition-[max-height] duration-500 ease-in-out">I was drifting through town, lost in thought, when I stepped into the street without looking. A piercing shriek sliced through the air—an old woman, her voice cracking like dead leaves, screamed for me to stop. I froze and turned just in time to see a bus thunder past, a blast of air clawing at my face. My heart pounded as I looked across to thank her, but the street was empty. No trace of her remained. That’s when the chill set in—she looked exactly like my grandmother, who we buried seven years ago. I still remember the floral scarf she wore... the same one we buried her in.</p>

                <button id="overlay" class="see-more-btn absolute bottom-0 right-0 bg-gradient-to-l from-white text-blue-600 cursor-pointer pl-40 text-lg">... see more</button>
            </div>
            <hr class="my-4">
              </li>

              <li>
                <div class="flex justify-between">
                  <span class="font-semibold">Sukura001</span>
                  <span>13h ago</span>
                </div>
                <div class="relative comment-container">
                <p id="text" class="comment-text line-clamp-4 text-lg transition-[max-height] duration-500 ease-in-out">I was drifting through town, lost in thought, when I stepped into the street without looking. A piercing shriek sliced through the air—an old woman, her voice cracking like dead leaves, screamed for me to stop. I froze and turned just in time to see a bus thunder past, a blast of air clawing at my face. My heart pounded as I looked across to thank her, but the street was empty. No trace of her remained. That’s when the chill set in—she looked exactly like my grandmother, who we buried seven years ago. I still remember the floral scarf she wore... the same one we buried her in.</p>

                <button id="overlay" class="see-more-btn absolute bottom-0 right-0 bg-gradient-to-l from-white text-blue-600 cursor-pointer pl-40 text-lg">... see more</button>
            </div>
            <hr class="my-4">
              </li>
            </ul>
            <button id="leave-comment-btn" class="bg-green-800 flex justify-center items-center gap-3 py-3 px-3 rounded w-fit text-white font-semibold"><span>&#128172;</span> <span>Leave a comment</span></button>
        </article>

        <article class="border border-gray-400 px-4 py-2 bg-white">
          <h4 class="mb-4 text-3xl font-semibold">Proof of fix</h4>
          <div class="bg-[url('./images/5de09a7068512cd7e5cdae70566ce4cd.jpg')] bg-cover h-72"></div>
        </article>
      </div>

        <img src="./images/nfix1.png" alt="logo" srcset="" class="w-40 mt-8 ml-4">`
    detailsSection.classList.remove('hidden')
})