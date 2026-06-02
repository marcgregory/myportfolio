import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

type Theme = "light" | "dark";

interface ThemeToggleProps {
  onChangeTheme?: (theme: Theme) => void;
  className?: string;
}

const getSavedTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
};

const ThemeToggle = ({ onChangeTheme, className = "" }: ThemeToggleProps) => {
  const [isDark, setIsDark] = useState(() => getSavedTheme() === "dark");

  useEffect(() => {
    // Update document class and localStorage when theme changes
    const theme: Theme = isDark ? "dark" : "light";
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
      className={`relative size-11 overflow-hidden rounded-full border border-slate-900/10 bg-white/75 text-foreground shadow-[0_10px_28px_rgba(49,64,105,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-700/40 hover:bg-teal-50 hover:shadow-[0_14px_34px_rgba(15,118,110,0.18)] dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-[0_0_20px_rgba(124,58,237,0.12)] dark:hover:border-violet-300/40 dark:hover:bg-violet-300/10 dark:hover:shadow-[0_0_30px_rgba(124,58,237,0.28)] ${className}`}
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
        <Sun className="h-5 w-5 text-teal-700 dark:text-yellow-500" />
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
        <Moon className="h-5 w-5 text-teal-700 dark:text-blue-400" />
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
