import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
