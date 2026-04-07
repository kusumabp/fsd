import { useState, useEffect } from "react";

export default function Assignment({ user, role, goBack }) {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/assignments");
    const data = await res.json();
    setAssignments(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== TEACHER ADD =====
  const addAssignment = async () => {
    if (!title || !dueDate || !file) {
      alert("Fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("dueDate", dueDate);
    formData.append("file", file);

    await fetch("http://localhost:5000/assignments/add", {
      method: "POST",
      body: formData,
    });

    alert("Assignment added ✅");
    setTitle("");
    setDueDate("");
    setFile(null);
    fetchData();
  };

  // ===== STUDENT SUBMIT =====
  const submitAssignment = async (id) => {
    if (!file) {
      alert("Upload file first");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", id);
    formData.append("username", user);
    formData.append("file", file);

    await fetch("http://localhost:5000/assignments/submit", {
      method: "POST",
      body: formData,
    });

    alert("Submitted ✅");
    setFile(null);
    fetchData();
  };

  // ===== CHECK SUBMITTED =====
  const isSubmitted = (assignment) => {
    return assignment.submittedBy.find(
      (s) => s.username === user
    );
  };

  return (
    <div className="feature-page">
      <h2>📚 Assignments</h2>

      {/* ===== TEACHER UI ===== */}
      {role === "Teacher" && (
        <div>
          <h3>Add Assignment</h3>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={addAssignment}>Upload</button>
        </div>
      )}

      {/* ===== ASSIGNMENT LIST ===== */}
      {assignments.map((a) => {
        const submitted = isSubmitted(a);

        return (
          <div key={a.id} className="card">
            <h4>{a.title}</h4>
            <p>📅 Due: {a.dueDate}</p>

            {/* View / Download Question */}
            {a.file && (
              <a
                href={`http://localhost:5000/files/${a.file}`}
                target="_blank"
                rel="noreferrer"
              >
                📄 View / Download Question
              </a>
            )}

            {/* ===== STUDENT VIEW ===== */}
            {role === "Student" && (
              <>
                <p>
                  Status:{" "}
                  {submitted ? (
                    <span style={{ color: "green" }}>
                      Submitted ✅
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>
                      Not Submitted ❌
                    </span>
                  )}
                </p>

                {!submitted && (
                  <>
                    <input
                      type="file"
                      onChange={(e) =>
                        setFile(e.target.files[0])
                      }
                    />
                    <button
                      onClick={() => submitAssignment(a.id)}
                    >
                      Submit
                    </button>
                  </>
                )}

                {submitted && (
                  <a
                    href={`http://localhost:5000/files/${submitted.file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📥 View Submitted File
                  </a>
                )}
              </>
            )}
          </div>
        );
      })}

      <button className="back-btn" onClick={goBack}>
        Back
      </button>
    </div>
  );
}