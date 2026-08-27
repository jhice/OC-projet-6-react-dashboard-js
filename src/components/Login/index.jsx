import { useContext, useState } from "react";
// import { useNavigate } from "react-router";
import { LoginContext } from "../../utils/context";

import "./login.css";
import { useNavigate } from "react-router";

async function loginUser(credentials) {

  let token = null
  let error = null

  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      // 404
      if (response.status === 404) {
        throw new Error("Erreur de connexion au serveur")
      }
      // 400
      const data = await response.json();
      throw new Error(data.message)
    }

    token = await response.json();

  } catch (err) {
    // console.log(err)
    error = err
  }

  return { token, error }
}

function Login() {

  const { setToken } = useContext(LoginContext);

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const { token, error } = await loginUser({
      username,
      password
    });
    
    if (error) {
      setMessage(error.message)
      return
    }

    setToken(token);
    navigate("/dashboard");
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
        {message ? <p>{message}</p> : ""}
      </form>
    </div>
  )
}

export default Login
