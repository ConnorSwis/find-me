import type { Link } from "@prisma/client";
import { prisma } from "./prisma.server";
import { getUserById } from "./user.server";

export async function getLinks(userId: string): Promise<Link[] | undefined> {
  return (await getUserById(userId))?.links;
}

export async function addLink(userId: string) {
  const user = await getUserById(userId);
  user?.links.push({ title: "Hello", href: "https://google.com" });
  await prisma.user.update({ where: { id: userId }, data: { ...user } });
}
