import { useState } from "react";

import "./login.css";
import { useNavigate } from "react-router";

async function loginUser(credentials) {
  return fetch('/login.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json());
}

function Login({ setToken, goTo }) {

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    setToken(token);
    // useNavigate("/dashboard");
  }

  return (
    <div className="login-wrapper">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Login
