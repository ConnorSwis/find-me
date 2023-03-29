import type { Link as _Link } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const users = await getOtherUsers(userId);
  console.log({ user });
  return json({ users, user });
};

export default function Home() {
  const { users, user } = useLoaderData();
  return (
    <Layout>
      <div className="h-full flex">
        <UserPanel users={users} />
        <div className="p-10 flex flex-wrap justify-center bg-gray-100">
          <h1 className="text-5xl w-full">
            Welcome back,{" "}
            <Link to={"/" + user.username} className="text-blue-500">
              @{user.username}
            </Link>
          </h1>
          <ul className="list-disc">
            {user.links?.map((link: _Link) => {
              return (
                <li key={link.title}>
                  <Link to={link.href} target="_blank">
                    {link.title}
                  </Link>
                </li>
              );
            })}
            <li>
              <form action="/links/new" method="post" className="bg-gray-300 p-3 rounded-md">
                <input
                  type="text"
                  name="title"
                  id="newTitle"
                  placeholder="Title"
                />
                <input type="url" name="url" id="newUrl" placeholder="Link" />
                <input type="submit" value="+" className="bg-blue-500 text-gray-100 rounded-full py-1 px-2" />
              </form>
            </li>
          </ul>
        </div>
      </div>
      {/* <div className="h-full flex flex-col">
        <form action="/link/new" method="post">
          <button type="submit">
            New Link
          </button>
        </form>
      </div> */}
    </Layout>
  );
}
