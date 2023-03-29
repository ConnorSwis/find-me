import type { Link } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const users = await getOtherUsers(userId);
  console.log(user)
  return json({ users, user });
};

export default function Home() {
  const { users } = useLoaderData();
  return (
    <Layout>
      <div className="h-full flex">
        <UserPanel users={users} />
        <div className="flex-1"></div>
        <ul>
          {users.links?.map((link: Link) => {
            return <li key={link.title}>{link.title}</li>;
          })}
        </ul>
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
