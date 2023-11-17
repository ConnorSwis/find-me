import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Modal } from "~/components/home/modal";
import { getLinkById } from "~/utils/link.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { linkId } = params;
  if (typeof linkId !== "string") return redirect("/");
  const link = await getLinkById(linkId);
  return json({ link });
};

export default function LinkModal() {
  const { link } = useLoaderData();
  return <Modal isOpen={true} className="p-10">
    {link.id}
  </Modal>;
}
