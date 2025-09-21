document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader-overlay');
    const mainContent = document.querySelector('.main-content');

    // --- MOCK DATA (This will be replaced by API calls) ---
    const mockData = {
        summary: {
            totalStudents: 1250,
            totalTeachers: 78,
            totalSubjects: 45,
            totalClasses: 32,
        },
        genderDistribution: {
            labels: ['Boys', 'Girls'],
            data: [680, 570], // Corresponds to total students
        },
        classDistribution: {
            labels: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
            data: [180, 195, 205, 170, 165, 185, 150],
        }
    };

    // --- FUNCTION TO SIMULATE FETCHING DATA ---
    function fetchDashboardData() {
        // Show loader
        loader.style.display = 'flex';
        mainContent.style.opacity = '0'; // Hide content while loading

        // Simulate a network request delay (e.g., 1.5 seconds)
        setTimeout(() => {
            populateDashboard(mockData);
            
            // Hide loader and fade in content
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                mainContent.style.opacity = '1';
            }, 500); // Match this with CSS transition time

        }, 1500);
    }

    // --- FUNCTION TO POPULATE THE DASHBOARD WITH DATA ---
    function populateDashboard(data) {
        // 1. Update Summary Tiles with animation
        animateCountUp('total-students-value', data.summary.totalStudents);
        animateCountUp('total-teachers-value', data.summary.totalTeachers);
        animateCountUp('total-subjects-value', data.summary.totalSubjects);
        animateCountUp('total-classes-value', data.summary.totalClasses);

        // 2. Create Charts
        createGenderChart(data.genderDistribution);
        createClassDistributionChart(data.classDistribution);
    }
    
    // --- UTILITY FUNCTION FOR NUMBER COUNT-UP ANIMATION ---
    function animateCountUp(elementId, finalValue) {
        const element = document.getElementById(elementId);
        let startValue = 0;
        const duration = 1500; // Animation duration in ms
        const increment = finalValue / (duration / 16); // 16ms for ~60fps

        const counter = setInterval(() => {
            startValue += increment;
            if (startValue >= finalValue) {
                element.innerText = finalValue.toLocaleString(); // Format with commas
                clearInterval(counter);
            } else {
                element.innerText = Math.ceil(startValue).toLocaleString();
            }
        }, 16);
    }
    
    // --- CHART CREATION FUNCTIONS ---
    function createGenderChart(genderData) {
        const ctx = document.getElementById('gender-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: genderData.labels,
                datasets: [{
                    label: 'Gender Distribution',
                    data: genderData.data,
                    backgroundColor: [
                        '#4a90e2', // Blue for Boys
                        '#f5a623'  // Orange for Girls
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,  // <- changed
                aspectRatio: 1.8,           // <- optional: control width/height ratio
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    function createClassDistributionChart(classData) {
        const ctx = document.getElementById('class-distribution-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: classData.labels,
                datasets: [{
                    label: 'Number of Students',
                    data: classData.data,
                    backgroundColor: 'rgba(74, 144, 226, 0.6)',
                    borderColor: '#4a90e2',
                    borderWidth: 2,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#ecf0f1'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // --- INITIALIZE THE DASHBOARD ---
    fetchDashboardData();
});