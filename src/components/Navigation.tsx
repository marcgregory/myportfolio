import { motion } from "motion/react";
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
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-[#050816]/82 backdrop-blur-2xl"
          : "border-white/5 bg-[#050816]/34 backdrop-blur-md"
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
            <span className="block text-sm font-bold text-white">
              Marc Gregory
            </span>
            <span className="block text-xs text-slate-400">
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
              className="relative cursor-pointer text-sm font-medium text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-violet-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            onClick={() => handleNavigate("contact")}
            className="button-gradient h-11 rounded-lg px-5 text-sm font-bold text-white hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(124,58,237,0.46)]"
          >
            Hire Me
          </Button>
          <ThemeToggle onChangeTheme={onChangeTheme} />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-white md:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/10 bg-[#070b1d]/96 px-4 py-5 backdrop-blur-2xl md:hidden"
        >
          <div className="site-shell grid gap-2">
            {links.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavigate(link.target)}
                className="cursor-pointer rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-200 transition duration-300 hover:bg-white/[0.07] hover:text-white"
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
            <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="text-sm font-semibold text-slate-300">Theme</span>
              <ThemeToggle onChangeTheme={onChangeTheme} />
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navigation;
