import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  ReactIcon,
  TypeScriptIcon,
  NodeIcon,
  NextIcon,
  JavaScriptIcon,
  PythonIcon,
  VueIcon,
  GitIcon,
  DockerIcon,
  MongoIcon,
} from "./TechIcons";

const techIcons: React.ComponentType<React.SVGProps<SVGAElement>>[] = [
  ReactIcon,
  TypeScriptIcon,
  NodeIcon,
  NextIcon,
  JavaScriptIcon,
  PythonIcon,
  VueIcon,
  GitIcon,
  DockerIcon,
  MongoIcon,
];

const BackgroundAnimation = () => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const iconElements = Array.from({ length: 15 }, (_, i) => {
    const IconComponent = techIcons[i % techIcons.length];
    return {
      id: i,
      Icon: IconComponent,
      size: Math.random() * 20 + 30,
      initialX: Math.random() * dimensions.width,
      initialY: Math.random() * dimensions.height,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.4,
      color: [
        "text-blue-500",
        "text-purple-500",
        "text-green-500",
        "text-yellow-500",
        "text-red-500",
        "text-indigo-500",
        "text-pink-500",
        "text-cyan-500",
      ][i % 8],
    };
  });

  const floatingShapes = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 40,
    initialX: Math.random() * dimensions.width,
    initialY: Math.random() * dimensions.height,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-1">
      {/* Floating gradient orbs */}
      <div className="absolute inset-0">
        <div className="floating-orbs absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 rounded-full blur-3xl" />
        <div
          className="floating-orb absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-500/25 to-fuchsia-600/25 rounded-full blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="floating-orb absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-blue-600/25 to-cyan-500/25 rounded-full blur-3xl"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="floating-orb absolute top-1/3 right-1/3 w-56 h-56 bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-full blur-3xl"
          style={{ animationDelay: "6s" }}
        />
      </div>
      {/* Tech background pattern */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1739343338040-2dae68f6bdf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBiYWNrZ3JvdW5kJTIwZGFya3xlbnwxfHx8fDE3NTg4NjY1OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
        }}
      />
      {/* Floating Tech Icons */}
      {iconElements.map((icon) => (
        <motion.div
          key={`icon-${icon.id}`}
          className={`absolute ${icon.color}`}
          style={{ opacity: icon.opacity }}
          initial={{
            x: icon.initialX,
            y: icon.initialY,
            rotate: 0,
            scale: 0.8,
          }}
          animate={{
            x: [
              icon.initialX,
              icon.initialX + (Math.random() - 0.5) * 400,
              icon.initialX + (Math.random() - 0.5) * 600,
              icon.initialX,
            ],
            y: [
              icon.initialY,
              icon.initialY + (Math.random() - 0.5) * 300,
              icon.initialY + (Math.random() - 0.5) * 400,
              icon.initialY,
            ],
            rotate: [0, 180, 360, 0],
            scale: [0.8, 1.1, 0.9, 0.8],
          }}
          transition={{
            duration: icon.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: icon.delay,
          }}
        >
          <icon.Icon style={{ width: icon.size, height: icon.size }} />
        </motion.div>
      ))}
      {/* Abstract Floating Shapes */}
      {floatingShapes.map((shape) => (
        <motion.div
          key={`shape-${shape.id}`}
          className="absolute opacity-20"
          initial={{
            x: shape.initialX,
            y: shape.initialY,
            rotate: 0,
          }}
          animate={{
            x: [
              shape.initialX,
              shape.initialX + (Math.random() - 0.5) * 300,
              shape.initialX,
            ],
            y: [
              shape.initialY,
              shape.initialY + (Math.random() - 0.5) * 200,
              shape.initialY,
            ],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "linear",
            delay: shape.delay,
          }}
          style={{
            width: shape.size,
            height: shape.size,
          }}
        >
          {shape.id % 3 === 0 && (
            <div className="w-full h-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full" />
          )}
          {shape.id % 3 === 1 && (
            <div className="w-full h-full bg-gradient-to-br from-green-400/30 to-blue-500/30 transform rotate-45" />
          )}
          {shape.id % 3 === 2 && (
            <div
              className="w-full h-full bg-gradient-to-br from-purple-500/30 to-pink-500/30"
              style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
            />
          )}
        </motion.div>
      ))}
      {/* Subtle tech grid pattern */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
               linear-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px),
               linear-gradient(90deg, rgba(99, 102, 241, 0.15) 1px, transparent 1px)
             `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />
    </div>
  );
};

export default BackgroundAnimation;
