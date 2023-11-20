import { prisma } from "./prisma.server";
import type { LoginForm, RegisterForm } from "./types.server";
import { json, createCookieSessionStorage, redirect } from "@remix-run/node";
import { createUser } from "./user.server";
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
  const { email, username } = form;
  const emailExists = await prisma.user.count({
    where: { email: email.toLowerCase() },
  });
  if (emailExists) {
    return json(
      { error: `User already exists with that email.`, fields: { ...form } },
      { status: 400 }
    );
  }
  const usernameExists = await prisma.user.count({
    where: { username: username.toLowerCase() },
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
          ...form,
        },
        form: "register",
      },
      {
        status: 400,
      }
    );
  }

  return createUserSession(newUser.id, "/home");
};

export const login = async (form: LoginForm) => {
  const { email, password, username } = form;
  let condition = {};
  if (email) {
    condition = { email: email.toLowerCase() };
  } else {
    condition = { username: username.toLowerCase() };
  }
  const user = await prisma.user.findUnique({
    where: condition,
    select: { id: true, password: true },
  });

  user;
  if (!user) {
    return json(
      { error: `User does not exist`, fields: { ...form }, form: "login" },
      { status: 400 }
    );
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return json(
      { error: `Incorrect login`, fields: { ...form }, form: "login" },
      { status: 400 }
    );
  }
  return createUserSession(user.id, "/home");
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

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, links: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
