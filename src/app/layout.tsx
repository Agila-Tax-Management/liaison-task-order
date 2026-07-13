import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agila Liaison Internal",
  description: "Task Order Management System",
  icons: {
    icon: "/images/icon.webp",
    shortcut: "/images/icon.webp",
    apple: "/images/icon.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen flex-col">
          {/* Sticky Header */}
          <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center">
                  <img 
                    src="/images/agila_logo.webp" 
                    alt="Agila Logo" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-navy-900">
                    Agila Liaison Internal
                  </h1>
                  <p className="text-xs text-slate-500">
                    Task Order Management System
                  </p>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1">{children}</main>
          
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
              © {new Date().getFullYear()} Agila Liaison Internal — Task Order Management System
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}