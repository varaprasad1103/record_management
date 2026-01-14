import { useState } from "react";

function Login({ onLogin }) {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();

    fetch("http://localhost:8080/auth/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username,password})
    })
    .then(res=>{
      if(!res.ok) throw new Error("Invalid login");
      return res.json();
    })
    .then(data=>{
      localStorage.setItem("user",JSON.stringify(data));
      localStorage.setItem("loggedIn","true");
      onLogin();
    })
    .catch(()=>{
      alert("Invalid username or password");
    });
  };

  return (
    <div style={{width:300,margin:"100px auto"}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={e=>setUsername(e.target.value)}
          style={{width:"100%",padding:8,marginBottom:10}}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          style={{width:"100%",padding:8,marginBottom:10}}
        />
        <button style={{width:"100%",padding:8}}>Login</button>
      </form>
    </div>
  );
}

export default Login;
