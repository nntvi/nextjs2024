import type { Metadata } from "next";

export default function LayoutAuth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h1>Auth nè</h1>
      {children}
    </div>
  );
}
