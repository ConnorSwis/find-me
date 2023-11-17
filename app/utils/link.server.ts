import type { User } from "@prisma/client";
import { prisma } from "./prisma.server";
import type { NewLinkFormType } from "./types.server";

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

export async function addLink(newLink: NewLinkFormType) {
  const { title, url, authorId } = newLink;
  return await prisma.link.create({
    data: {
      title: title,
      url: url,
      author: { connect: { id: authorId } },
    },
  });
}

export async function deleteLink(linkId: string) {
  return await prisma.link.delete({
    where: {
      id: linkId,
    },
  });
}

export async function getLinkById(linkId: string) {
  return await prisma.link.findUnique({ where: { id: linkId } });
}
