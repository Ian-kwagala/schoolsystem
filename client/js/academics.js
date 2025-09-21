document.addEventListener('DOMContentLoaded', () => {

    // --- MOCK DATA ---
    // In a real application, these would be separate API calls.
    let mockSubjects = [
        { id: 'SUBJ01', name: 'Physics', code: 'PHY101', department: 'Science' },
        { id: 'SUBJ02', name: 'English Literature', code: 'ENG201', department: 'Arts' },
        { id: 'SUBJ03', name: 'Algebra II', code: 'MTH301', department: 'Mathematics' },
    ];
    let mockClasses = [
        { id: 'CLS01', name: 'Grade 10A' },
        { id: 'CLS02', name: 'Grade 11B' },
        { id: 'CLS03', name: 'Grade 12A' },
    ];
    // We need teacher data for assignments
    const mockTeachers = [
        { id: 'TCH-2024-001', firstName: 'Albert', lastName: 'Einstein' },
        { id: 'TCH-2024-002', firstName: 'William', lastName: 'Shakespeare' },
        { id: 'TCH-2024-003', firstName: 'Marie', lastName: 'Curie' },
    ];
    // This links everything together
    let mockAssignments = [
        { assignmentId: 'ASN01', classId: 'CLS01', subjectId: 'SUBJ01', teacherId: 'TCH-2024-001' },
        { assignmentId: 'ASN02', classId: 'CLS01', subjectId: 'SUBJ03', teacherId: 'TCH-2024-003' },
        { assignmentId: 'ASN03', classId: 'CLS02', subjectId: 'SUBJ02', teacherId: 'TCH-2024-002' },
    ];

    // --- DOM ELEMENT REFERENCES ---
    const subjectsTableBody = document.getElementById('subjects-table-body');
    const classesTableBody = document.getElementById('classes-table-body');
    const assignmentsTableBody = document.getElementById('assignments-table-body');
    const classFilterSelect = document.getElementById('class-filter');
    
    // --- RENDER FUNCTIONS ---
    function renderSubjects() {
        subjectsTableBody.innerHTML = mockSubjects.map(subject => `
            <tr>
                <td>${subject.name}</td>
                <td>${subject.code}</td>
                <td>${subject.department}</td>
                <td>
                    <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    function renderClasses() {
        classesTableBody.innerHTML = mockClasses.map(cls => `
            <tr>
                <td>${cls.name}</td>
                <td>
                    <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    function populateClassFilter() {
        classFilterSelect.innerHTML = mockClasses.map(cls => 
            `<option value="${cls.id}">${cls.name}</option>`
        ).join('');
        // Trigger change to load initial data
        if (mockClasses.length > 0) {
            classFilterSelect.dispatchEvent(new Event('change'));
        }
    }

    function renderAssignments() {
        const selectedClassId = classFilterSelect.value;
        if (!selectedClassId) {
            assignmentsTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Select a class to see assignments.</td></tr>';
            return;
        }

        const filteredAssignments = mockAssignments.filter(a => a.classId === selectedClassId);
        
        if (filteredAssignments.length === 0) {
            assignmentsTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No subjects assigned to this class.</td></tr>';
            return;
        }

        assignmentsTableBody.innerHTML = filteredAssignments.map(asn => {
            const subject = mockSubjects.find(s => s.id === asn.subjectId);
            const teacher = mockTeachers.find(t => t.id === asn.teacherId);
            return `
                <tr>
                    <td>${subject ? subject.name : 'N/A'}</td>
                    <td>${teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A'}</td>
                    <td>
                        <button class="action-btn delete-btn" data-id="${asn.assignmentId}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // --- EVENT LISTENERS ---
    classFilterSelect.addEventListener('change', renderAssignments);

    // Placeholder listeners for modals (to be implemented)
    document.getElementById('add-subject-btn').addEventListener('click', () => {
        // Logic to open Add Subject modal
        alert('Opening Add Subject modal...');
    });

    document.getElementById('add-class-btn').addEventListener('click', () => {
        // Logic to open Add Class modal
        alert('Opening Add Class modal...');
    });

    document.getElementById('assign-subject-btn').addEventListener('click', () => {
        // Logic to open Assign Subject modal
        const selectedClass = mockClasses.find(c => c.id === classFilterSelect.value);
        if (selectedClass) {
            alert(`Opening modal to assign subject to ${selectedClass.name}...`);
        } else {
            alert('Please select a class first.');
        }
    });

    // Event delegation for delete buttons in assignments table
    assignmentsTableBody.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('.delete-btn');
        if (deleteBtn) {
            const assignmentId = deleteBtn.dataset.id;
            if (confirm('Are you sure you want to unassign this subject?')) {
                mockAssignments = mockAssignments.filter(a => a.assignmentId !== assignmentId);
                renderAssignments(); // Re-render the table
            }
        }
    });

    // --- INITIALIZATION ---
    function initializePage() {
        renderSubjects();
        renderClasses();
        populateClassFilter();
    }

    initializePage();
});