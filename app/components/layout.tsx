import SignOutButton from "./sign-out-button";

export function Layout({
  children,
  isSignedIn,
}: {
  children: React.ReactNode;
  isSignedIn?: boolean;
}) {
  return (
    <div className="flex items-center justify-center w-full max-w-4xl min-h-screen mx-auto font-mono text-black">
      {children}
      {isSignedIn && <SignOutButton />}
    </div>
  );
}
