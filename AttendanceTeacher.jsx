import { useState } from "react";

export default function AttendanceTeacher({ goBack }) {
  const [student, setStudent] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");

  const markAttendance = async () => {
    if (!student || !date) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: student.toLowerCase(), // ✅ IMPORTANT FIX
          date,
          status
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Attendance marked ✅");

        // reset fields
        setStudent("");
        setDate("");
        setStatus("Present");
      } else {
        alert(data.message);
      }

    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="feature-page">
      <h2>👩‍🏫 Mark Attendance</h2>

      <input
        placeholder="Student Username (e.g. ram)"
        value={student}
        onChange={e => setStudent(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option>Present</option>
        <option>Absent</option>
      </select>

      <button onClick={markAttendance}>Submit</button>

      <button className="back-btn" onClick={goBack}>
        Back
      </button>
    </div>
  );
}