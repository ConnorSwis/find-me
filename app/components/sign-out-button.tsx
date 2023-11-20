import type { ReactNode } from "react";

export default function SignOutButton({ children }: { children?: ReactNode }) {
  return (
    <form action="/logout" method="post">
      <button
        type="submit"
        className="absolute p-3 px-3 py-2 text-xl text-white duration-200 bg-blue-700 border-b-4 rounded-md shadow top-6 right-6 transition-color hover:text-blue-700 hover:bg-white hover:shadow-inner border-b-blue-900 hover:border-b-gray-300"
      >
        Sign Out
      </button>
    </form>
  );
}
