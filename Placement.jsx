import { useState,useEffect } from "react";

export default function Placement({ user, goBack }) {
  const [jobs,setJobs]=useState([]);

  useEffect(()=>{
    fetch("http://localhost:5000/placement")
      .then(r=>r.json())
      .then(setJobs);
  },[]);

  const apply=async(job)=>{
    await fetch("http://localhost:5000/placement/apply",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:user,company:job.company,role:job.role})
    });
    alert("Applied");
  };

  return(
    <div className="feature-page">
      <h2>Placement</h2>
      {jobs.map((j,i)=>(
        <div key={i}>
          <p>{j.company} - {j.role}</p>
          <button onClick={()=>apply(j)}>Apply</button>
        </div>
      ))}
      <button className="back-btn" onClick={goBack}>Back</button>
    </div>
  );
}