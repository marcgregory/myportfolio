import { Menu } from "lucide-react";
import { Button } from "./ui/button";

const navlinks = ["About", "Projects", "Contact", "Hire me"];

type NavLinksProps = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  activeLink: string;
  handleNavLinkClick: (name: string) => void;
};

const NavLinks = ({
  isMenuOpen,
  toggleMenu,
  activeLink,
  handleNavLinkClick,
}: NavLinksProps) => {
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
                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer animate-pulse text-white"
                : activeLink === name
                ? "text-blue-500 font-bold"
                : "hover:text-blue-500 transition-color text-muted-foreground cursor-pointer"
            }
            onClick={() => handleNavLinkClick(name)}
          >
            {name}
          </Button>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden  relative">
        <Button
          variant="ghost"
          className="cursor-pointer text-white"
          size="icon"
          onClick={toggleMenu}
        >
          <Menu />
        </Button>

        {isMenuOpen && (
          <div className="absolute right-0 top-8 mt-2 w-48 bg-gradient-to-r from-blue-500 to-purple-600  hover:from-blue-600 hover:to-purple-700 shadow-lg rounded-lg">
            {navlinks.map((name, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`w-full text-left hover:text-blue-500 transition-color text-muted-foreground cursor-pointer ${
                  activeLink === name ? "text-blue-500 font-bold" : ""
                }`}
                onClick={() => handleNavLinkClick(name)}
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
