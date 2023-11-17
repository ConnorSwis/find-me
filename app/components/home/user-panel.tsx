import type { User } from "@prisma/client";
import { Link } from "@remix-run/react";
import SignOutButton from "~/components/sign-out-button";

export function UserPanel({ users }: { users: User[] }) {
  return (
    <div className="w-1/6 bg-slate-200 flex flex-col">
      <div className="text-center bg-slate-300 h-20 flex items-center justify-center">
        <h2 className="text-xl text-blue-600 font-semibold">Other Fellas</h2>
      </div>
      <div className="flex-1 overflow-y-scroll p-4 flex flex-col">
        {users.map((user) => {
          return (
            <Link
              to={`/@${user.username}`}
              key={user.id}
              className="text-blue-600 rounded-md p-3 transition duration-100 ease-out hover:bg-slate-300"
            >
              {user.username}
            </Link>
          );
        })}
      </div>
      <div className="text-center p-6 bg-slate-300">
        <SignOutButton />
      </div>
    </div>
  );
}
