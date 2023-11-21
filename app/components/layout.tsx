import SignOutButton from "./sign-out-button";

export function Layout({
  children,
  isSignedIn,
}: {
  children: React.ReactNode;
  isSignedIn?: boolean;
}) {
  return (
    <div className="flex items-start justify-start w-full max-w-4xl min-h-screen font-mono text-black md:justify-center md:items-center md:mx-auto ">
      {children}
      {isSignedIn && <SignOutButton />}
    </div>
  );
}
