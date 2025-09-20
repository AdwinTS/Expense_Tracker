import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-purple-700">Welcome to Expense Tracker</h1>
      <p className="text-lg mb-8 text-gray-700">Manage your expenses easily and efficiently</p>
      <div className="flex gap-4">
        <Link to="/login">
          <button className="px-6 py-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-6 py-2 bg-white border border-purple-600 text-purple-600 font-semibold rounded hover:bg-purple-50 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
