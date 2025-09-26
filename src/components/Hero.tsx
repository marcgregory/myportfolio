import { motion } from "motion/react";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import { Button } from "./ui/button";
import { scrollToSection } from "@/utils/scrollToSection";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-muted-foreground">Hi, I'm</span>{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Marc Gregory
            </span>
          </motion.h1>

          <motion.p
            className="mb-8 text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Full-stack developer passionate about creating beautiful, functional
            web applications. I specialize in React, TypeScript, NextJs and
            modern web technologies to bring ideas to life.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Download className="mr-2 h-4 w-4 text-mute" />
              Download CV
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer"
              onClick={() => scrollToSection("projects")}
            >
              View Projects
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="https://github.com/marcgregory"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-blue-500 transition-colors cursor-pointer"
              >
                <Github className="h-5 w-5" />
              </Button>
            </a>
            <a
              href="https://www.linkedin.com/in/marc-gregory-t-866623310/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-blue-500 transition-colors cursor-pointer"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </a>
            <a href="mailto:marcgregory.developer@gmail.com">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-blue-500 transition-colors cursor-pointer"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
