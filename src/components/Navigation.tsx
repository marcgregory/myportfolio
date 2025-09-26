import { motion } from "motion/react";
import NavLinks from "./NavLinks";
import { useScroll } from "@/hooks/useScroll";
import logo from "../assets/avatar.png";

const Navigation = () => {
  const scrolled = useScroll();
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
            className="cursor-pointer flex gap-2.5"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
          <NavLinks />
        </div>
      </div>
    </motion.div>
  );
};

export default Navigation;
