export default function Dashboard({ user, role, navigate, logout }) {
  return (
    <div className="dashboard-container">
      <h2>Welcome {user} ({role})</h2>

      <div className="feature-grid">

        {/* Attendance */}
        <button onClick={() => navigate("attendance")}>Attendance</button>

        {/* Assignments */}
        <button onClick={() => navigate("assignments")}>Assignments</button>

        {/* IA */}
        <button onClick={() => navigate("ia")}>IA Marks</button>

        {/* Announcements */}
        <button onClick={() => navigate("announcements")}>Announcements</button>

        {/* Resources */}
        <button onClick={() => navigate("resources")}>Resources</button>

        {/* Documents */}
        <button onClick={() => navigate("documents")}>Documents</button>

        {/* Certificate */}
        <button onClick={() => navigate("certificate")}>Certificate</button>

        {/* Placement */}
        <button onClick={() => navigate("placement")}>Placement</button>

        {/* Email */}
        <button onClick={() => navigate("email")}>Email</button>

        {/* Teacher Advice */}
        <button onClick={() => navigate("teacherAdvice")}>
          Teacher Advice
        </button>

        {/* STUDENT ONLY */}
        {role === "Student" && (
          <>
            <button onClick={() => navigate("scholarship")}>
              Scholarship
            </button>

            <button onClick={() => navigate("payment")}>
              Payment
            </button>
          </>
        )}

      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}