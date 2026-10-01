
let state = {
    students: [
        { id: 1, name: 'AAAAA', score: 9, class: '01-B' },
        { id: 2, name: 'BBBBBB', score: 10, class: '02-B' },
        { id: 3, name: 'CCCCCC', score: 8, class: '01-B' }
    ],
    filterType: 'ALL' };
const StudentItem = ({ id, name, score, class: studentClass }) => 
    <tr>
        <td style="padding: 8px;">${id}</td>
        <td style="padding: 8px;">${name}</td>
        <td style="padding: 8px;">${score}</td>
        <td style="padding: 8px;">${studentClass}</td>
        <td style="padding: 8px;">
            <button onclick="handleDelete(${id})">Xóa</button>
        </td>
    </tr>
;
const StudentList = (students) => 
    <table border="1" style="border-collapse: collapse; width: 100%; margin-top: 20px;">
        <thead>
            <tr>
                <th style="padding: 8px;">ID</th>
                <th style="padding: 8px;">Họ tên</th>
                <th style="padding: 8px;">Điểm số</th>
                <th style="padding: 8px;">Lớp</th>
                <th style="padding: 8px;">Hành động</th>
            </tr>
        </thead>
        <tbody>
            ${students.map(student => StudentItem(student)).join('')}
        </tbody>
    </table>
;
const App = () => {
    let displayStudents = state.students;
    if (state.filterType === 'EXCELLENT') {
        displayStudents = state.students.filter(s => s.score >= 8);
    } else if (state.filterType === 'FAIL') {
        displayStudents = state.students.filter(s => s.score < 5);
        const totalStudents = displayStudents.length;
        const averageScore = totalStudents > 0
            ? (displayStudents.reduce((acc, curr) => acc + curr.score, 0) / totalStudents).toFixed(2)
            : 0;

        return
        <div style="font-family: Arial; padding: 20px;">
            <h2>Quản Lý Điểm Sinh Viên</h2>
            <form onsubmit="handleAdd(event)" style="margin-bottom: 20px;">
                <input type="text" id="inputName" placeholder="Họ tên" required style="margin-right: 5px;" />
                <input type="number" id="inputScore" placeholder="Điểm số" required style="margin-right: 5px;" />
                <input type="text" id="inputClass" placeholder="Lớp" required style="margin-right: 5px;" />
                <button type="submit">Thêm sinh viên</button>
            </form>
            <div style="margin-bottom: 20px;">
                <button onclick="setFilter('ALL')">Tất cả</button>
                <button onclick="setFilter('EXCELLENT')">Sinh viên Giỏi ( >= 8)</button>
                <button onclick="setFilter('FAIL')">Sinh viên Trượt (&lt; 5)</button>
            </div>
            <div style="font-weight: bold;">
                <p>Tổng số lượng: ${totalStudents}</p>
                <p>Điểm trung bình: ${averageScore}</p>
            </div>

            ${StudentList(displayStudents)}
        </div>
            ;
    };
    const render = () => {
        const root = document.getElementById('root');
        if (root) {
            root.innerHTML = App();
        }
    };
    window.handleAdd = (event) => {
        event.preventDefault();

        const name = document.getElementById('inputName').value;
        const score = Number(document.getElementById('inputScore').value);
        const studentClass = document.getElementById('inputClass').value;
        if (score < 0 || score > 10) {
            alert('Điểm số không hợp lệ! Vui lòng nhập từ 0 đến 10.');
            return;
        }

        const newStudent = { id: Date.now(), name, score, class: studentClass };
        state.students = [...state.students, newStudent];
        render();
    };

    window.handleDelete = (id) => {
        state.students = state.students.filter(student => student.id !== id);
        render();
    };
    window.setFilter = (type) => {
        state.filterType = type;
        render();
    };
    document.addEventListener('DOMContentLoaded', render);
}