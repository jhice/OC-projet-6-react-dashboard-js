import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Error404 from "./components/Error404/Error404";
import ProtectedRoute from "./components/ProtectedRoute";
import { LoginProvider } from "./utils/context";

export function App() {

  return (
    <>
      <StrictMode>
        <BrowserRouter>
          <LoginProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<Error404 />} />
              </Route>
            </Routes>
          </LoginProvider>
        </BrowserRouter>
      </StrictMode>
    </>
  );
}

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(<App />);