import type { ReactNode } from "react";

export default function SignOutButton({ children }: { children?: ReactNode }) {
  return (
    <form action="/logout" method="post">
      <button type="submit">{children}</button>
    </form>
  );
}
