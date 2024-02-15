import { queryOptions } from "@tanstack/react-query"

export type User = {
  email: string;
  given_name: string;
};
export type UserResponse = {
  user: User;
};

export async function getCurrentUser() {
  const res = await fetch("/api/me");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const json: UserResponse = await res.json();
  return json;
}

export const currentUserQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});