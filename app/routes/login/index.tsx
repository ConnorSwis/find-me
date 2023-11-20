// app/routes/login.tsx
import { useEffect, useRef, useState } from "react";
import { Layout } from "~/components/layout";
import { FormField } from "~/routes/login/components/form-field";
import { useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { getUser, login, register } from "~/utils/auth.server";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateUsername,
} from "~/utils/validators.server";
import type { IsValid } from "~/utils/types.server";
import Logo from "~/components/logo";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action") as string;
  let email = form.get("email") as string;
  const password = form.get("password") as string;
  const confirmPassword = form.get("confirmPassword") as string;
  let username = form.get("username") as string;
  if (!username) username = "";

  let errors: { [index: string]: IsValid } = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (action === "login") {
    if (errors.email.length > 0) {
      username = email;
      email = "";
      errors.email = validateUsername(username);
    }
  } else {
    errors.confirmPassword = validateConfirmPassword(password, confirmPassword);
    errors.username = validateUsername(username);
  }

  if (
    Object.values(errors).filter((value: IsValid) => {
      return value.length > 0;
    }).length > 0
  ) {
    return json(
      {
        errors,
        fields: { email, password, username },
        form: action,
      },
      { status: 400 }
    );
  }
  switch (action) {
    case "login":
      return await login({ email, password, username });
    case "register":
      return await register({ email, password, username });
    default:
      return json(
        {
          errors: `Invalid form data.`,
          fields: { email, password, username },
          form: action,
        },
        { status: 400 }
      );
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/home") : null;
};

export default function Login() {
  const actionData = useActionData();
  const firstLoad = useRef(true);
  const [formError, setFormError] = useState(actionData?.error ?? "");
  const [errors, setErrors] = useState(actionData?.errors);
  const [action, setAction] = useState(actionData?.form || "login");
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email ?? "",
    password: actionData?.fields?.password ?? "",
    confirmPassword: actionData?.fields?.confirmPassword ?? "",
    username: actionData?.fields?.username ?? "",
  });

  useEffect(() => {
    if (!firstLoad.current) {
      const newState = {
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
      };
      setErrors(newState);
      setFormData(newState);
      setFormError("");
    }
  }, []);

  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("");
    }
  }, [formData]);

  useEffect(() => {
    firstLoad.current = false;
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full h-full p-3 -mt-20 gap-y-4">
        <button
          onClick={() => setAction(action == "login" ? "register" : "login")}
          className="absolute px-3 py-2 mt-2 font-semibold text-white transition duration-100 ease-in bg-blue-600 rounded-md top-8 right-8 hover:bg-blue-500"
        >
          {action === "login" ? "Sign Up" : "Sign In"}
        </button>

        <div className="w-full max-w-2xl p-6 px-24 rounded-md">
          <Logo />

          <form
            method="post"
            className="flex flex-col items-center justify-center w-full mt-4"
          >
            <p className="w-full p-1 font-semibold text-center text-white">
              {action === "login"
                ? "Log in so others can find you!"
                : "Sign up to get started!"}
            </p>

            <p
              className={
                "w-full p-2 text-sm text-center text-red-500 " +
                (formError.length > 0 ? "opacity-100" : "opacity-0")
              }
            >
              {formError.length > 0 ? formError : "."}
            </p>
            <div className="flex flex-col items-center justify-center w-full gap-2">
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
                <>
                  <FormField
                    htmlFor="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange(e, "confirmPassword")}
                    error={errors?.confirmPassword}
                  />
                  <FormField
                    htmlFor="username"
                    label="Userame"
                    value={formData.username}
                    onChange={(e) => handleInputChange(e, "username")}
                    error={errors?.username}
                  />
                </>
              ) : null}
            </div>
            <div className="w-full text-center">
              <button
                type="submit"
                name="_action"
                value={action}
                className="px-3 py-2 mt-2 font-semibold transition duration-100 ease-in-out bg-blue-600 rounded-xl text-slate-100 hover:bg-blue-500"
              >
                {action === "login" ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
