import { useMemo, useState } from 'react'
import './App.css'

const students = [
  {
    id: 'stu-101',
    name: 'Ananya Sharma',
    roll: '101',
    className: 'BCA 2A',
    advisor: 'Dr. Menon',
    parent: 'R. Sharma',
  },
  {
    id: 'stu-102',
    name: 'Rahul Verma',
    roll: '102',
    className: 'BCA 2A',
    advisor: 'Dr. Menon',
    parent: 'S. Verma',
  },
  {
    id: 'stu-103',
    name: 'Meera Nair',
    roll: '103',
    className: 'BCA 2A',
    advisor: 'Dr. Menon',
    parent: 'K. Nair',
  },
  {
    id: 'stu-201',
    name: 'Aarav Iyer',
    roll: '201',
    className: 'B.Tech 3B',
    advisor: 'Prof. Khan',
    parent: 'P. Iyer',
  },
  {
    id: 'stu-202',
    name: 'Sana Khan',
    roll: '202',
    className: 'B.Tech 3B',
    advisor: 'Prof. Khan',
    parent: 'A. Khan',
  },
  {
    id: 'stu-301',
    name: 'Kabir Das',
    roll: '301',
    className: 'MCA 1A',
    advisor: 'Dr. Rao',
    parent: 'M. Das',
  },
  {
    id: 'stu-302',
    name: 'Isha Patel',
    roll: '302',
    className: 'MCA 1A',
    advisor: 'Dr. Rao',
    parent: 'N. Patel',
  },
]

const statuses = ['Present', 'Late', 'Absent', 'Excused']
const classes = ['All Classes', ...new Set(students.map((student) => student.className))]
const today = new Date().toISOString().slice(0, 10)

const starterAttendance = students.reduce((records, student, index) => {
  records[student.id] = index === 2 ? 'Late' : index === 4 ? 'Absent' : 'Present'
  return records
}, {})

