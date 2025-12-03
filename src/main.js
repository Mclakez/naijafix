const addBtn = document.getElementById("add-btn")
const menuBtn = document.getElementById("menu-btn")
const menu = document.getElementById("menu")
const closeBtn = document.getElementById("close-btn")
const reportSection = document.getElementById("report-section")
const overlay = document.getElementById("overlay")
const text = document.getElementById("text")
let expanded = false
const uploadBox = document.getElementById('uploadBox')
const imageInput = document.getElementById('imageInput')
const previewImage = document.getElementById('previewImage')
const uploadIcon = document.getElementById('uploadIcon')
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

document.addEventListener("click", (e) => {
    let backBtn = e.target.closest(".back-btn")
    if(!backBtn) return

    let section = backBtn.closest("section")
    section.classList.add("hidden")
    if (section.id === "comment-section") {
        detailsSection.classList.remove("overflow-y-hidden");
        return
    }

    document.body.classList.remove("overflow-y-hidden")
})
