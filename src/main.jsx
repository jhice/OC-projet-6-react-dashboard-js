import React, { StrictMode, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Error404 from "./components/Error404/Error404";
import useToken from "./hooks/useToken";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  const { token, setToken, removeToken } = useToken();
  console.log("token =", token);

  return (
    <>
      <StrictMode>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout removeToken={removeToken} token={token} />}>
              <Route path="/" element={<Login setToken={setToken} />} />
              <Route path="/dashboard" element={<ProtectedRoute token={token}><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute token={token}><Profile /></ProtectedRoute>} />
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