function App() {
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedClass, setSelectedClass] = useState('All Classes')
  const [query, setQuery] = useState('')
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('attendance-register')
    return saved ? JSON.parse(saved) : { [today]: starterAttendance }
  })

  const dailyAttendance = useMemo(
    () => attendance[selectedDate] || {},
    [attendance, selectedDate],
  )

  const visibleStudents = useMemo(() => {
    const search = query.trim().toLowerCase()

    return students.filter((student) => {
      const matchesClass =
        selectedClass === 'All Classes' || student.className === selectedClass
      const matchesSearch = [student.name, student.roll, student.className]
        .join(' ')
        .toLowerCase()
        .includes(search)

      return matchesClass && matchesSearch
    })
  }, [query, selectedClass])

  const stats = useMemo(() => {
    const countedStudents =
      selectedClass === 'All Classes'
        ? students
        : students.filter((student) => student.className === selectedClass)
    const total = countedStudents.length
    const counts = statuses.reduce((nextCounts, status) => {
      nextCounts[status] = countedStudents.filter(
        (student) => dailyAttendance[student.id] === status,
      ).length
      return nextCounts
    }, {})
    const attendanceRate = Math.round(
      ((counts.Present + counts.Late + counts.Excused) / (total || 1)) * 100,
    )

    return {
      total,
      present: counts.Present,
      late: counts.Late,
      absent: counts.Absent,
      attendanceRate,
    }
  }, [dailyAttendance, selectedClass])

  const sessions = useMemo(
    () =>
      Object.entries(attendance)
        .map(([date, records]) => {
          const marked = Object.values(records).filter(Boolean).length
          const present = Object.values(records).filter(
            (status) => status === 'Present' || status === 'Late',
          ).length

          return {
            date,
            marked,
            rate: Math.round((present / (marked || 1)) * 100),
          }
        })
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5),
    [attendance],
  )

  function saveAttendance(nextAttendance) {
    setAttendance(nextAttendance)
    localStorage.setItem('attendance-register', JSON.stringify(nextAttendance))
  }

  function markAttendance(studentId, status) {
    saveAttendance({
      ...attendance,
      [selectedDate]: {
        ...dailyAttendance,
        [studentId]: status,
      },
    })
  }

  function markVisible(status) {
    const nextDay = { ...dailyAttendance }
    visibleStudents.forEach((student) => {
      nextDay[student.id] = status
    })

    saveAttendance({
      ...attendance,
      [selectedDate]: nextDay,
    })
  }

  function clearDay() {
    const nextAttendance = { ...attendance }
    delete nextAttendance[selectedDate]
    saveAttendance(nextAttendance)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">AM</span>
          <div>
            <strong>AttendWise</strong>
            <small>Student attendance desk</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          <button className="nav-item active" type="button">
            Dashboard
          </button>
          <button className="nav-item" type="button">
            Attendance
          </button>
          <button className="nav-item" type="button">
            Classes
          </button>
          <button className="nav-item" type="button">
            Reports
          </button>
        </nav>

        <section className="sidebar-panel">
          <span>Today</span>
          <strong>{today}</strong>
          <p>{stats.attendanceRate}% attendance for the selected view.</p>
        </section>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Academic attendance</p>
            <h1>Student Attendance Management</h1>
          </div>
          <div className="profile-chip">
            <span>Administrator</span>
            <strong>College Office</strong>
          </div>
        </header>

        <section className="control-bar" aria-label="Attendance controls">
          <label>
            Date
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>
          <label>
            Class
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
            >
              {classes.map((className) => (
                <option key={className}>{className}</option>
              ))}
            </select>
          </label>
          <label>
            Search
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, roll, class"
            />
          </label>
          <div className="quick-actions">
            <button type="button" onClick={() => markVisible('Present')}>
              Mark Present
            </button>
            <button type="button" onClick={() => markVisible('Absent')}>
              Mark Absent
            </button>
          </div>
        </section>

        <section className="metrics" aria-label="Attendance summary">
          <article className="metric-card">
            <span>Total Students</span>
            <strong>{stats.total}</strong>
          </article>
          <article className="metric-card present">
            <span>Present</span>
            <strong>{stats.present}</strong>
          </article>
          <article className="metric-card late">
            <span>Late</span>
            <strong>{stats.late}</strong>
          </article>
          <article className="metric-card absent">
            <span>Absent</span>
            <strong>{stats.absent}</strong>
          </article>
        </section>

        <section className="content-grid">
          <section className="panel register">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Daily register</p>
                <h2>{selectedClass}</h2>
              </div>
              <button className="text-button" type="button" onClick={clearDay}>
                Clear Day
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll</th>
                    <th>Class</th>
                    <th>Advisor</th>
                    <th>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleStudents.map((student) => {
                    const currentStatus = dailyAttendance[student.id] || 'Unmarked'

                    return (
                      <tr key={student.id}>
                        <td>
                          <div className="student-cell">
                            <span>{student.name.slice(0, 1).toUpperCase()}</span>
                            <div>
                              <strong>{student.name}</strong>
                              <small>Parent: {student.parent}</small>
                            </div>
                          </div>
                        </td>
                        <td>{student.roll}</td>
                        <td>
                          <span className="class-pill">{student.className}</span>
                        </td>
                        <td>{student.advisor}</td>
                        <td>
                          <div className="status-group" aria-label="Mark status">
                            {statuses.map((status) => (
                              <button
                                className={
                                  currentStatus === status
                                    ? `status-option active ${status.toLowerCase()}`
                                    : 'status-option'
                                }
                                type="button"
                                key={status}
                                onClick={() => markAttendance(student.id, status)}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {visibleStudents.length === 0 && (
                <div className="empty-state">No students match the selected filters.</div>
              )}
            </div>
          </section>

          <aside className="panel insights">
            <div className="panel-heading compact">
              <div>
                <p className="eyebrow">Overview</p>
                <h2>Attendance Health</h2>
              </div>
            </div>

            <div className="rate-card">
              <span>Attendance Rate</span>
              <strong>{stats.attendanceRate}%</strong>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${stats.attendanceRate}%` }}
                />
              </div>
            </div>

            <div className="status-summary">
              <div>
                <span className="dot present-dot" />
                Present
                <strong>{stats.present}</strong>
              </div>
              <div>
                <span className="dot late-dot" />
                Late
                <strong>{stats.late}</strong>
              </div>
              <div>
                <span className="dot absent-dot" />
                Absent
                <strong>{stats.absent}</strong>
              </div>
            </div>

            <div className="session-list">
              <h3>Recent Sessions</h3>
              {sessions.map((session) => (
                <button
                  className={
                    session.date === selectedDate
                      ? 'session-row active'
                      : 'session-row'
                  }
                  type="button"
                  key={session.date}
                  onClick={() => setSelectedDate(session.date)}
                >
                  <span>{session.date}</span>
                  <strong>{session.rate}%</strong>
                  <small>{session.marked} marked</small>
                </button>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
