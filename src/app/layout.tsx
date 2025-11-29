import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/Providers"; // 👈 خدي بالك من الباث

export const metadata: Metadata = {
  title: "Project Dashboard",
  description: "Assessment Task Project Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
