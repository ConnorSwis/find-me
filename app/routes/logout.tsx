import { LoaderFunction, redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await logout(request);
  return redirect("/");
};
