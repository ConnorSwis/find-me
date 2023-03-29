import type { ActionFunction } from "@remix-run/node";
import { getUserId, requireUserId } from "~/utils/auth.server";
import { redirect } from "@remix-run/node";
import { addLink } from "~/utils/link.server";

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);
  const userId = (await getUserId(request)) as string;
  await addLink(userId);
  return redirect('/home');
};
