import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-96">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-purple-600 text-white p-2 rounded" onClick={login}>
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-purple-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
