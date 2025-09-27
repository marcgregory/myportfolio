import { useEffect, useState } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Initialize theme on mount
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") || "dark";
    const htmlElement = document.documentElement;

    htmlElement.classList.remove("dark", "light");
    htmlElement.classList.add(savedTheme);
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
  };

  return { theme, handleThemeChange };
};

export default useTheme;
