import { useEffect, useState } from "react";

export default function Certificate({ user, role, goBack }) {
  const [type, setType] = useState("Bonafide");
  const [amount, setAmount] = useState("");

  const [fullName, setFullName] = useState("");
  const [usn, setUsn] = useState("");
  const [purpose, setPurpose] = useState("");

  const [data, setData] = useState([]);

  const [file, setFile] = useState(null);
  const [hardcopyDate, setHardcopyDate] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // ✅ REQUIRED DOCUMENTS BASED ON TYPE
  const requiredDocs = {
    Bonafide: ["Aadhaar", "ID Card"],
    Study: ["Aadhaar", "10th Marks Card", "12th Marks Card"],
  };

  // ✅ STORE FILES
  const [docFiles, setDocFiles] = useState({});

  const handleFileChange = (docName, file) => {
    setDocFiles((prev) => ({
      ...prev,
      [docName]: file,
    }));
  };

  // ================= FETCH =================
  const fetchData = async () => {
    const url =
      role === "Teacher"
        ? "http://localhost:5000/certificate"
        : `http://localhost:5000/certificate/${user}`;

    const res = await fetch(url);
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= APPLY =================
  const apply = async () => {
    if (
      !fullName ||
      !usn ||
      !purpose ||
      Object.keys(docFiles).length !== requiredDocs[type].length
    ) {
      alert("Upload all required documents ❌");
      return;
    }

    const formData = new FormData();
    formData.append("username", user);
    formData.append("type", type);
    formData.append("amount", amount);
    formData.append("fullName", fullName);
    formData.append("usn", usn);
    formData.append("purpose", purpose);

    Object.keys(docFiles).forEach((key) => {
      formData.append("documents", docFiles[key]);
    });

    await fetch("http://localhost:5000/certificate/apply", {
      method: "POST",
      body: formData,
    });

    alert("Applied + Payment Done ✅");

    // reset
    setDocFiles({});
    fetchData();
  };

  // ================= TEACHER UPDATE =================
  const updateCert = async () => {
    if (!selectedId) {
      alert("Select application ❌");
      return;
    }

    const formData = new FormData();
    formData.append("id", selectedId);
    formData.append("status", "Approved");
    formData.append("hardcopyDate", hardcopyDate);
    if (file) formData.append("file", file);

    await fetch("http://localhost:5000/certificate/update", {
      method: "POST",
      body: formData,
    });

    alert("Approved & Uploaded ✅");

    setSelectedId(null);
    setFile(null);
    setHardcopyDate("");
    fetchData();
  };

  // ================= DOWNLOAD =================
  const downloadFile = async (file) => {
    const res = await fetch(`http://localhost:5000/files/${file}`);
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file;
    a.click();
  };

  return (
    <div className="feature-page">
      <h2>🎓 Certificate</h2>

      {/* ================= STUDENT ================= */}
      {role === "Student" && (
        <div className="form-box">
          <h3>Apply Certificate</h3>

          <input
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            placeholder="USN"
            onChange={(e) => setUsn(e.target.value)}
          />

          <input
            placeholder="Purpose"
            onChange={(e) => setPurpose(e.target.value)}
          />

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setDocFiles({}); // reset files when type changes
            }}
          >
            <option>Bonafide</option>
            <option>Study</option>
          </select>

          <input
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />

          <h4>Upload Required Documents</h4>

          {requiredDocs[type].map((doc, i) => (
            <div key={i}>
              <p>{doc}</p>
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(doc, e.target.files[0])
                }
              />
            </div>
          ))}

          <button onClick={apply}>
            Apply + Pay 💳
          </button>
        </div>
      )}

      <hr />

      {/* ================= LIST ================= */}
      {data.map((c) => (
        <div key={c.id} className="card">
          <b>{c.type}</b> <br />
          Name: {c.fullName} <br />
          USN: {c.usn} <br />
          Purpose: {c.purpose} <br />
          Applied: {c.appliedDate} <br />
          Status: {c.status} <br />
          Hardcopy: {c.hardcopyDate || "Not ready"} <br />

          {/* VIEW DOCUMENTS */}
          {c.documents &&
            c.documents.map((doc, i) => (
              <button key={i} onClick={() => downloadFile(doc)}>
                View Doc {i + 1}
              </button>
            ))}

          {/* DOWNLOAD CERTIFICATE */}
          {c.file && (
            <button onClick={() => downloadFile(c.file)}>
              Download Certificate
            </button>
          )}

          {/* ================= TEACHER ================= */}
          {role === "Teacher" && (
            <div>
              <input
                type="date"
                onChange={(e) => setHardcopyDate(e.target.value)}
              />

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button onClick={() => setSelectedId(c.id)}>
                Select
              </button>

              <button onClick={updateCert}>
                Approve
              </button>
            </div>
          )}
        </div>
      ))}

      <button onClick={goBack}>Back</button>
    </div>
  );
}