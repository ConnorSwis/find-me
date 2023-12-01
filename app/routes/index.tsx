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
    <Layout isSignedIn={!!user}>
      <div className="flex flex-col items-center justify-center w-full p-6 rounded-md bg-zinc-900">
        <Logo />
        {/* <hr className="w-2/3 h-px m-4 border-0 rounded-full bg-zinc-300" /> */}
        <div className="flex flex-col items-center justify-center w-full gap-8 p-6">
          {user ? (
            <>
              <Link
                to={`/@${user.username}`}
                className="w-full text-3xl text-center text-blue-600 transition-colors hover:text-white"
              >
                @{user.username}
              </Link>
              <hr className="w-2/3 h-px border-0 rounded-full bg-zinc-300" />
              <Link
                to="/home"
                className="w-2/3 p-3 px-5 text-2xl text-center text-white duration-200 bg-blue-700 border-b-4 rounded-md shadow transition-color hover:text-blue-700 hover:bg-white hover:shadow-inner border-b-blue-900 hover:border-b-gray-300 "
              >
                Home
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="p-3 mt-4 text-xl text-white duration-200 bg-blue-700 border-b-4 rounded-md shadow transition-color hover:text-blue-700 hover:bg-white hover:shadow-inner border-b-blue-900 hover:border-b-gray-300"
            >
              Login or Signup
            </Link>
          )}
          <div className="flex flex-col items-center justify-center text-sm text-white">
            <p>Created by ConnorSwis</p>
            <Link
              to="https://github.com/ConnorSwis/find-me"
              target="_blank"
              className="flex items-center justify-center gap-2 text-gray-200 hover:underline hover:text-blue-700"
            >
              Project on Github
              <RiGithubFill />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
