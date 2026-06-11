// src/app/components/Header.tsx
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDark = () => setDarkMode(!darkMode);

  return (
    <header className="bg-primary text-surface shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold hover:text-accent transition-colors">
            EdTech Korea Fair 2026
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/companies" className="hover:text-accent transition-colors">
              Companies
            </Link>
            <Link href="/sessions" className="hover:text-accent transition-colors">
              Sessions
            </Link>
            <Link href="/dashboard" className="hover:text-accent transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
        <button
          onClick={toggleDark}
          className="bg-secondary text-surface px-3 py-1 rounded-md hover:bg-accent transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </header>
  );
}
