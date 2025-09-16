import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseAnalytics({ expenses }) {
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Spending by Category",
        data: Object.values(categoryTotals),
        backgroundColor: ["#6366F1", "#F59E0B", "#10B981", "#EF4444"],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Expense Analytics</h2>
      <Pie data={data} />
    </div>
  );
}

export default ExpenseAnalytics;
