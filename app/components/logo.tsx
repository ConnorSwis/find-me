import { Link } from "@remix-run/react";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center justify-center p-3 font-mono text-6xl text-white bg-blue-700 rounded-md"
    >
      Find.Me
    </Link>
  );
}
