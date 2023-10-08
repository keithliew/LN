// Define the items variable
const items = document.querySelectorAll('#learningPlan li');

// Define totalHours based on the items
const totalHours = Array.from(items).reduce((sum, item) => sum + parseFloat(item.getAttribute('data-time')), 0);

let completedHours = 0;

// Initialize the Burndown chart
let daysPassed = 0;
const totalDays = 224;

const remainingHoursData = [totalHours];
for (let i = 1; i <= totalDays; i++) {
    remainingHoursData.push(totalHours - (totalHours / totalDays) * i);
}

const ctx = document.getElementById('burndownChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array.from({ length: totalDays + 1 }, (_, i) => i),
        datasets: [{
            label: 'Ideal Progress',
            data: remainingHoursData,
            borderColor: 'rgb(75, 192, 192)',
            fill: false
        }, {
            label: 'Actual Progress',
            data: Array.from({ length: daysPassed }, () => null).concat([totalHours - completedHours]),
            borderColor: 'rgb(255, 99, 132)',
            fill: false
        }]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Days'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Hours Remaining'
                }
            }
        }
    }
});

// Event listener for marking list items as completed
document.getElementById('learningPlan').addEventListener('click', function(e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('completed');
        if (e.target.classList.contains('completed')) {
            completedHours += parseFloat(e.target.getAttribute('data-time'));
        } else {
            completedHours -= parseFloat(e.target.getAttribute('data-time'));
        }
        updateProgress();
    }
});

function updateProgress() {
    const progressBarInner = document.getElementById('progressBarInner');
    const progressStatus = document.getElementById('progressStatus');

    const percentage = (completedHours / totalHours) * 100;
    progressBarInner.style.width = `${percentage}%`;
    const estimatedTimeLeft = totalHours - completedHours;
    progressStatus.textContent = `Completion: ${percentage.toFixed(2)}% | Estimated time left: ${estimatedTimeLeft} hours`;
}

// Initialize progress on page load
updateProgress();
