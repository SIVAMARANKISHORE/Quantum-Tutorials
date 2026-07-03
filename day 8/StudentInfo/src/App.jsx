import { useState } from 'react'
import './App.css'

const initialForm = {
  name: '',
  id: '',
  department: '',
  status: 'Present',
}

function App() {
  const [formData, setFormData] = useState(initialForm)
  const [students, setStudents] = useState([])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.name.trim() || !formData.id.trim() || !formData.department.trim()) {
      return
    }

    const newStudent = {
      id: formData.id.trim(),
      name: formData.name.trim(),
      department: formData.department.trim(),
      status: formData.status,
    }

    setStudents((prev) => [newStudent, ...prev])
    setFormData(initialForm)
  }

  const presentCount = students.filter((student) => student.status === 'Present').length
  const absentCount = students.filter((student) => student.status === 'Absent').length

  return (
    <div className="app-shell">
      <div className="app">
        <header className="app-header">
          <div>
            <p className="eyebrow">Academic Dashboard</p>
            <h1>Student Management System</h1>
            <p className="subtitle">Capture student information and attendance efficiently in a modern interface.</p>
          </div>
          <div className="summary-card">
            <div>
              <strong>{students.length}</strong>
              <span>Total Students</span>
            </div>
            <div>
              <strong>{presentCount}</strong>
              <span>Present</span>
            </div>
            <div>
              <strong>{absentCount}</strong>
              <span>Absent</span>
            </div>
          </div>
        </header>

        <div className="content-grid">
          <form className="student-form" onSubmit={handleSubmit}>
            <h2>Add New Student</h2>
            <label>
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </label>

            <label>
              <span>Student ID</span>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Enter student ID"
                required
              />
            </label>

            <label>
              <span>Department</span>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department"
                required
              />
            </label>

            <label>
              <span>Status</span>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </label>

            <button type="submit">Add Student</button>
          </form>

          <section className="student-list">
            <div className="list-header">
              <h2>Attendance Record</h2>
              <p>Latest entries appear first</p>
            </div>
            {students.length === 0 ? (
              <div className="empty-state">No students added yet.</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>ID</th>
                      <th>Department</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.id}</td>
                        <td>{student.department}</td>
                        <td>
                          <span className={`status ${student.status.toLowerCase()}`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
