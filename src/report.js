const token = localStorage.getItem("token")
const form = document.getElementById('report-form')
const imageInput = document.getElementById('imageInput')
const successMessage = document.getElementById('message')
const previewImage = document.getElementById('previewImage')
const uploadIcon = document.getElementById('uploadIcon')


form.addEventListener('submit', async (e) => {
    e.preventDefault()

        const formData = new FormData(form)
        
        

    try {
        const res = await fetch('http://localhost:3000/api/issues', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        })

        if (!res.ok) {
           
            
            throw new Error('Report submission failed')
        }

        const data = await res.json()
        console.log(data);
        successMessage.textContent = 'Report has been succesfully submitted'
        successMessage.style.display = 'block'
        setTimeout(() => {
            successMessage.style.display = 'none'
            previewImage.classList.add('hidden')
            uploadIcon.classList.remove('hidden')
            form.reset()
            
        }, 3000)
        
    } catch (error) {
        successMessage.textContent = `${error.message}`
        successMessage.classList.add('bg-red-500')
        successMessage.style.display = 'block'
        setTimeout(() => {
            successMessage.style.display = 'none'
            
        }, 5000)
    }
})




imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
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