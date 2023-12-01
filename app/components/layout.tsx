import SignOutButton from "./sign-out-button";

export function Layout({
  children,
  isSignedIn,
}: {
  children: React.ReactNode;
  isSignedIn?: boolean;
}) {
  return (
    <div className="flex items-center justify-center w-full max-w-3xl min-h-screen font-mono text-black md:mx-auto ">
      {children}
      {isSignedIn && <SignOutButton />}
    </div>
  );
}
