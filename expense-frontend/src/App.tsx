import React from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function getTotalExpenses() {
  const res = await fetch("/api/expenses/total-amount");
  const json = await res.json();
  return json;
}

async function getAllExpenses() {
  const res = await fetch("/api/expenses");
  const json = await res.json();
  return json;
}

async function deleteExpense(id) {
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

function App() {
  const queryClient = useQueryClient()

  const totalExpenses = useQuery({
    queryKey: ["total-amount"],
    queryFn: getTotalExpenses,
  });
  const allExpenses = useQuery({
    queryKey: ["all-expenses"],
    queryFn: getAllExpenses,
  });
  async function handleDelete(id) {
    await deleteExpense(id);
    queryClient.invalidateQueries(); // Re-fetch all data after deletion
  }

  async function createExpense(title: string, amount: number, date: string) {
    await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, amount, date })
    });
    
    // re fetch all data 
    queryClient.invalidateQueries()
  }

  return (
    <div className="min-h-screen w-screen bg-white dark:bg-black text-black dark:text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-4">Expenses</h1>

      <div className="mb-8">
        <h2 className="text-center text-2xl font-bold mb-2">Total Expenses</h2>
        {totalExpenses.error ? (
          <div className="text-red-500">{totalExpenses.error.message}</div>
        ) : totalExpenses.isPending ? (
          <div className="text-center flex flex-col max-w-96 m-auto animate-pulse">
            Total Spent ...
          </div>
        ) : (
          <div className="text-center flex flex-col max-w-96 m-auto">
            Total Spent ${totalExpenses.data.total}
          </div>
        )}
      </div>

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
      <div className="max-w-md mx-auto p-4 border bg-gray-900 border-gray-300 rounded mt-4">
        <h2 className="text-center text-2xl font-bold mb-4">Create Expense</h2>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;

            const titleInput = form.title as unknown as HTMLInputElement;
            const dateInput = form.date as unknown as HTMLInputElement;
            const amountInput = form.amount as unknown as HTMLInputElement;

            const title = titleInput.value;
            const date = dateInput.value;
            const amount = parseFloat(amountInput.value);

            if (title && !isNaN(amount) && date) {
              createExpense(title, amount, date);
              form.reset();
            }
          }}
        >   
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-400">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="mt-1 p-2 w-full border rounded-md text-gray-800"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-400">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="mt-1 p-2 w-full border rounded-md text-gray-800"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-400">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              className="mt-1 p-2 w-full border rounded-md text-gray-800"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create Expense
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
