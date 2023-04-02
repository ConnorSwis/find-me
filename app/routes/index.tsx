import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { getUser } from "~/utils/auth.server";
import SignOutButton from "../components/sign-out-button";
import { RiGithubFill } from "react-icons/ri";

export const loader: LoaderFunction = async ({ request }) => {
  return json(await getUser(request));
};

export default function Index() {
  const user = useLoaderData();
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center pt-10">
        <h1 className="text-6xl bg-blue-600 text-slate-200 rounded-lg p-3 mt-10 mb-3">
          Find.Me
        </h1>
        <div className="flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col justify-center items-center">
            <p>Created by Connor J. Swislow</p>
            <Link to="https://github.com/ConnorSwis/find-me" target="_blank">
              <div className="flex justify-center items-center gap-1 text-gray-800 hover:underline hover:text-blue-700">
                Project on Github
                <RiGithubFill />
              </div>
            </Link>
          </div>
          {user ? (
            <div className="flex flex-col justify-center items-center gap-1">
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
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xl font-bold text-blue-500 hover:text-blue-700"
            >
              Login or Signup
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
