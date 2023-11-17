export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto  font-mono text-black">
      {children}
    </div>
  );
}
