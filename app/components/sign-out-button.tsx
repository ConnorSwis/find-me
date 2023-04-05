import type { ReactNode } from "react";

export default function SignOutButton({ children }: { children?: ReactNode }) {
  return (
    <form action="/logout" method="post">
      <button
        type="submit"
        className="rounded-xl mt-2 px-3 py-2 font-semibold transition duration-100 ease-in-out text-slate-100 bg-blue-600 hover:bg-blue-500"
      >
        Sign Out
      </button>
    </form>
  );
}
