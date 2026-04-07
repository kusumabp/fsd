import { useState, useEffect } from "react";

export default function IAManagement({ user, role, goBack }) {
  const [records, setRecords] = useState([]);
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");

  const fetchData = async () => {
    const res = await fetch(`http://localhost:5000/ia/${user}`);
    setRecords(await res.json());
  };

  useEffect(()=>{ fetchData(); },[]);

  const addMarks = async () => {
    await fetch("http://localhost:5000/ia/add", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ student:user, subject, marks })
    });
    fetchData();
  };

  return (
    <div className="feature-page">
      <h2>IA Marks</h2>

      {role==="Teacher" && (
        <>
          <input placeholder="Subject" onChange={e=>setSubject(e.target.value)} />
          <input placeholder="Marks" onChange={e=>setMarks(e.target.value)} />
          <button onClick={addMarks}>Add</button>
        </>
      )}

      {records.map((r,i)=>(
        <p key={i}>{r.subject} : {r.marks}</p>
      ))}

      <button className="back-btn" onClick={goBack}>Back</button>
    </div>
  );
}