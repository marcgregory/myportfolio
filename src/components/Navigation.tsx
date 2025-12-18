import { motion } from "motion/react";
import NavLinks from "./NavLinks";
import { useScroll } from "@/hooks/useScroll";
import logo from "../assets/avatar.png";
import { useEffect, useState } from "react";

import MobileNavLinks from "./MobileNavLinks";
import ThemeToggle from "./ThemeToggle";

interface NavigationProps {
  onChangeTheme?: (theme: "light" | "dark") => void;
}

const Navigation = ({ onChangeTheme }: NavigationProps) => {
  const scrolled = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    // Function to check window width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // change breakpoint as needed
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300$ ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
      } `}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className=" flex items-center justify-between gap-2"
          >
            <img
              src={logo}
              width={32}
              height={32}
              alt="Logo"
              className="h-8 rounded-full"
            />{" "}
            <span className="bg-gradient-to-r  from-blue-500 to-purple-600 bg-clip-text text-transparent ">
              MarcGregory
            </span>
          </motion.div>
          <NavLinks
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            setIsOpenMenu={setIsMenuOpen}
            onChangeTheme={onChangeTheme}
          />
        </div>
      </div>
      {isMobile && <ThemeToggle onChangeTheme={onChangeTheme} />}
      <MobileNavLinks isMenuOpen={isMenuOpen} setIsOpenMenu={setIsMenuOpen} />
    </motion.div>
  );
};

export default Navigation;
