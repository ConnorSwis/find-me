import { json } from "@remix-run/node";
import { useEffect, useRef } from "react";
import { Layout } from "~/components/layout";
import type { Link as _Link } from "@prisma/client";
import colors from "tailwindcss/colors";
import type { IsValid } from "~/utils/types.server";
import { getOtherUsers } from "~/utils/user.server";
import { addLink, deleteLink } from "~/utils/link.server";
import { getUser, requireUserId } from "~/utils/auth.server";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { validateNewLinkTitle, validateUrl } from "~/utils/validators.server";
import Logo from "~/components/logo";

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
        errors.url = "";
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
  const { user } = useLoaderData();

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
    <Layout isSignedIn={!!user}>
      <div className="flex flex-col justify-start w-full max-w-4xl min-h-screen p-8 md:-mt-20 first-letter md:justify-center">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          <Logo />
          <Link to={"/@" + user.username} className="text-blue-600">
            <h1 className="text-5xl text-center w-ful">@{user.username}</h1>
          </Link>
        </div>
        <ul className="flex flex-col gap-2 p-2 mt-10 text-sm text-white bg-black bg-opacity-10 md:text-lg">
          {user.links?.map((link: _Link, index: number) => {
            return link.url ? (
              <li
                style={{
                  opacity:
                    transition.formData?.get("linkId") === link.id ? 0.25 : 1,
                }}
                className={
                  "flex justify-between transition duration-100 ease-out bg-black gap-1  p-2  px-2  " +
                  (index % 2 === 0 ? "bg-opacity-30" : "bg-opacity-20")
                }
                key={link.id}
              >
                <h3 className="w-[25ch] md:w-auto overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {link.title}
                </h3>
                <Link
                  to={link.url}
                  target="_blank"
                  className="w-[25ch] md:w-auto overflow-hidden overflow-ellipsis whitespace-nowrap"
                >
                  {link.url}
                </Link>
                <Form replace method="post">
                  <input name="linkId" type="hidden" value={link.id} />
                  <button
                    type="submit"
                    className="px-2 pb-1 font-bold text-white bg-red-600 "
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
              className="flex flex-col justify-between gap-6 p-3 md:flex-row bg-zinc-800"
              style={{ opacity: isCreating ? 0.25 : 1 }}
            >
              <input
                type="text"
                name="title"
                ref={titleRef}
                placeholder="Title"
                className="w-full p-2 px-2 text-white outline-none bg-zinc-900"
              />{" "}
              <input
                type="text"
                name="url"
                placeholder="Link"
                className="w-full p-2 px-2 text-white outline-none bg-zinc-900"
              />{" "}
              <button
                type="submit"
                name="_action"
                value="create"
                className="px-3 pb-1 text-xl font-bold text-white bg-blue-500 "
              >
                {" "}
                <p>+</p>
              </button>
            </Form>
          </li>
        </ul>
      </div>
    </Layout>
  );
}
