import React from 'react';

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-bold">
            Site
          </a>
          <div className="flex items-center gap-6">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/posts" className="hover:underline">
              Blog
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} — Built with Payload CMS &amp; Next.js
        </div>
      </footer>
    </div>
  );
}
