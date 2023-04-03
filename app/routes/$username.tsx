import type { Link as _Link } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { RiExternalLinkFill } from "react-icons/ri";
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
  const { username, links } = useLoaderData();
  return (
    <div className="flex flex-col justify-center items-center">
      <Link to="/home">
        <button className="absolute top-8 left-8"><Logo/></button>
      </Link>

      <h2 className="text-5xl pt-20 -ml-16 pb-5">@{username}</h2>
      <ul>
        {links.map((link: _Link) => {
          return (
            <li key={link.id} className="text-lg flex gap-2">
              - <Link
                to={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <div className="flex flex-row gap-2">
                  {link.title}
                  <RiExternalLinkFill />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
