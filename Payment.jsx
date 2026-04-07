import { useState } from "react";

export default function Payment({ user, goBack }) {
  const [amount,setAmount]=useState("");

  const pay=async()=>{
    await fetch("http://localhost:5000/payment",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:user,amount,type:"General"})
    });
    alert("Payment done");
  };

  return(
    <div className="feature-page">
      <h2>Payment</h2>
      <input placeholder="Amount" onChange={e=>setAmount(e.target.value)} />
      <button onClick={pay}>Pay</button>
      <button className="back-btn" onClick={goBack}>Back</button>
    </div>
  );
}