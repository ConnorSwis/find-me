// app/routes/login.tsx
import { useEffect, useRef, useState } from "react";
import { Layout } from "~/components/layout";
import { FormField } from "~/components/form-field";
import { useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { getUser, login, register } from "~/utils/auth.server";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "~/utils/validators.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action") as string;
  let email = form.get("email") as string;
  const password = form.get("password") as string;
  let username = form.get("username") as string;
  if (!username) username = "";
  console.log("login.tsx: " + password);

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    username: validateUsername(username),
  };
  if (action === "login") {
    errors.username = true;
    if (errors.email && email.length) {
      username = email;
      email = "";
      errors.email = true;
    }
  }
  if (
    // Check if any results from validation are `true` and not a non-empty string
    Object.values(errors).filter((value) => typeof value !== "boolean").length
  ) {
    return json({ errors: { ...errors }, form: action }, { status: 400 });
  }
  switch (action) {
    case "login":
      return await login({ email, password, username });
    case "register":
      return await register({ email, password, username });
    default:
      return json(
        { errors: `Invalid form data.`, form: action },
        { status: 400 }
      );
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/") : null;
};

export default function Login() {
  const actionData = useActionData();
  const firstLoad = useRef(true);
  const [formError, setFormError] = useState(actionData?.error || "");
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [action, setAction] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  useEffect(() => {
    if (!firstLoad.current) {
      const newState = {
        email: "",
        password: "",
        username: "",
      };
      setErrors(newState);
      setFormError("");
      setFormData(newState);
    }
  }, [action]);
  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("");
    }
  }, [formData]);
  useEffect(() => {
    firstLoad.current = false;
  }, []);
  useEffect(() => {
    setErrors(actionData?.errors);
  }, [actionData?.errors]);
  useEffect(() => {
    setFormError(actionData?.error);
  }, [actionData?.error]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Layout>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <button
          onClick={() => setAction(action == "login" ? "register" : "login")}
          className="absolute top-8 right-8 rounded-xl mt-2 text-gray-100 bg-blue-600 px-3 py-2 font-semibold transition duration-100 ease-in-out hover:bg-blue-500"
        >
          {action === "login" ? "Sign Up" : "Sign In"}
        </button>
        <h2 className="text-5xl font-extrabold text-blue-600">find.me</h2>
        <p className="font-semibold ">
          {action === "login"
            ? "Log in so others can find you!"
            : "Sign up to get started!"}
        </p>

        <form
          method="post"
          className="rounded-2xl bg-gray-100 p-6 w-96 shadow-lg"
        >
          <div className="text-sm font-semibold text-center tracking-wide text-blue-500 w-full pb-2">
            &nbsp;
            {formError}
          </div>
          <FormField
            htmlFor="email"
            label={action === "login" ? "Email/Username" : "Email"}
            value={formData.email}
            onChange={(e) => handleInputChange(e, "email")}
            error={errors?.email}
          />
          <FormField
            htmlFor="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            error={errors?.password}
          />
          {action !== "login" ? (
            <FormField
              htmlFor="username"
              label="Userame"
              value={formData.username}
              onChange={(e) => handleInputChange(e, "username")}
              error={errors?.username}
            />
          ) : null}
          <div className="w-full text-center">
            <button
              type="submit"
              name="_action"
              value={action}
              className="rounded-xl mt-2 px-3 py-2 font-semibold transition duration-100 ease-in-out text-gray-100 bg-blue-600 hover:bg-blue-500"
            >
              {action === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
