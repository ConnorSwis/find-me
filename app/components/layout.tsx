export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-white font-mono p-10 text-black">
      <main>{children}</main>
    </div>
  );
}
