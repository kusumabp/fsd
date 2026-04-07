import { useState,useEffect } from "react";

export default function Resources({ role, goBack }) {
  const [list,setList]=useState([]);
  const [name,setName]=useState("");
  const [link,setLink]=useState("");

  const fetchData=async()=>{
    const res=await fetch("http://localhost:5000/resources");
    setList(await res.json());
  };

  useEffect(()=>{fetchData();},[]);

  const upload=async()=>{
    await fetch("http://localhost:5000/resources/upload",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name,link,uploadedBy:"teacher"})
    });
    fetchData();
  };

  return(
    <div className="feature-page">
      <h2>Resources</h2>

      {role==="Teacher" && (
        <>
          <input placeholder="Name" onChange={e=>setName(e.target.value)} />
          <input placeholder="Link" onChange={e=>setLink(e.target.value)} />
          <button onClick={upload}>Upload</button>
        </>
      )}

      {list.map((r,i)=>(
        <p key={i}><a href={r.link}>{r.name}</a></p>
      ))}

      <button className="back-btn" onClick={goBack}>Back</button>
    </div>
  );
}