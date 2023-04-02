import type { Link as _Link } from "@prisma/client";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/routes/home/components/user-panel";
import { getUser, requireUserId } from "~/utils/auth.server";
import { addLink } from "~/utils/link.server";
import type { IsValid } from "~/utils/types.server";
import { getOtherUsers } from "~/utils/user.server";
import {
  validateNewLinkTitle,
  validateNewLinkUrl,
} from "~/utils/validators.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const users = await getOtherUsers(userId);
  return json({ users, user });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  let formData = await request.formData();
  let form = Object.fromEntries(formData);
  const title = form.title?.toString() || "";
  const url = form.url?.toString() || "";
  const errors = {
    title: validateNewLinkTitle(title),
    url: validateNewLinkUrl(url),
  };
  if (
    Object.values(errors).filter((value: IsValid) => {
      return value;
    }).length
  ) {
    return json({ errors, fields: { title, url } }, { status: 400 });
  }
  return await addLink({ title, url, authorId: userId });
};

export default function Home() {
  const { users, user } = useLoaderData();

  return (
    <Layout>
      <div className="h-full flex">
        <UserPanel users={users} />
        <div className="p-10 flex flex-wrap justify-center bg-slate-200">
          <h1 className="text-5xl w-full">
            Welcome back,{" "}
            <Link to={"/@" + user.username} className="text-blue-500">
              @{user.username}
            </Link>
          </h1>
          <ul className="flex flex-col gap-2">
            {user.links?.map((link: _Link) => {
              return link.url ? (
                <div className="flex gap-2">
                  <li key={link.title}>
                    <Link to={link.url} target="_blank">
                      {link.title}
                    </Link>
                  </li> {" "}
                  <Form method="post">
                    <button
                      type="submit"
                      className="bg-red-600 text-white font-bold px-2 pb-1 rounded-full"
                    >
                      x
                    </button>
                  </Form>
                </div>
              ) : null;
            })}
            <li>
              <Form
                action="/home"
                method="post"
                className="bg-slate-300 p-3 rounded-md"
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  className="px-2"
                />{" "}
                <input
                  type="url"
                  name="url"
                  placeholder="Link"
                  className="px-2"
                />{" "}
                <button
                  type="submit"
                  name="_action"
                  value="create"
                  className="bg-blue-500 text-slate-100 font-bold text-xl rounded-full px-3 pb-1"
                >
                  +
                </button>
              </Form>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
