import { useState } from "react";
import { Button } from "./ui/button";
import { scrollToSection } from "../utils/scrollToSection";

const navlinks = ["About", "Projects", "Contact", "Hire me"];

const NavLinks = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navlinks.map((name, index) => (
          <Button
            key={index}
            variant="ghost"
            className={
              name === "Hire me"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer"
                : "hover:text-blue-500 transition-color text-muted-foreground cursor-pointer"
            }
            onClick={() => {
              scrollToSection(name);
            }}
          >
            {name}
          </Button>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden relative">
        <Button
          variant="ghost"
          className="cursor-pointer text-white"
          size="icon"
          onClick={toggleMenu}
        >
          <svg
            className="h-6 w-6 text-wh"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gradient-to-r from-blue-500 to-purple-600  hover:from-blue-600 hover:to-purple-700 shadow-lg rounded-lg">
            {navlinks.map((name, index) => (
              <Button
                key={index}
                variant="ghost"
                className={
                  "w-full text-left hover:text-blue-500 transition-color text-muted-foreground cursor-pointer"
                }
                onClick={() => {
                  scrollToSection(name);
                  setIsMenuOpen(false); // Close menu after clicking
                }}
              >
                {name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NavLinks;
