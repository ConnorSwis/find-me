import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { getUser } from "~/utils/auth.server";
import SignOutButton from "../components/sign-out-button";
import { RiGithubFill } from "react-icons/ri";
import Logo from "~/components/logo";

export const loader: LoaderFunction = async ({ request }) => {
  return json(await getUser(request));
};

export default function Index() {
  const user = useLoaderData();
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-8 p-6 -mt-16 rounded-md bg-zinc-900">
        <Logo />
        <div className="flex flex-col items-center justify-center gap-8">
          {user ? (
            <div className="flex flex-col items-center justify-center gap-1">
              <Link
                to="/home"
                className="p-3 px-5 text-xl text-white duration-200 bg-blue-700 border-b-4 rounded-md shadow transition-color hover:text-blue-700 hover:bg-white hover:shadow-inner border-b-blue-900 hover:border-b-gray-300 "
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
              className="p-3 text-xl text-white duration-200 bg-blue-700 border-b-4 rounded-md shadow transition-color hover:text-blue-700 hover:bg-white hover:shadow-inner border-b-blue-900 hover:border-b-gray-300"
            >
              Login or Signup
            </Link>
          )}
          <div className="flex flex-col items-center justify-center text-sm text-white">
            <p>Created by ConnorSwis</p>
            <Link to="https://github.com/ConnorSwis/find-me" target="_blank">
              <div className="flex items-center justify-center gap-2 text-gray-200 hover:underline hover:text-blue-700">
                Project on Github
                <RiGithubFill />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
