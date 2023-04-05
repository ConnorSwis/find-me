import type { Link as _Link } from "@prisma/client";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/routes/home/components/user-panel";
import { getUser, requireUserId } from "~/utils/auth.server";
import { addLink, deleteLink } from "~/utils/link.server";
import type { IsValid } from "~/utils/types.server";
import { getOtherUsers } from "~/utils/user.server";
import { validateNewLinkTitle, validateUrl } from "~/utils/validators.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const users = await getOtherUsers(userId);
  return json({ users, user });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  let formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData.entries());

  if (_action == "create") {
    const title = values.title?.toString();
    let url = values.url?.toString();
    const errors = {
      title: validateNewLinkTitle(title),
      url: validateUrl(url),
    };
    if (errors.url) {
      errors.url = validateUrl(`https://${url}`);
      if (!errors.url) {
        url = `https://${url}`;
        errors.url = undefined;
      }
    }
    if (
      Object.values(errors).filter((value: IsValid) => {
        return value;
      }).length
    ) {
      return json(
        {
          errors,
          fields: {
            form: _action,
            title,
            url,
          },
        },
        { status: 400 }
      );
    }
    return await addLink({
      title,
      url,
      authorId: userId,
    });
  } else if (_action == "delete") {
    return json(await deleteLink(values.linkId?.toString()));
  } else {
    return json({ fields: { form: _action, ...values } }, { status: 404 });
  }
};

export default function Home() {
  const { users, user } = useLoaderData();

  let formRef = useRef<HTMLFormElement>(null);
  let titleRef = useRef<HTMLInputElement>(null);

  let transition = useNavigation();
  let isCreating =
    transition.state === "submitting" &&
    transition.formData.get("_action") === "create";

  useEffect(() => {
    if (!isCreating) {
      formRef.current?.reset();
      titleRef.current?.focus();
    }
  }, [isCreating]);
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
          <ul className="flex flex-col">
            {user.links?.map((link: _Link) => {
              return link.url ? (
                <li
                  style={{
                    opacity:
                      transition.formData?.get("linkId") === link.id ? 0.25 : 1,
                  }}
                  className="flex justify-between transition duration-100 ease-out hover:bg-slate-300 p-1 m-1 px-2 rounded-md"
                  key={link.id}
                >
                  {link.title}
                  <Link to={link.url} target="_blank">
                    {link.url}
                  </Link>
                  <Form replace method="post">
                    <input name="linkId" type="hidden" value={link.id} />
                    <button
                      type="submit"
                      className="bg-red-600 text-white font-bold px-2 pb-1 rounded-full "
                      name="_action"
                      value="delete"
                    >
                      x
                    </button>
                  </Form>
                </li>
              ) : null;
            })}
            <li>
              <Form
                ref={formRef}
                action="/home"
                method="post"
                className="bg-slate-300 p-3 rounded-md"
              >
                <input
                  type="text"
                  name="title"
                  ref={titleRef}
                  placeholder="Title"
                  className="px-2"
                />{" "}
                <input
                  type="text"
                  name="url"
                  placeholder="Link"
                  className="px-2"
                />{" "}
                <button
                  type="submit"
                  name="_action"
                  value="create"
                  className="bg-blue-500 text-slate-100 font-bold text-xl rounded-full px-3 pb-1 "
                >
                  {isCreating ? <p className="animate-spin">+</p> : "+"}
                </button>
              </Form>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
