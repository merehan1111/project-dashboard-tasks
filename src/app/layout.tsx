import "./globals.css";
import Providers from "@/providers/Providers";
import type { ReactNode } from "react";

export const metadata = {
  title: "Project Dashboard",
  description: "Feature-rich project dashboard web app"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
