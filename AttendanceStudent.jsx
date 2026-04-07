import React, { useEffect, useState } from "react";

export default function Attendance({ user, goBack }) {
  const [attendance, setAttendance] = useState([]);

  // Fetch real data from backend
  useEffect(() => {
    fetch(`http://localhost:5000/attendance/${user}`)
      .then(res => res.json())
      .then(data => setAttendance(data))
      .catch(err => console.log(err));
  }, [user]);

  return (
    <div className="feature-page">
      <h2>📊 Attendance Tracking</h2>

      {attendance.length === 0 ? (
        <p>No attendance found</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((att, i) => (
              <tr key={i}>
                <td>{att.date}</td>
                <td
                  style={{
                    color: att.status === "Present" ? "green" : "red",
                    fontWeight: "bold"
                  }}
                >
                  {att.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="back-btn" onClick={goBack}>
        Back
      </button>
    </div>
  );
}