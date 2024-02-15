import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

async function getAllExpenses() {
  const res = await fetch("/api/expenses");
  const json = await res.json();
  return json;
}

async function deleteExpense(id: number) {
  await fetch(`/api/expenses/${id}`, {
    method: "DELETE",
  });
}

type Expense = {
  id: number;
  title: string;
  amount: number;
  date: string;
};

function Expenses() {
  const queryClient = useQueryClient()

  const allExpenses = useQuery({
    queryKey: ["all-expenses"],
    queryFn: getAllExpenses,
  });
  async function handleDelete(id: number) {
    await deleteExpense(id);
    queryClient.invalidateQueries(); // Re-fetch all data after deletion
  }

  return (
    <div>
    <h2 className="text-center text-2xl font-bold mb-4">All Expenses</h2>
    {allExpenses.error ? (
      <div className="text-red-500">{allExpenses.error.message}</div>
    ) : allExpenses.isPending ? (
      <div className="flex flex-col max-w-96 m-auto animate-pulse">
        Loading Expenses...
      </div>
    ) : (
      <div className="max-w-2xl mx-auto">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-900 ">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-200">
            {allExpenses.data.expenses.map((expense: Expense) => (
              <tr key={expense.id}>
                <td className="px-6 py-4">{expense.title}</td>
                <td className="px-6 py-4">{expense.date}</td>
                <td className="px-6 py-4">${expense.amount}</td>
                <td className="px-6 py-4">
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  )
}