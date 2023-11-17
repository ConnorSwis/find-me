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
    <div className="flex flex-col justify-start items-center w-full max-w-4xl outline mx-auto min-h-screen p-24">
      <button className="absolute top-8 left-8">
        <Link to="/home">
          <Logo />
        </Link>
      </button>
      <div className="flex flex-col justify-center items-center p-12 gap-6">
        <h2 className="text-5xl ">@{username}</h2>
        <ul>
          {links.map((link: _Link) => {
            return (
              <li key={link.id} className="text-lg flex gap-2">
                -{" "}
                <Link
                  to={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:text-blue-800"
                  style={{
                    color: colors.blue["500"],
                  }}
                >
                  {link.title}
                  {/* <RiExternalLinkFill /> */}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
