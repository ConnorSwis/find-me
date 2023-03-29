import { prisma } from "./prisma.server";
import type { RegisterForm } from "./types.server";
import bcrypt from "bcryptjs";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      username: user.username,
    },
  });

  return { id: newUser.id, email: user.email };
};

export const getOtherUsers = async (userId: string) => {
  return await prisma.user.findMany({
    where: {
      id: { not: userId },
    },
    orderBy: {
      username: "asc",
    },
  });
};

export const getUserByUsername = async (username: string) => {
  return (
    await prisma.user.findMany({
      where: { username: username },
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
