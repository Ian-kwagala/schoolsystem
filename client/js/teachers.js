document.addEventListener('DOMContentLoaded', () => {

    // --- MOCK DATA (to be replaced by API calls) ---
    const mockStaff = [
        { id: 'TCH-2024-001', firstName: 'Albert', lastName: 'Einstein', department: 'Science', role: 'Teaching', email: 'a.einstein@school.com' },
        { id: 'TCH-2024-002', firstName: 'William', lastName: 'Shakespeare', department: 'Arts', role: 'Teaching', email: 'w.shake@school.com' },
        { id: 'TCH-2024-003', firstName: 'Marie', lastName: 'Curie', department: 'Science', role: 'Teaching', email: 'm.curie@school.com' },
        { id: 'STF-2024-004', firstName: 'Henry', lastName: 'Ford', department: 'Administration', role: 'Non-Teaching', email: 'h.ford@school.com' },
        { id: 'TCH-2024-005', firstName: 'Pythagoras', lastName: 'Samos', department: 'Mathematics', role: 'Teaching', email: 'p.samos@school.com' },
        { id: 'STF-2024-006', firstName: 'Carol', lastName: 'Danvers', department: 'Support Staff', role: 'Non-Teaching', email: 'c.danvers@school.com' },
    ];

    // --- DOM ELEMENT REFERENCES ---
    const staffTableBody = document.getElementById('staff-table-body');
    const addStaffBtn = document.getElementById('add-staff-btn');
    const modal = document.getElementById('staff-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const staffForm = document.getElementById('staff-form');
    const modalTitle = document.getElementById('modal-title');
    const searchInput = document.getElementById('search-input');

    // --- UTILITY: Number count-up animation ---
    function animateCountUp(elementId, finalValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
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

    // Function to render the staff table
    function renderTable(staffList) {
        staffTableBody.innerHTML = ''; // Clear existing rows
        if (staffList.length === 0) {
            staffTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No staff members found.</td></tr>';
            return;
        }

        staffList.forEach(staff => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${staff.id}</td>
                <td>${staff.firstName} ${staff.lastName}</td>
                <td>${staff.department}</td>
                <td><span class="role ${staff.role.toLowerCase()}">${staff.role}</span></td>
                <td>${staff.email}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${staff.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${staff.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            staffTableBody.appendChild(row);
        });
    }

    // Function to update summary cards
    function updateSummary(staffList) {
        animateCountUp('total-staff', staffList.length);
        animateCountUp('teaching-staff', staffList.filter(s => s.role === 'Teaching').length);
        animateCountUp('arts-dept', staffList.filter(s => s.department === 'Arts').length);
        animateCountUp('science-dept', staffList.filter(s => s.department === 'Science').length);
    }

    // Function to open the modal
    function openModal(staff = null) {
        staffForm.reset(); // Clear form fields
        if (staff) {
            // Editing existing staff
            modalTitle.textContent = 'Edit Staff Member';
            document.getElementById('staff-id').value = staff.id;
            document.getElementById('first-name').value = staff.firstName;
            document.getElementById('last-name').value = staff.lastName;
            document.getElementById('email').value = staff.email;
            document.getElementById('department').value = staff.department;
            document.getElementById('role').value = staff.role;
        } else {
            // Adding new staff
            modalTitle.textContent = 'Add New Staff Member';
            document.getElementById('staff-id').value = ''; // Ensure ID is empty
        }
        modal.style.display = 'flex';
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // --- EVENT LISTENERS ---

    addStaffBtn.addEventListener('click', () => openModal());

    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    staffForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const staffId = document.getElementById('staff-id').value;
        const role = document.getElementById('role').value;

        const staffData = {
            id: staffId,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            department: document.getElementById('department').value,
            role: role,
        };

        if (staffId) {
            // Update
            const index = mockStaff.findIndex(s => s.id === staffId);
            if (index !== -1) mockStaff[index] = staffData;
        } else {
            // Add new
            const idPrefix = role === 'Teaching' ? 'TCH' : 'STF';
            staffData.id = `${idPrefix}-2024-${Date.now().toString().slice(-4)}`;
            mockStaff.push(staffData);
        }

        renderTable(mockStaff);
        updateSummary(mockStaff);
        closeModal();
    });
    
    staffTableBody.addEventListener('click', (event) => {
        const editBtn = event.target.closest('.edit-btn');
        const deleteBtn = event.target.closest('.delete-btn');

        if (editBtn) {
            const staffId = editBtn.dataset.id;
            const staffToEdit = mockStaff.find(s => s.id === staffId);
            if (staffToEdit) openModal(staffToEdit);
        }

        if (deleteBtn) {
            const staffId = deleteBtn.dataset.id;
            if (confirm(`Are you sure you want to delete staff member ${staffId}?`)) {
                const index = mockStaff.findIndex(s => s.id === staffId);
                if (index > -1) {
                    mockStaff.splice(index, 1);
                    renderTable(mockStaff);
                    updateSummary(mockStaff);
                }
            }
        }
    });

    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredStaff = mockStaff.filter(staff => 
            `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm) ||
            staff.id.toLowerCase().includes(searchTerm) ||
            staff.department.toLowerCase().includes(searchTerm) ||
            staff.role.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredStaff);
    });

    // --- INITIAL PAGE LOAD ---
    function initializePage() {
        renderTable(mockStaff);
        updateSummary(mockStaff);
    }
    
    initializePage();
});