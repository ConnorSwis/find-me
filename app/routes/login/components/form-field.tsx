import { useEffect, useState } from "react";

interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  onChange?: (...args: any) => any;
  error?: string;
}

export function FormField({
  htmlFor,
  label,
  type = "text",
  value,
  onChange = () => {},
  error = "",
}: FormFieldProps) {
  const [errorText, setErrorText] = useState(error);
  useEffect(() => {
    setErrorText(error);
  }, [error]);
  return (
    <div className="inline-flex flex-col w-full max-w-sm ">
      <label htmlFor={htmlFor} className="font-semibold text-blue-600">
        {label}
      </label>
      <input
        onChange={(e) => {
          onChange(e);
          setErrorText("");
        }}
        type={type}
        id={htmlFor}
        name={htmlFor}
        className="w-full p-4 my-2 text-white outline-none rounded-xl bg-zinc-900 focus:border-blue-500"
        value={value}
      />
      <div className="w-full text-xs font-semibold tracking-wide text-center text-red-500">
        &nbsp;
        {errorText || ""}
      </div>
    </div>
  );
}
