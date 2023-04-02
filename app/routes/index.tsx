import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { getUser } from "~/utils/auth.server";
import SignOutButton from "../components/sign-out-button";

export const loader: LoaderFunction = async ({ request }) => {
  return json(await getUser(request));
};

export default function Index() {
  const user = useLoaderData();
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center pt-10">
        <h1 className="text-6xl bg-blue-600 text-slate-200 rounded-lg p-3">
          Find.Me
        </h1>
        <p>Created by Connor J. Swislow</p>
        {user ? (
          <>
            <Link
              to="/home"
              className="text-xl font-bold text-blue-500 hover:text-blue-700"
            >
              Home
            </Link>
            <SignOutButton>
              <p className="text-xl font-bold text-blue-500 hover:text-blue-700">
                Sign Out
              </p>
            </SignOutButton>
          </>
        ) : (
          <Link
            to="/login"
            className="text-xl font-bold text-blue-500 hover:text-blue-700"
          >
            Login or Signup
          </Link>
        )}
      </div>
    </Layout>
  );
}
