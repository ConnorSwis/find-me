import type { User } from "@prisma/client";
import { Link } from "@remix-run/react";
import SignOutButton from "~/components/sign-out-button";

export function UserPanel({ users }: { users: User[] }) {
  return (
    <div className="w-1/6 bg-slate-200 flex flex-col">
      <div className="text-center bg-slate-300 h-20 flex items-center justify-center">
        <h2 className="text-xl text-blue-600 font-semibold">My Team</h2>
      </div>
      <div className="flex-1 overflow-y-scroll p-4 flex flex-col gap-y-10 text-blue-600 hover:text-blue-800">
        {users.map((user) => {
          return <Link to={`/@${user.username}`} key={user.id}>{user.username}</Link>;
        })}
      </div>
      <div className="text-center p-6 bg-slate-300">
        <SignOutButton>
          <button className="rounded-xl mt-2 px-3 py-2 font-semibold transition duration-100 ease-in-out text-slate-100 bg-blue-600 hover:bg-blue-500">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
