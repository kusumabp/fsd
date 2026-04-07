import { useState } from "react";

export default function Email({ goBack }) {
  const [to,setTo]=useState("");
  const [subject,setSubject]=useState("");
  const [message,setMessage]=useState("");

  const send=async()=>{
    await fetch("http://localhost:5000/email/send",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({to,subject,message})
    });
    alert("Sent");
  };

  return(
    <div className="feature-page">
      <h2>Email</h2>
      <input placeholder="To" onChange={e=>setTo(e.target.value)} />
      <input placeholder="Subject" onChange={e=>setSubject(e.target.value)} />
      <input placeholder="Message" onChange={e=>setMessage(e.target.value)} />
      <button onClick={send}>Send</button>
      <button className="back-btn" onClick={goBack}>Back</button>
    </div>
  );
}