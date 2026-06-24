const token = localStorage.getItem('token')
import { fetchWithAuth } from '../login.js'
const username = localStorage.getItem('user')
const monthlyStats = {
            pending: Array(12).fill(0),
            acknowledged: Array(12).fill(0),
            "in-progress": Array(12).fill(0),
            resolved: Array(12).fill(0)
        }
 


document.addEventListener('DOMContentLoaded', async () => {
   await getMonthlyStats(username)
   await getLineChart()
   await getPieChart()
})

async function getPieChart() {
  const canvas = document.getElementById('pieChart')
  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pending', 'Acknowledged', 'In-progress', 'Resolved'],
      datasets: [{
        data: [
          monthlyStats.pending.reduce((a, b) => a + b, 0),
          monthlyStats.acknowledged.reduce((a, b) => a + b, 0),
          monthlyStats["in-progress"].reduce((a, b) => a + b, 0),
          monthlyStats.resolved.reduce((a, b) => a + b, 0)
        ],
        backgroundColor: ['#eab308', '#3b82f6', '#f97316', '#16a34a'],
        borderWidth: 0,
        hoverOffset: 8,
        spacing: 4,
        borderRadius: 6
      }]
    },
    options: {
      cutout: '70%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
            color: '#374151',
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#f9fafb',
          bodyColor: '#d1d5db',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (item) => ` ${item.label}: ${item.raw}`
          }
        }
      }
    }
  })
}


async function getLineChart() {
  const canvas = document.getElementById('multiLineChart')
  const ctx = canvas.getContext('2d');

  // Gradient fills
  const makeGradient = (color) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    return gradient
  }

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: 'Pending',
          data: monthlyStats.pending,
          borderColor: '#eab308',
          backgroundColor: makeGradient('rgba(234,179,8,0.15)'),
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#eab308'
        },
        {
          label: 'Acknowledged',
          data: monthlyStats.acknowledged,
          borderColor: '#3b82f6',
          backgroundColor: makeGradient('rgba(59,130,246,0.15)'),
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#3b82f6'
        },
        {
          label: 'In-progress',
          data: monthlyStats["in-progress"],
          borderColor: '#f97316',
          backgroundColor: makeGradient('rgba(249,115,22,0.15)'),
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#f97316'
        },
        {
          label: 'Resolved',
          data: monthlyStats.resolved,
          borderColor: '#16a34a',
          backgroundColor: makeGradient('rgba(22,163,74,0.15)'),
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#16a34a'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            color: '#374151',
            font: { size: 12 }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: '#1f2937',
          titleColor: '#f9fafb',
          bodyColor: '#d1d5db',
          padding: 12,
          cornerRadius: 8,
          usePointStyle: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f3f4f6', drawBorder: false },
          border: { display: false },
          ticks: { color: '#9ca3af', font: { size: 11 } }
        },
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#9ca3af', font: { size: 11 } }
        }
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false }
    }
  })
}




async function getMonthlyStats(username) {
    try {
      
        const res = await fetchWithAuth(`/api/issues/officer/${username}`)
        

        if (!res.ok) throw new Error('Error with all issues')
        const issues = await res.json()
        
        issues.forEach(issue => {
            let status = issue.status.toLowerCase()
            
            let date = new Date(issue.createdAt)
            let month = date.getMonth() 
            
            monthlyStats[status][month]++
           
        })
        
    } catch (error) {
        alert(error.message)
    }
}


