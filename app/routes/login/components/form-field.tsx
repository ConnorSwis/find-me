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
    <div className="inline-flex flex-col max-w-sm w-full ">
      <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
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
        className="w-full p-4 rounded-xl my-2 bg-zinc-900 outline-none text-white focus:border-blue-500"
        value={value}
      />
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
        &nbsp;
        {errorText || ""}
      </div>
    </div>
  );
}
