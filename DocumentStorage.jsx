import { useEffect, useState } from "react";

export default function DocumentStorage({ role, goBack }) {
  const [docs, setDocs] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Aadhaar");
  const [file, setFile] = useState(null);
  const [viewFile, setViewFile] = useState(null);

  // ================= FETCH DOCUMENTS =================
  const fetchDocs = async () => {
    try {
      const res = await fetch("http://localhost:5000/documents");
      const data = await res.json();
      setDocs(data);
    } catch (err) {
      console.error("Error fetching docs:", err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // ================= UPLOAD =================
  const uploadDoc = async () => {
    if (!name || !file) {
      alert("Fill all fields ❌");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("file", file);

    try {
      await fetch("http://localhost:5000/documents/upload", {
        method: "POST",
        body: formData,
      });

      alert("Uploaded ✅");
      setName("");
      setFile(null);
      fetchDocs();
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  // ================= DOWNLOAD =================
  const handleDownload = async (file) => {
    try {
      const res = await fetch(`http://localhost:5000/files/${file}`);
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Download failed ❌");
    }
  };

  // ================= VIEW MODE =================
  if (viewFile) {
    return (
      <div className="feature-page">
        <h3>📄 Document Viewer</h3>

        {/* IMAGE OR PDF VIEW */}
        {viewFile.endsWith(".jpg") ||
        viewFile.endsWith(".png") ||
        viewFile.endsWith(".jpeg") ? (
          <img
            src={`http://localhost:5000/files/${viewFile}`}
            alt="doc"
            width="100%"
          />
        ) : (
          <iframe
            src={`http://localhost:5000/files/${viewFile}`}
            width="100%"
            height="500px"
            title="Document"
          />
        )}

        <br /><br />

        <button onClick={() => setViewFile(null)}>🔙 Back</button>
      </div>
    );
  }

  // ================= MAIN PAGE =================
  return (
    <div className="feature-page">
      <h2>📂 Documents</h2>

      {/* ================= TEACHER UPLOAD ================= */}
      {role?.toLowerCase() === "teacher" && (
        <div className="upload-box">
          <h3>Upload Document</h3>

          <input
            placeholder="Document Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Aadhaar</option>
            <option>Marks Card</option>
            <option>Certificate</option>
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={uploadDoc}>Upload</button>
        </div>
      )}

      {/* ================= DOCUMENT LIST ================= */}
      <div className="doc-list">
        {docs.length === 0 ? (
          <p>No documents available</p>
        ) : (
          docs.map((doc, i) => (
            <div key={i} className="doc-card">
              <b>{doc.name}</b> ({doc.category}) <br /><br />

              <button onClick={() => setViewFile(doc.file)}>
                View
              </button>

              <button onClick={() => handleDownload(doc.file)}>
                Download
              </button>
            </div>
          ))
        )}
      </div>

      <br />
      <button onClick={goBack}>Back</button>
    </div>
  );
}