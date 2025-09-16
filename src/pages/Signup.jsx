import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-96">
        <h1 className="text-xl font-bold mb-4">Signup</h1>
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
        <button className="w-full bg-purple-600 text-white p-2 rounded" onClick={signup}>
          Signup
        </button>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/" className="text-purple-600">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
