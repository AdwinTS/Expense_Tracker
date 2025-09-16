import { useState, useEffect } from "react";
import { auth, db } from "../firebase-config";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import ExpenseAnalytics from "../components/ExpenseAnalytics";

function Dashboard() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser.uid;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "users", userId, "expenses"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching expenses: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  const addExpense = async () => {
    if (!name || !amount) {
      alert("Please enter both a name and an amount.");
      return;
    }
    await addDoc(collection(db, "users", userId, "expenses"), {
      name,
      amount: Number(amount),
      category,
      date: new Date().toISOString().split("T")[0],
    });
    setName("");
    setAmount("");
  };

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "users", userId, "expenses", id));
  };

  const clearAllExpenses = async () => {
    if (window.confirm("Are you sure you want to clear all expenses? This cannot be undone.")) {
      const batch = writeBatch(db);
      expenses.forEach((expense) => {
        const docRef = doc(db, "users", userId, "expenses", expense.id);
        batch.delete(docRef);
      });
      await batch.commit();
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Expense Dashboard 📊
          </h1>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            onClick={logout}
          >
            Logout
          </button>
        </header>

        {/* Expense Entry Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Add New Expense</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Expense Name (e.g., Groceries)"
              className="flex-1 border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition duration-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              className="flex-1 border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition duration-300"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select
              className="flex-1 border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition duration-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Travel">Travel</option>
              <option value="Others">Others</option>
            </select>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-md transition duration-300 w-full md:w-auto"
              onClick={addExpense}
            >
              Add Expense
            </button>
          </div>
        </section>

        {/* Analytics and History Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expense Analytics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Expense Analytics 📈
            </h2>
            <div className="h-64 flex justify-center items-center">
              <ExpenseAnalytics expenses={expenses} />
            </div>
            <p className="text-center text-gray-500 mt-4">
              Spending by Category
            </p>
          </div>

          {/* Expense History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">
                Expense History 📜
              </h2>
              <button
                className="text-red-500 hover:text-red-700 font-medium transition duration-300"
                onClick={clearAllExpenses}
              >
                Clear All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-600">
                    <th className="px-4 py-3 border-r border-gray-200">Date</th>
                    <th className="px-4 py-3 border-r border-gray-200">Name</th>
                    <th className="px-4 py-3 border-r border-gray-200">Category</th>
                    <th className="px-4 py-3 border-r border-gray-200">Amount</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-500">
                        No expenses added yet.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr
                        key={exp.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                      >
                        <td className="px-4 py-3">{exp.date}</td>
                        <td className="px-4 py-3">{exp.name}</td>
                        <td className="px-4 py-3">{exp.category}</td>
                        <td className="px-4 py-3 font-semibold text-green-600">
                          ₹{exp.amount}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="text-red-500 hover:text-red-700 transition duration-300"
                            onClick={() => deleteExpense(exp.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;