export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-slate-200 font-mono text-black">
      {children}
    </div>
  );
}
