import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/create')({
  component: Create,
})

function Create() {
  const navigate = useNavigate()

  async function createExpense(title: string, amount: number, date: string) {
    await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, amount, date })
    });
    
    navigate({to:'/expenses'})
  }

  return (
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
  )
  
}