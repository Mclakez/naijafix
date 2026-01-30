import { loadIssues } from "./issues.js"
import { fetchWithAuth } from './login.js'

const form = document.getElementById('report-form')
const imageInput = document.getElementById('imageInput')
const successMessage = document.getElementById('message')
const previewImage = document.getElementById('previewImage')
const uploadIcon = document.getElementById('uploadIcon')


form.addEventListener('submit', async (e) => {
    e.preventDefault()

        const formData = new FormData(form)
        setButtonLoading(true);
        

    try {
        const res = await fetchWithAuth('/api/issues', {
            method: 'POST',
            body: formData
        })

        if (!res.ok) {
            console.log(res.error)
            throw new Error('Report submission failed')
        }

        const data = await res.json()
        successMessage.textContent = 'Report has been succesfully submitted'
        successMessage.style.display = 'block' 
        const myReportsBtn = document.getElementById('my-report-btn')
        if(myReportsBtn.classList.contains('bg-naija-yellow')) {
            const activeFilter = "my"
            await loadIssues(activeFilter)
        } else {
            const activeFilter = "all"
            await loadIssues(activeFilter)
        }

            previewImage.classList.add('hidden')
            uploadIcon.classList.remove('hidden')
            form.reset()
            setButtonLoading(false)
            
        setTimeout(() => {
            successMessage.style.display = 'none'
            
        }, 3000)
       
        
    } catch (error) {
        setButtonLoading(false);
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

function setButtonLoading(isLoading) {
            const btn = document.getElementById('submit-report-btn');
            const btnText = document.getElementById('report-btn-text');
            const spinner = document.getElementById('report-btn-spinner');
            
            if (isLoading) {
                btn.disabled = true;
                btn.classList.add('opacity-75', 'cursor-not-allowed');
                btnText.textContent = 'Submitting...';
                spinner.classList.remove('hidden');
            } else {
                btn.disabled = false;
                btn.classList.remove('opacity-75', 'cursor-not-allowed');
                btnText.textContent = 'Submit Report';
                spinner.classList.add('hidden');
            }
        }