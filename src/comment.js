const token = localStorage.getItem("token")
const form = document.getElementById('comment-form')
const commentPopUp = document.getElementById('comment-popup')
const commentSection = document.getElementById('comment-section')
let issueID;
const detailsSection = document.getElementById('details-section')

document.addEventListener('click', async (e) => {
  let leaveCommentBtn = e.target.closest('.leave-comment-btn')
  if(!leaveCommentBtn) return
  const id = leaveCommentBtn.getAttribute("data-id")
    console.log('Fetching details for ID:', id)
    issueID = id
  commentSection.classList.remove('hidden')
  detailsSection.classList.add("overflow-y-hidden")
  document.body.classList.add("overflow-y-hidden")
  
})

document.addEventListener('click', async (e) => {
  let seeMoreBtn = e.target.closest('.see-more-btn')
  if(!seeMoreBtn) return
  const commentContainer = seeMoreBtn.closest(".comment-container");
  const comment = commentContainer.querySelector(".comment-text")
  
  const expanded = comment.classList.toggle("expanded");

//   button.setAttribute("aria-expanded", expanded ? "true" : "false");
  seeMoreBtn.textContent = expanded ? "see less" : "see more";
})

  


form.addEventListener('submit', async (e) => {
    e.preventDefault()

        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())

    try {
        const res = await fetch(`http://localhost:3000/api/issues/${issueID}/comment`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        })

        if (!res.ok) {
           
            
            throw new Error('Comment submission failed')
        }

        const data = await res.json()
       commentPopUp.textContent = 'Comment has been succesfully submitted'
        commentPopUp.style.display = 'block'
        setTimeout(() => {
            commentPopUp.style.display = 'none'
            form.reset()
            
        }, 3000)
        
    } catch (error) {
        commentPopUp.textContent = `${error.message}`
        commentPopUp.classList.add('bg-red-500')
        commentPopUp.style.display = 'block'
        setTimeout(() => {
            commentPopUp.style.display = 'none'
            
        }, 5000)
    }
})
