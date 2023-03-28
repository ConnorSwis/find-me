import { Link } from "@remix-run/react";
import { Layout } from "~/components/layout";
import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return redirect('/home')
}

export default function Index() {
  const user = useLoaderData();
  console.log(user)
  return (
    <Layout>
      <div className="flex flex-col">
        <h1>{user ? user.username : "Welcome"}</h1>
        <Link to="/login">Login</Link>
      </div>
    </Layout>
  );
};

