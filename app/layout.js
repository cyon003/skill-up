import "./globals.css";
import { Navbar } from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f5f7fb] text-slate-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
