import { useState } from "react";

export default function TeacherAdvice({ user, goBack }) {
  const [question,setQuestion]=useState("");

  const ask=async()=>{
    await fetch("http://localhost:5000/teacher/advice",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({student:user,question})
    });
    alert("Asked");
  };

  return(
    <div className="feature-page">
      <h2>Teacher Advice</h2>
      <input placeholder="Ask question" onChange={e=>setQuestion(e.target.value)} />
      <button onClick={ask}>Submit</button>
      <button className="back-btn" onClick={goBack}>Back</button>
    </div>
  );
}