const addBtn = document.getElementById("add-btn")
const menuBtn = document.getElementById("menu-btn")
const menu = document.getElementById("menu")
const closeBtn = document.getElementById("close-btn")
const reportSection = document.getElementById("report-section")
// const reportBackBtn = document.getElementById("report-back-btn")
const overlay = document.getElementById("overlay")
const text = document.getElementById("text")
let expanded = false

const uploadBox = document.getElementById('uploadBox')
const imageInput = document.getElementById('imageInput')
const previewImage = document.getElementById('previewImage')
const uploadIcon = document.getElementById('uploadIcon')

const detailsBtns = document.querySelectorAll('.details-btn')
const detailsSection = document.getElementById('details-section')
const commentSection = document.getElementById('comment-section')

uploadBox.addEventListener("click", () => {
    imageInput.click()
})

imageInput.addEventListener("change", function() {
    const file = this.files[0]
    if(file) {
        const reader = new FileReader()
        reader.onload = function(e) {
            previewImage.src = e.target.result
            previewImage.classList.remove("hidden")
            uploadIcon.classList.add("hidden")
        }

        reader.readAsDataURL(file)
    }
})

addBtn.addEventListener("click", () => {
    if(reportSection.classList.contains('hidden')) {
        reportSection.classList.remove("hidden")
        document.body.classList.add("overflow-y-hidden")
    }
    
})

menuBtn.addEventListener("click", () => {
    menu.classList.remove('hidden')
})

closeBtn.addEventListener("click", () => {
    menu.classList.add('hidden')
})

// reportBackBtn.addEventListener("click", () => {
//     reportSection.classList.add("hidden")
//     document.body.classList.remove("overflow-y-hidden")
// })



// overlay.addEventListener("click", () => {
//     expanded = !expanded

//     if (expanded) {
//         text.classList.remove('line-clamp-8')
//         overlay.textContent = "... see less"
//         overlay.classList.remove('bg-gradient-to-l', 'from-white', 'pl-8')
//     } else{
//         text.classList.add('line-clamp-8')
//         overlay.textContent = "... see more"
//         overlay.classList.add('bg-gradient-to-l', 'from-white', 'pl-8')
//     }
// })

// document.querySelector(".comment-container").addEventListener("click", (e) => {
//   if (!e.target.classList.contains("see-more-btn")) return;

//   const button = e.target;
  
//   const commentContainer = button.closest(".comment-container");
//   const comment = commentContainer.querySelector(".comment-text")
  
//   const expanded = comment.classList.toggle("expanded");

// //   button.setAttribute("aria-expanded", expanded ? "true" : "false");
//   button.textContent = expanded ? "see less" : "see more";
// });

detailsBtns.forEach(detailsBtn => {
    detailsBtn.addEventListener("click", () => {
        detailsSection.classList.remove("hidden")
        console.log('details-btn');
        
    })
})

document.addEventListener("click", (e) => {
    let backBtn = e.target.closest(".back-btn")
    if(!backBtn) return

    let section = backBtn.closest("section")
    section.classList.add("hidden")
})

// document.getElementById("leave-comment-btn").addEventListener("click", () => {
//     commentSection.classList.remove("hidden")
// })