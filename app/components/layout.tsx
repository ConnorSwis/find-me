export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto flex items-center justify-center font-mono text-black">
      {children}
    </div>
  );
}
