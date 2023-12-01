import type { Link as _Link } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { RiExternalLinkFill } from "react-icons/ri";
import colors from "tailwindcss/colors";
import Logo from "~/components/logo";
import { getUserByUsername } from "~/utils/user.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { username } = params;
  if (/^@/.test(username as string)) {
    const pageUser = await getUserByUsername(
      (username as string).split("@")[1],
      false
    );
    return json(pageUser);
  }
  return redirect("/error");
};

export default function UserPage() {
  const { username, links } = useLoaderData<typeof loader>();
  return (
    <main className="flex items-center justify-center w-screen min-h-screen">
      <section className="flex flex-col items-center justify-center w-full h-screen gap-6 p-6 text-center text-white md:max-w-2xl">
        <h1 className="text-5xl">@{username}</h1>
        <div className="flex flex-col items-center justify-center w-full gap-4 md:max-w-4/5">
          {links.map(({ id, title, url }: _Link) => (
            <Link
              className="w-full p-3 text-2xl text-center text-white z-[2] duration-200 bg-blue-700 border-b-4 rounded-md shadow transition-all hover:text-blue-700 hover:bg-white hover:shadow-inner border-b-blue-900 hover:border-b-gray-300 active:bg-green-600 active:border-b-green-700 active:text-white"
              to={url}
              key={id}
            >
              {title}
            </Link>
          ))}
        </div>
      </section>
      <div className="fixed mx-auto bottom-6">
        <Logo />
      </div>
    </main>
  );
}
