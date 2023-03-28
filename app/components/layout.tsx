export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-slate-900 font-mono p-10 text-white">
      <main>{children}</main>
    </div>
  );
}
