import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { currentUserQueryOptions } from "../auth";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient}>()(
  {
  component: Root,
  }
);


function Root() {
  const currentUserQuery = useQuery(currentUserQueryOptions);
  return (
    <div className="w-screen h-screen bg-white dark:bg-black text-black dark:text-white overflow-auto">
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/create" className="[&.active]:font-bold">
          Create
        </Link>
        {currentUserQuery.data?.user ? (
          <Link to="/profile" className="[&.active]:font-bold">
            Profile
          </Link>
        ) : null}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
    </div>
  );
}