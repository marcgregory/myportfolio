import { navlinks } from "@/utils/pageNames";
import { motion } from "motion/react";
import { Button } from "./ui/button";

import { scrollToSection } from "@/utils/scrollToSection";
import type { NavLinksProps } from "@/types/types";
import { useState } from "react";

const MobileNavLinks = ({ isMenuOpen, setIsOpenMenu }: NavLinksProps) => {
  const [activeLink, setActiveLink] = useState("");

  if (!isMenuOpen) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={
        isMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
      }
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md border-t border-border"
    >
      <div className="px-4 py-6 space-y-4">
        {navlinks.map((name, index) => {
          return (
            <Button
              key={index}
              variant="ghost"
              onClick={() => {
                setIsOpenMenu?.(false);
                setActiveLink(name);
                scrollToSection(name);
              }}
              className={
                activeLink === name
                  ? "text-blue-500 font-bold"
                  : `w-full justify-start cursor-pointer hover:text-blue-500 transition-colors text-left`
              }
            >
              {name}
            </Button>
          );
        })}

        <Button
          className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 mt-4"
          onClick={() => {
            scrollTo({ top: 0, behavior: "smooth" });
            setIsOpenMenu?.(false);
            setActiveLink("");
          }}
        >
          Hire Me
        </Button>
      </div>
    </motion.div>
  );
};

export default MobileNavLinks;
