import { useState } from "react";

export default function Scholarship({ user, goBack }) {
  const [marks,setMarks]=useState("");
  const [eligible,setEligible]=useState(false);

  const check=()=>{
    if(marks>=80){
      setEligible(true);
      alert("Eligible");
    } else alert("Not eligible");
  };

  const apply=async()=>{
    await fetch("http://localhost:5000/scholarship/apply",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:user,type:"Merit",criteriaMet:eligible})
    });
    alert("Applied");
  };

  return(
    <div className="feature-page">
      <h2>Scholarship</h2>
      <input placeholder="Marks" onChange={e=>setMarks(e.target.value)} />
      <button onClick={check}>Check</button>
      <button onClick={apply}>Apply</button>
      <button className="back-btn" onClick={goBack}>Back</button>
    </div>
  );
}