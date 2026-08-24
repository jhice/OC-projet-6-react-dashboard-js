import React, { StrictMode, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Error404 from "./components/Error404/Error404";
import useToken from "./hooks/useToken";

function App() {

  const { token, setToken } = useToken();
  console.log("token =", token);

  if (!token) {
    return <Login setToken={setToken} />
  }

  return (
    <>
      <StrictMode>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Error404 />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StrictMode>
    </>
  );
}

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(<App />);