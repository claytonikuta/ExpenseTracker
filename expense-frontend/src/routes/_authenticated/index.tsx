import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/')({
  component: HomePage,
})

async function getTotalExpenses() {
  const res = await fetch("/api/expenses/total-amount");
  const json = await res.json();
  return json;
}

function HomePage() {
  const totalExpenses = useQuery({
    queryKey: ["total-amount"],
    queryFn: getTotalExpenses,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4">Expenses</h1>

      <div className="mb-8">
        {/* <h2 className="text-center text-2xl font-bold mb-2">Total Expenses</h2> */}
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
    </div>
  );
}

export default HomePage;
