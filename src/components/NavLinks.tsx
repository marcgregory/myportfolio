import { Button } from "./ui/button";
import { motion } from "motion/react";
import { navlinks } from "@/utils/pageNames";
import type { NavLinksProps } from "@/types/types";
import ThemeToggle from "./ThemeToggle";
import { scrollToSection } from "@/utils/scrollToSection";
import { useState } from "react";

const NavLinks = ({
  isMenuOpen,
  toggleMenu,
  setIsOpenMenu,
  onChangeTheme,
  isMobile,
}: NavLinksProps) => {
  const [activeLink, setActiveLink] = useState("");
  const handleNavLinkClick = (name: string) => {
    if (name === "Hire me") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    scrollToSection(name);
    setActiveLink(name);
    setIsOpenMenu?.(false);
  };
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:relative md:flex items-center space-x-8">
        {navlinks.map((name, index) => (
          <Button
            key={index}
            variant="ghost"
            className={
              activeLink === name
                ? "text-blue-500 font-bold"
                : "hover:text-blue-500 transition-color text-muted-foreground cursor-pointer"
            }
            onClick={() => {
              handleNavLinkClick?.(name);
            }}
          >
            {name}
          </Button>
        ))}

        <Button
          onClick={() => handleNavLinkClick?.("Hire me")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer animate-pulse text-white"
        >
          Hire me
        </Button>
        {!isMobile && <ThemeToggle onChangeTheme={onChangeTheme} />}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center">
        <Button
          variant="ghost"
          className="cursor-pointer text-white"
          size="icon"
          onClick={toggleMenu}
        >
          {/* <Menu /> */}
          <motion.svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </motion.svg>
        </Button>
      </div>
    </>
  );
};

export default NavLinks;
