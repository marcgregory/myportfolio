import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

interface ThemeToggleProps {
  onChangeTheme?: (theme: "light" | "dark") => void;
  className?: string;
}

const ThemeToggle = ({ onChangeTheme, className = "" }: ThemeToggleProps) => {
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme");
    // const prefersDark = window.matchMedia(
    //   "(prefers-color-scheme: dark)"
    // ).matches;

    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(true); // Default to dark for this cosmic theme
    }
  }, []);

  useEffect(() => {
    // Update document class and localStorage when theme changes
    const theme = isDark ? "dark" : "light";
    const htmlElement = document.documentElement;

    // Remove existing theme classes
    htmlElement.classList.remove("dark", "light");
    // Add new theme class
    htmlElement.classList.add(theme);

    localStorage.setItem("theme", theme);
    onChangeTheme?.(theme);
  }, [isDark, onChangeTheme]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`absolute top-3.5 right-14 md:top-0 md:-right-3 cursor-pointer  overflow-hidden hover:bg-accent/50 transition-colors ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          rotate: isDark ? 180 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="h-5 w-5 text-yellow-500" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          rotate: isDark ? 0 : -180,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="h-5 w-5 text-blue-400" />
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
