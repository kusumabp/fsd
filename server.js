const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/files", express.static("uploads"));

// ===== MULTER SETUP =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ===== LOAD DATABASE =====
let db = JSON.parse(fs.readFileSync("data.json"));

let {
  attendanceRecords = [],
  assignments = [],
  announcements = [],
  documents = [],
  teacherAdvice = [],
  certificates = [], 
} = db;

// ===== SAVE FUNCTION =====
function saveData() {
  db = {
    attendanceRecords,
    assignments,
    announcements,
    documents,
    teacherAdvice,
    certificates,
  };

  fs.writeFileSync("data.json", JSON.stringify(db, null, 2));
}

// ===== USERS =====
let users = [
  { username: "ram", password: "123", role: "Student" },
  { username: "sita", password: "123", role: "Student" },
  { username: "john", password: "123", role: "Student" },
  { username: "teacher1", password: "admin", role: "Teacher" },
];

// ===== LOGIN =====
app.post("/login", (req, res) => {
  let { username, password, role } = req.body;

  username = username.toLowerCase();

  const user = users.find(
    (u) =>
      u.username === username &&
      u.password === password &&
      u.role === role
  );

  if (!user)
    return res.status(401).json({ message: "Invalid credentials ❌" });

  res.json({
    message: "Login successful ✅",
    username: user.username,
    role: user.role,
  });
});

// ===== STUDENTS LIST =====
let students = ["ram", "sita", "john"];
app.get("/students", (req, res) => res.json(students));


// ================= ATTENDANCE =================

// MARK
app.post("/attendance/mark", (req, res) => {
  let { student, date, status } = req.body;

  student = student.toLowerCase();

  const index = attendanceRecords.findIndex(
    (a) => a.student === student && a.date === date
  );

  if (index !== -1) {
    attendanceRecords[index].status = status;
  } else {
    attendanceRecords.push({ student, date, status });
  }

  saveData();
  res.json({ message: "Attendance saved ✅" });
});

// VIEW (STUDENT)
app.get("/attendance/:student", (req, res) => {
  const student = req.params.student.toLowerCase();
  res.json(attendanceRecords.filter((a) => a.student === student));
});


// ================= ASSIGNMENTS =================

// ADD (Teacher uploads question file)
app.post("/assignments/add", upload.single("file"), (req, res) => {
  const { title, dueDate } = req.body;

  assignments.push({
    id: Date.now(),
    title,
    dueDate,
    file: req.file ? req.file.filename : null,
    submittedBy: [],
  });

  saveData();
  res.json({ message: "Assignment added ✅" });
});

// GET ALL
app.get("/assignments", (req, res) => {
  res.json(assignments);
});

// STUDENT SUBMIT
app.post("/assignments/submit", upload.single("file"), (req, res) => {
  let { assignmentId, username } = req.body;

  username = username.toLowerCase();

  const assignment = assignments.find(
    (a) => a.id == assignmentId
  );

  if (!assignment)
    return res.status(404).json({ message: "Not found ❌" });

  const already = assignment.submittedBy.find(
    (s) => s.username === username
  );

  if (already)
    return res.json({ message: "Already submitted ⚠️" });

  assignment.submittedBy.push({
    username,
    file: req.file ? req.file.filename : null,
    submittedAt: new Date(),
  });

  saveData();
  res.json({ message: "Submitted ✅" });
});


// ================= ANNOUNCEMENTS =================

app.post("/announcements/add", (req, res) => {
  const { title, message } = req.body;

  announcements.push({
    title,
    message,
    date: new Date().toLocaleDateString(),
  });

  saveData();
  res.json({ message: "Added ✅" });
});

app.get("/announcements", (req, res) => res.json(announcements));


// ================= DOCUMENT STORAGE (FINAL FIXED) =================

// ✅ TEACHER UPLOAD (COMMON FOR ALL STUDENTS)
app.post("/documents/upload", upload.single("file"), (req, res) => {
  const { name, category } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "File missing ❌" });
  }

  documents.push({
    name,
    category,
    uploadedBy: "Teacher",
    file: req.file.filename,
  });

  saveData();
  res.json({ message: "Uploaded ✅" });
});

// ✅ GET ALL DOCUMENTS (FOR STUDENTS)
app.get("/documents", (req, res) => {
  res.json(documents);
});
// ================= CERTIFICATE SYSTEM =================

// ================= CERTIFICATE SYSTEM (FULL) =================

// 👉 APPLY WITH FORM + DOCUMENTS
app.post("/certificate/apply", upload.array("documents"), (req, res) => {
  let {
    username,
    type,
    amount,
    fullName,
    usn,
    purpose,
  } = req.body;

  username = username.toLowerCase();

  // ✅ store multiple uploaded files
  const uploadedDocs = req.files
    ? req.files.map((f) => f.filename)
    : [];

  certificates.push({
    id: Date.now(),
    username,
    type,
    amount,
    fullName,
    usn,
    purpose,
    documents: uploadedDocs,
    appliedDate: new Date().toLocaleDateString(),
    status: "Pending",
    hardcopyDate: null,
    file: null, // certificate file (teacher upload)
  });

  saveData();
  res.json({ message: "Applied with documents ✅" });
});


// 👉 STUDENT VIEW
app.get("/certificate/:username", (req, res) => {
  const username = req.params.username.toLowerCase();
  res.json(certificates.filter((c) => c.username === username));
});


// 👉 TEACHER VIEW ALL
app.get("/certificate", (req, res) => {
  res.json(certificates);
});


// 👉 TEACHER UPDATE (APPROVE + UPLOAD CERTIFICATE)
app.post("/certificate/update", upload.single("file"), (req, res) => {
  const { id, status, hardcopyDate } = req.body;

  const cert = certificates.find((c) => c.id == id);

  if (!cert) return res.status(404).json({ message: "Not found ❌" });

  cert.status = status;
  cert.hardcopyDate = hardcopyDate;

  if (req.file) {
    cert.file = req.file.filename; // soft copy uploaded
  }

  saveData();
  res.json({ message: "Updated ✅" });
});

// ================= TEACHER ADVICE =================

// STUDENT ASK
app.post("/teacher/advice", (req, res) => {
  let { student, question } = req.body;

  student = student.toLowerCase();

  teacherAdvice.push({
    id: Date.now(),
    student,
    question,
    answer: null,
  });

  saveData();
  res.json({ message: "Question sent ✅" });
});

// TEACHER ANSWER
app.post("/teacher/advice/answer", (req, res) => {
  const { id, answer } = req.body;

  const q = teacherAdvice.find((t) => t.id == id);

  if (!q) return res.status(404).json({ message: "Not found ❌" });

  q.answer = answer;

  saveData();
  res.json({ message: "Answered ✅" });
});

// STUDENT VIEW
app.get("/teacher/advice/:student", (req, res) => {
  const student = req.params.student.toLowerCase();
  res.json(teacherAdvice.filter((t) => t.student === student));
});


// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});