import type { User } from "@prisma/client";
import { prisma } from "./prisma.server";
import type { NewLinkForm } from "./types.server";

export async function getLinks(userId: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      links: true,
    },
  });
}

export async function addLink(newLink: NewLinkForm) {
  const { title, url, authorId } = newLink;
  return await prisma.link.create({
    data: {
      title: title,
      url: url,
      author: { connect: { id: authorId } },
    },
  });
}
