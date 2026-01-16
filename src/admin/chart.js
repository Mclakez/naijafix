import { fetchWithAuth } from '../login.js'
const pendingText = document.querySelector('.pending-report')
const acknowledgedText = document.querySelector('.acknowledged-report')
const inProgressText = document.querySelector('.in-progress-report')
const resolvedText = document.querySelector('.resolved-report')

const token = localStorage.getItem('token')
const monthlyStats = {
            pending: Array(12).fill(0),
            acknowledged: Array(12).fill(0),
            "in-progress": Array(12).fill(0),
            resolved: Array(12).fill(0)
        }
 


document.addEventListener('DOMContentLoaded', async () => {
   await getMonthlyStats()
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
        datasets: [
          {
            data: [
              monthlyStats.pending.reduce((a, b) => a + b, 0),
              monthlyStats.acknowledged.reduce((a, b) => a + b, 0),
              monthlyStats["in-progress"].reduce((a, b) => a + b, 0),
              monthlyStats.resolved.reduce((a, b) => a + b, 0)
            ],
            backgroundColor: [
              'yellow',
              'blue',
              'red',
              'green'

            ],
            borderWidth: 0
          }
        ]
      },

      options: {
        cutout: '60%',
        plugins: {
          legend: {
            display:false,
            postion: 'bottom'
          }
        }
      }
    })

 }

// async function getLineChart() {
    
//     const canvas = document.getElementById('multiLineChart')
//     const ctx = canvas.getContext('2d');
    
//     new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // X-axis
//     datasets: [
//       {
//         label: 'Pending',
//         data: monthlyStats.pending,
//         borderColor: 'yellow',
//         backgroundColor: 'rgba(0,0,255,0.1)',
//         tension: 0
//       },
//       {
//         label: 'Acknowledged',
//         data: monthlyStats.acknowledged,
//         borderColor: 'blue',
//         backgroundColor: 'rgba(0,255,0,0.1)',
//         tension: 0
//       },
//       {
//         label: 'In-progress',
//         data: monthlyStats["in-progress"],
//         borderColor: 'red',
//         backgroundColor: 'rgba(0,255,0,0.1)',
//         tension: 0
//       },
//       {
//         label: 'Resolved',
//         data: monthlyStats.resolved,
//         borderColor: 'green',
//         backgroundColor: 'rgba(0,255,0,0.1)',
//         tension: 0
//       }
//     ]
//   },
//   options: {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//     //   title: {
//     //     display: true,
//     //     text: 'NaijaFix Dashboard - Issues Overview',
//     //     font: { size: 18 }
//     //   },
//       legend: {
//         position: 'top',
//         display: false
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Number of Issues'
//         }
//       },
//       x: {
//         title: {
//           display: true,
//           text: 'Month'
//         }
//       }
//     }
//   }
// });
// }

async function getLineChart() {
    const canvas = document.getElementById('multiLineChart')
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    label: 'Pending',
                    data: monthlyStats.pending,
                    borderColor: '#facc15', // Yellow
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4, // Smooth curves like in the image
                    pointRadius: 0, // Hide dots
                    pointHoverRadius: 4 // Show dots on hover
                },
                {
                    label: 'Acknowledged',
                    data: monthlyStats.acknowledged,
                    borderColor: '#3b82f6', // Blue
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                {
                    label: 'In-progress',
                    data: monthlyStats["in-progress"],
                    borderColor: '#f97316', // Orange
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                {
                    label: 'Resolved',
                    data: monthlyStats.resolved,
                    borderColor: '#14b8a6', // Teal/Cyan
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide legend since you have the cards above
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e7eb', // Light gray grid lines
                        drawBorder: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280', // Gray text
                        font: {
                            size: 12
                        },
                        stepSize: 5 // Increments of 5
                    }
                },
                x: {
                    grid: {
                        display: false // Hide vertical grid lines
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}


async function getMonthlyStats() {
    try {
      
        const res = await fetchWithAuth('/api/issues')
        

        if (!res.ok) throw new Error('Error with all issues')
        const issues = await res.json()
        pendingText.textContent = issues.filter(issue => issue.status === 'Pending').length
        acknowledgedText.textContent = issues.filter(issue => issue.status === 'Acknowledged').length
        inProgressText.textContent = issues.filter(issue => issue.status === 'In-progress').length
        resolvedText.textContent = issues.filter(issue => issue.status === 'Resolved').length
        
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


