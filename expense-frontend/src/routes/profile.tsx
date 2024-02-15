import { createFileRoute } from '@tanstack/react-router';
import { currentUserQueryOptions } from "../auth";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute('/profile')({
  component: Profile,
})

function Profile() {
  const currentUserQuery = useQuery(currentUserQueryOptions);

  const user = currentUserQuery?.data?.user

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4">Profile</h1>      <div className="mb-8">
        {currentUserQuery.error ? (
          <div className="text-red-500">{currentUserQuery.error.message}</div>
        ) : currentUserQuery.isPending ? (
          <div className="text-center flex flex-col max-w-96 m-auto animate-pulse">
            Getting User ...
          </div>
        ) : (
          <div>
            <div className="text-center flex flex-col max-w-96 m-auto">
              {user?.email}
            </div>
            <div className="text-center flex flex-col max-w-96 m-auto">
              {user?.given_name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}