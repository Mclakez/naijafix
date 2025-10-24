const token = localStorage.getItem("token")
const form = document.getElementById('report-form')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

        const formData = new FormData(form)
        console.log(formData);
        

    try {
        const res = await fetch('http://localhost:3000/api/issues', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        })

        if (!res.ok) throw new Error('Report submission failed')

        const data = await res.json()
        console.log(data);
        successMessage.style.display = 'block'
        setTimeout(() => {
            successMessage.style.display = 'none'
            // Optional: Reset form
            form.reset()
        }, 3000)
        
    } catch (error) {
        alert(error.message)
    }
})

const imageInput = document.getElementById('imageInput')
const previewImage = document.getElementById('previewImage')
const uploadIcon = document.getElementById('uploadIcon')

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