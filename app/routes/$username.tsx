import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserByUsername } from "~/utils/user.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { username } = params;
  console.log(username);
  return json(await getUserByUsername(username as string));
};

export default function UserModal() {
  const data = useLoaderData();
  console.log(data);
  return <h2>User: {data.username}</h2>;
}
