import { fetchWithAuth } from './login.js'
const token = localStorage.getItem("token")
const form = document.getElementById('comment-form')
const commentPopUp = document.getElementById('comment-popup')
const commentSection = document.getElementById('comment-section')
let issueID;
const detailsSection = document.getElementById('details-section')
import { getIssueDetails } from "./issues.js";

document.addEventListener('click', async (e) => {
  let leaveCommentBtn = e.target.closest('.leave-comment-btn')
  if(!leaveCommentBtn) return
  const id = leaveCommentBtn.getAttribute("data-id")
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
        let comment = document.querySelector('#comment').value.trim()
        if(comment === '') {
            commentPopUp.textContent = 'Comment cannot be empty' 
            commentPopUp.classList.add('bg-red-500')
        commentPopUp.style.display = 'block'
        setTimeout(() => {
            commentPopUp.style.display = 'none'
            
        }, 5000)
        return
          }
        // const data = Object.fromEntries(formData.entries())
        setButtonLoading(true);

    try {
        const res = await fetchWithAuth(`/api/issues/${issueID}/comment`, {
            method: 'POST',
            body: formData
        })

        if (!res.ok) {
           
            
            throw new Error('Comment submission failed')
        }

        const data = await res.json()
       commentPopUp.textContent = 'Comment has been succesfully submitted'
        commentPopUp.style.display = 'block'
        getIssueDetails(issueID)
        setTimeout(() => {
            commentPopUp.style.display = 'none'
            form.reset()
            setButtonLoading(false)
        }, 3000)
        
    } catch (error) {
       setButtonLoading(false);
        commentPopUp.textContent = `${error.message}`
        commentPopUp.classList.add('bg-red-500')
        commentPopUp.style.display = 'block'
        setTimeout(() => {
            commentPopUp.style.display = 'none'
            
        }, 5000)
    }
})


function setButtonLoading(isLoading) {
            const btn = document.getElementById('submit-comment-btn');
            const btnText = document.getElementById('comment-btn-text');
            const spinner = document.getElementById('comment-btn-spinner');
            
            if (isLoading) {
                btn.disabled = true;
                btn.classList.add('opacity-75', 'cursor-not-allowed');
                btnText.textContent = 'Commenting...';
                spinner.classList.remove('hidden');
            } else {
                btn.disabled = false;
                btn.classList.remove('opacity-75', 'cursor-not-allowed');
                btnText.textContent = 'Submit Comment';
                spinner.classList.add('hidden');
            }
        }