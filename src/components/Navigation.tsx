import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import { useScroll } from "@/hooks/useScroll";
import { scrollToSection } from "@/utils/scrollToSection";

interface NavigationProps {
  onChangeTheme?: (theme: "light" | "dark") => void;
}

const links = [
  { label: "About", target: "about" },
  { label: "Projects", target: "projects" },
  { label: "Skills", target: "about" },
  { label: "Blog", target: "projects" },
];

const Navigation = ({ onChangeTheme }: NavigationProps) => {
  const scrolled = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleNavigate = (target: string) => {
    scrollToSection(target);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`nav-reveal fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-slate-900/10 bg-white/78 shadow-[0_14px_38px_rgba(49,64,105,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#050816]/82 dark:shadow-none"
          : "border-slate-900/5 bg-white/42 backdrop-blur-md dark:border-white/5 dark:bg-[#050816]/34"
      }`}
    >
      <div className="site-shell flex h-[76px] items-center justify-between">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="group flex cursor-pointer items-center gap-3 text-left transition duration-300 hover:-translate-y-0.5"
          aria-label="Go to home"
        >
          <span className="text-gradient text-4xl font-black tracking-[-0.08em]">
            MG
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-bold text-foreground dark:text-white">
              Marc Gregory
            </span>
            <span className="block text-xs text-muted-foreground dark:text-slate-400">
              Full-Stack Developer
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handleNavigate(link.target)}
              className="relative cursor-pointer text-sm font-medium text-muted-foreground transition duration-300 hover:-translate-y-0.5 hover:text-teal-700 after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-teal-700 after:transition-all after:duration-300 hover:after:w-full dark:text-slate-300 dark:hover:text-white dark:after:bg-violet-300"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            onClick={() => handleNavigate("contact")}
            className="button-gradient h-11 rounded-lg px-5 text-sm font-bold text-white hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,118,110,0.24)] dark:hover:shadow-[0_18px_42px_rgba(124,58,237,0.46)]"
          >
            Hire Me
          </Button>
          <ThemeToggle onChangeTheme={onChangeTheme} />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-foreground dark:text-white md:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="mobile-nav-reveal border-t border-slate-900/10 bg-white/92 px-4 py-5 backdrop-blur-2xl dark:border-white/10 dark:bg-[#070b1d]/96 md:hidden">
          <div className="site-shell grid gap-2">
            {links.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavigate(link.target)}
                className="cursor-pointer rounded-lg px-3 py-3 text-left text-sm font-semibold text-muted-foreground transition duration-300 hover:bg-teal-50 hover:text-teal-700 dark:text-slate-200 dark:hover:bg-white/[0.07] dark:hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => handleNavigate("contact")}
              className="button-gradient mt-2 h-11 rounded-lg text-white hover:-translate-y-0.5"
            >
              Hire Me
            </Button>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-900/10 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
              <span className="text-sm font-semibold text-muted-foreground dark:text-slate-300">Theme</span>
              <ThemeToggle onChangeTheme={onChangeTheme} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
