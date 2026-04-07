import { useState, useEffect } from "react";

export default function Announcements({ goBack }) {
  const [list,setList]=useState([]);
  const [title,setTitle]=useState("");
  const [message,setMessage]=useState("");

  const fetchData=async()=>{
    const res=await fetch("http://localhost:5000/announcements");
    setList(await res.json());
  };

  useEffect(()=>{fetchData();},[]);

  const add=async()=>{
    await fetch("http://localhost:5000/announcements/add",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({title,message})
    });
    fetchData();
  };

  return(
    <div className="feature-page">
      <h2>Announcements</h2>
      <input placeholder="Title" onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Message" onChange={e=>setMessage(e.target.value)} />
      <button onClick={add}>Add</button>

      {list.map((a,i)=>(
        <p key={i}>{a.title} - {a.message}</p>
      ))}

      <button className="back-btn" onClick={goBack}>Back</button>
    </div>
  );
}