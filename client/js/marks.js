document.addEventListener('DOMContentLoaded', () => {

    // --- MOCK DATA (Simulating a complete database) ---
    const mockClasses = [
        { id: 'CLS01', name: 'Grade 10A' },
        { id: 'CLS02', name: 'Grade 11B' },
    ];
    const mockSubjects = [
        { id: 'SUBJ01', name: 'Physics' },
        { id: 'SUBJ02', name: 'English Literature' },
        { id: 'SUBJ03', name: 'Algebra II' },
    ];
    const mockStudents = [
        { id: 'STU-2024-001', firstName: 'John', lastName: 'Doe', classId: 'CLS01' },
        { id: 'STU-2024-003', firstName: 'Peter', lastName: 'Jones', classId: 'CLS01' },
        { id: 'STU-2024-002', firstName: 'Jane', lastName: 'Smith', classId: 'CLS02' },
        { id: 'STU-2024-005', firstName: 'David', lastName: 'Brown', classId: 'CLS02' },
    ];
    // Assignments link classes to subjects (from academics page)
    const mockAssignments = [
        { classId: 'CLS01', subjectId: 'SUBJ01' },
        { classId: 'CLS01', subjectId: 'SUBJ03' },
        { classId: 'CLS02', subjectId: 'SUBJ02' },
    ];
    // This is where our entered marks will be stored
    let mockMarks = [];

    // --- DOM ELEMENT REFERENCES ---
    const classSelect = document.getElementById('select-class');
    const subjectSelect = document.getElementById('select-subject');
    const examSelect = document.getElementById('select-exam');
    const loadStudentsBtn = document.getElementById('load-students-btn');
    const marksForm = document.getElementById('marks-form');
    const marksTableBody = document.getElementById('marks-table-body');
    const performanceOverview = document.getElementById('performance-overview');

    // --- INITIALIZATION ---
    function initializePage() {
        // Populate class dropdown
        mockClasses.forEach(cls => {
            const option = new Option(cls.name, cls.id);
            classSelect.add(option);
        });
    }

    // --- DYNAMIC UI UPDATES ---
    classSelect.addEventListener('change', () => {
        const selectedClassId = classSelect.value;
        subjectSelect.innerHTML = '<option value="">-- Select a Subject --</option>'; // Reset
        subjectSelect.disabled = true;
        marksForm.classList.add('hidden');
        performanceOverview.classList.add('hidden');

        if (selectedClassId) {
            // Find subjects assigned to this class
            const assignedSubjects = mockAssignments
                .filter(a => a.classId === selectedClassId)
                .map(a => mockSubjects.find(s => s.id === a.subjectId));

            if (assignedSubjects.length > 0) {
                assignedSubjects.forEach(sub => {
                    if (sub) {
                        const option = new Option(sub.name, sub.id);
                        subjectSelect.add(option);
                    }
                });
                subjectSelect.disabled = false;
            }
        }
    });

    // --- CORE FUNCTIONALITY ---
    loadStudentsBtn.addEventListener('click', () => {
        const classId = classSelect.value;
        const subjectId = subjectSelect.value;
        const examType = examSelect.value;

        if (!classId || !subjectId || !examType) {
            alert('Please select a class, subject, and exam type.');
            return;
        }

        // Filter students for the selected class
        const studentsInClass = mockStudents.filter(s => s.classId === classId);
        renderMarksTable(studentsInClass, subjectId, examType);
        updatePerformanceView(subjectId, examType);
        marksForm.classList.remove('hidden');
    });

    function renderMarksTable(students, subjectId, examType) {
        marksTableBody.innerHTML = '';
        if (students.length === 0) {
            marksTableBody.innerHTML = '<tr><td colspan="3">No students found in this class.</td></tr>';
            return;
        }

        students.forEach(student => {
            // Check for existing mark
            const existingMark = mockMarks.find(m => 
                m.studentId === student.id &&
                m.subjectId === subjectId &&
                m.examType === examType
            );

            const row = document.createElement('tr');
            row.dataset.studentId = student.id;
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>
                    <input type="number" class="mark-input" min="0" max="100" value="${existingMark ? existingMark.score : ''}" placeholder="Enter mark">
                </td>
            `;
            marksTableBody.appendChild(row);
        });
    }

    marksForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const subjectId = subjectSelect.value;
        const examType = examSelect.value;
        const rows = marksTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const studentId = row.dataset.studentId;
            const scoreInput = row.querySelector('.mark-input');
            const score = scoreInput.value ? parseInt(scoreInput.value, 10) : null;

            if (studentId && score !== null && !isNaN(score)) {
                // Find if a mark already exists to update it, otherwise create new
                const existingMarkIndex = mockMarks.findIndex(m =>
                    m.studentId === studentId &&
                    m.subjectId === subjectId &&
                    m.examType === examType
                );

                if (existingMarkIndex > -1) {
                    mockMarks[existingMarkIndex].score = score; // Update
                } else {
                    mockMarks.push({ studentId, subjectId, examType, score }); // Add new
                }
            }
        });
        
        alert('Marks saved successfully!');
        updatePerformanceView(subjectId, examType);
    });

    function updatePerformanceView(subjectId, examType) {
        const relevantMarks = mockMarks
            .filter(m => m.subjectId === subjectId && m.examType === examType)
            .map(m => m.score);
        
        if (relevantMarks.length === 0) {
            performanceOverview.classList.add('hidden');
            return;
        }

        const totalScore = relevantMarks.reduce((sum, score) => sum + score, 0);
        const average = totalScore / relevantMarks.length;
        const highest = Math.max(...relevantMarks);
        const lowest = Math.min(...relevantMarks);

        document.getElementById('avg-score').textContent = average.toFixed(1);
        document.getElementById('high-score').textContent = highest;
        document.getElementById('low-score').textContent = lowest;

        performanceOverview.classList.remove('hidden');
    }

    // --- START THE PAGE ---
    initializePage();
});