import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const getSavedTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
};

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getSavedTheme);

  useEffect(() => {
    const htmlElement = document.documentElement;

    htmlElement.classList.remove("dark", "light");
    htmlElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  return { theme, handleThemeChange };
};

export default useTheme;
