import type { Link } from "@prisma/client";
import { prisma } from "./prisma.server";
import type { RegisterForm } from "./types.server";
import bcrypt from "bcryptjs";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: user.email.toLowerCase(),
      password: passwordHash,
      username: user.username.toLowerCase(),
    },
    select: { id: true, email: true, username: true, links: true },
  });

  return newUser;
};

export const getOtherUsers = async (userId: string) => {
  if (userId) {
    return await prisma.user.findMany({
      where: {
        id: { not: userId },
      },
      orderBy: {
        username: "asc",
      },
      select: { id: true, email: true, username: true, links: true },
    });
  }
};

export const getUserByUsername = async (
  username: string,
  matchCase: boolean = true
): Promise<{ id: string; username: string; links: Link[] }> => {
  return (
    await prisma.user.findMany({
      where: {
        username: matchCase
          ? username
          : { equals: username, mode: "insensitive" },
      },
      select: { id: true, username: true, links: true },
    })
  )[0];
};

export const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, username: true, links: true },
  });
};

export const deleteUser = async (userId: string) => {
  return await prisma.user.delete({
    where: { id: userId },
    select: { id: true, email: true, username: true, links: true },
  });
};
