// app/routes/login.tsx
import { useEffect, useRef, useState } from "react";
import { Layout } from "~/components/layout";
import { FormField } from "~/components/form-field";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { login, register } from "~/utils/auth.server";
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

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    username: validateUsername(username),
  };
  console.log(errors);
  if (action === "login" && errors.email) {
    username = email;
    email = "";
    errors.email = true;
  }
  console.log(errors);
  if (
    // Check if any results from validation are `true` and not a non-empty string
    Object.values(errors).filter(
      (value) => typeof value === "boolean" && value === true
    ).length
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

export default function Login() {
  const actionData = useActionData();
  const firstLoad = useRef(true);
  const [formError, setFormError] = useState(actionData?.errors || "");
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
          className="absolute top-8 right-8 rounded-xl mt-2 bg-red-600 px-3 py-2 text-gray-800 font-semibold transition duration-100 ease-in-out hover:bg-red-500"
        >
          {action === "login" ? "Sign Up" : "Sign In"}
        </button>
        <h2 className="text-5xl font-extrabold text-red-600">find.me</h2>
        <p className="font-semibold text-slate-300">
          {action === "login"
            ? "Log in so others can find you!"
            : "Sign up to get started!"}
        </p>

        <Form method="post" className="rounded-2xl bg-gray-800 p-6 w-96">
          <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
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
              className="rounded-xl mt-2 px-3 py-2 font-semibold transition duration-100 ease-in-out text-gray-800 bg-red-600 hover:bg-red-500"
            >
              {action === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
