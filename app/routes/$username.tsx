import type { Link } from "@prisma/client";
import type { LoaderFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserByUsername } from "~/utils/user.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { username } = params;
  if (/^@/.test(username as string)) {
    const pageUser = await getUserByUsername((username as string).split('@')[1]);
    return json(pageUser);
  }
  return redirect('/error')
};

export default function UserPage() {
  const pageUser: { id: string; username: string; links: Link[] } =
    useLoaderData();
  return (
    <div className="flex flex-col">
      <h2 className="text-5xl">@{pageUser.username}</h2>
      <ul>
        {pageUser.links.map((link) => {
          return (
            <li key={link.id}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a></li>
          );
        })}
      </ul>
    </div>
  );
}
