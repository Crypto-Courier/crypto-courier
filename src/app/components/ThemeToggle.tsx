"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="flex items-center justify-between w-16 h-8 p-1 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      role="button"
      aria-label="Toggle dark mode"
    >
      <div
        className={`flex items-center justify-center w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
          theme === "dark" ? "transform translate-x-8 bg-gray-800" : "bg-white"
        }`}
      >
        {theme === "dark" ? (
          <MoonIcon size={14} className="text-white" />
        ) : (
          <SunIcon size={14} className="text-yellow-500" />
        )}
      </div>
    </div>
  );
}
