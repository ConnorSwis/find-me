import { prisma } from "./prisma.server";
import type { LoginForm, RegisterForm } from "./types.server";
import { json, createCookieSessionStorage, redirect } from "@remix-run/node";
import { createUser } from "./users.server";
import bcrypt from "bcryptjs";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("Environment variable SESSION_SECRET must be set.");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "findme-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const register = async (form: RegisterForm) => {
  const emailExists = await prisma.user.count({
    where: { email: { equals: form.email, mode: "insensitive" } },
  });
  if (emailExists) {
    return json(
      { error: `User already exists with that email.` },
      { status: 400 }
    );
  }
  const usernameExists = await prisma.user.count({
    where: { username: { equals: form.username, mode: "insensitive" } },
  });
  if (usernameExists) {
    return json(
      { error: `User already exists with that username.` },
      { status: 400 }
    );
  }
  const newUser = await createUser(form);
  if (!newUser) {
    return json(
      {
        error: `Something went wrong trying to create new user.`,
        fields: {
          email: form.email,
          password: form.password,
          username: form.username,
        },
      },
      {
        status: 400,
      }
    );
  }

  return createUserSession(newUser.id, "/");
};

export const login = async (form: LoginForm) => {
  let condition = {};
  if (form.email) {
    condition = { email: { equals: form.email, mode: "insensitive" } };
  } else {
    condition = { username: { equals: form.username, mode: "insensitive" } };
  }
  const user = (await prisma.user.findMany({ where: condition }))[0];
  if (!user || !(await bcrypt.compare(form.password, user.password))) {
    return json({ error: `Incorrect login` }, { status: 400 });
  }
  return createUserSession(user.id, "/");
};

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};
