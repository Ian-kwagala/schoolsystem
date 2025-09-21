document.addEventListener('DOMContentLoaded', () => {

    // --- MOCK DATA (to be replaced by API calls) ---
    const mockStudents = [
        { id: 'STU-2024-001', firstName: 'John', lastName: 'Doe', class: 'Grade 10', gender: 'Male', dob: '2008-05-15' },
        { id: 'STU-2024-002', firstName: 'Jane', lastName: 'Smith', class: 'Grade 11', gender: 'Female', dob: '2007-09-22' },
        { id: 'STU-2024-003', firstName: 'Peter', lastName: 'Jones', class: 'Grade 10', gender: 'Male', dob: '2008-02-10' },
        { id: 'STU-2024-004', firstName: 'Mary', lastName: 'Williams', class: 'Grade 12', gender: 'Female', dob: '2006-11-30' },
        { id: 'STU-2024-005', firstName: 'David', lastName: 'Brown', class: 'Grade 9', gender: 'Male', dob: '2009-07-18' },
    ];

    // --- DOM ELEMENT REFERENCES ---
    const studentTableBody = document.getElementById('student-table-body');
    const addStudentBtn = document.getElementById('add-student-btn');
    const modal = document.getElementById('student-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const studentForm = document.getElementById('student-form');
    const modalTitle = document.getElementById('modal-title');
    const searchInput = document.getElementById('search-input');

    // --- UTILITY: Number count-up animation ---
    function animateCountUp(elementId, finalValue) {
        const element = document.getElementById(elementId);
        let startValue = 0;
        const duration = 1000;
        const increment = finalValue / (duration / 16);

        const counter = setInterval(() => {
            startValue += increment;
            if (startValue >= finalValue) {
                element.innerText = finalValue.toLocaleString();
                clearInterval(counter);
            } else {
                element.innerText = Math.ceil(startValue).toLocaleString();
            }
        }, 16);
    }

    // --- MAIN FUNCTIONS ---

    // Function to render the student table
    function renderTable(students) {
        studentTableBody.innerHTML = ''; // Clear existing rows
        if (students.length === 0) {
            studentTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No students found.</td></tr>';
            return;
        }

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>${student.class}</td>
                <td>${student.gender}</td>
                <td>${student.dob}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${student.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${student.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            studentTableBody.appendChild(row);
        });
    }

    // Function to update summary cards
    function updateSummary(students) {
        const total = students.length;
        const boys = students.filter(s => s.gender === 'Male').length;
        const girls = total - boys;

        animateCountUp('total-students', total);
        animateCountUp('total-boys', boys);
        animateCountUp('total-girls', girls);
    }

    // Function to open the modal
    function openModal(student = null) {
        studentForm.reset(); // Clear form fields
        if (student) {
            // Editing existing student
            modalTitle.textContent = 'Edit Student';
            document.getElementById('student-id').value = student.id;
            document.getElementById('first-name').value = student.firstName;
            document.getElementById('last-name').value = student.lastName;
            document.getElementById('gender').value = student.gender;
            document.getElementById('dob').value = student.dob;
            document.getElementById('class').value = student.class;
        } else {
            // Adding new student
            modalTitle.textContent = 'Add New Student';
            document.getElementById('student-id').value = ''; // Ensure ID is empty
        }
        modal.style.display = 'flex';
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // --- EVENT LISTENERS ---

    // Open modal for new student
    addStudentBtn.addEventListener('click', () => openModal());

    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Handle Add/Edit form submission
    studentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const studentId = document.getElementById('student-id').value;

        const studentData = {
            id: studentId,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            gender: document.getElementById('gender').value,
            dob: document.getElementById('dob').value,
            class: document.getElementById('class').value,
        };

        if (studentId) {
            // Update existing student
            const index = mockStudents.findIndex(s => s.id === studentId);
            if (index !== -1) {
                mockStudents[index] = studentData;
            }
        } else {
            // Add new student
            // In a real app, the ID is generated by the backend. We'll simulate it here.
            studentData.id = `STU-2024-${Date.now().toString().slice(-4)}`;
            mockStudents.push(studentData);
        }

        renderTable(mockStudents);
        updateSummary(mockStudents);
        closeModal();
    });
    
    // Handle Edit and Delete clicks using event delegation
    studentTableBody.addEventListener('click', (event) => {
        const editBtn = event.target.closest('.edit-btn');
        const deleteBtn = event.target.closest('.delete-btn');

        if (editBtn) {
            const studentId = editBtn.dataset.id;
            const studentToEdit = mockStudents.find(s => s.id === studentId);
            if (studentToEdit) {
                openModal(studentToEdit);
            }
        }

        if (deleteBtn) {
            const studentId = deleteBtn.dataset.id;
            // Confirmation before deleting
            if (confirm(`Are you sure you want to delete student ${studentId}?`)) {
                const index = mockStudents.findIndex(s => s.id === studentId);
                if (index > -1) {
                    mockStudents.splice(index, 1);
                    renderTable(mockStudents);
                    updateSummary(mockStudents);
                }
            }
        }
    });

    // Handle search/filter
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredStudents = mockStudents.filter(student => 
            `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm) ||
            student.id.toLowerCase().includes(searchTerm) ||
            student.class.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredStudents);
    });


    // --- INITIAL PAGE LOAD ---
    function initializePage() {
        renderTable(mockStudents);
        updateSummary(mockStudents);
    }
    
    initializePage();
});