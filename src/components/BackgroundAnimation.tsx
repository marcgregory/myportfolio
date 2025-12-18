import { motion } from "motion/react";
import { useEffect, useState, useMemo, useRef, memo } from "react";
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

  const techIcons: React.ComponentType<React.SVGProps<SVGSVGElement>>[] = [
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

  // Reduce icons on mobile for performance
  const isMobile = dimensions.width < 768;
  // Lower counts to reduce animation workload
  const iconCount = isMobile ? 6 : 12;

  // Seeded PRNG so values are stable across renders
  const seedRef = useRef<number>(Math.floor(Math.random() * 1e9));
  const rng = () => {
    // simple LCG
    seedRef.current = (seedRef.current * 1664525 + 1013904223) >>> 0;
    return seedRef.current / 2 ** 32;
  };

  // Memoize elements so they only regenerate on resize / breakpoint change
  const iconElements = useMemo(() => {
    return Array.from({ length: iconCount }, (_, i) => {
      const IconComponent = techIcons[i % techIcons.length];
      const initialX = Math.floor(rng() * dimensions.width);
      const initialY = Math.floor(rng() * dimensions.height);
      const dx1 = Math.floor((rng() - 0.5) * 400);
      const dx2 = Math.floor((rng() - 0.5) * 600);
      const dy1 = Math.floor((rng() - 0.5) * 300);
      const dy2 = Math.floor((rng() - 0.5) * 400);
      const duration = rng() * (isMobile ? 40 : 30) + (isMobile ? 30 : 20);
      const delay = rng() * 5;
      return {
        id: i,
        Icon: IconComponent,
        size: Math.floor(rng() * 20) + (isMobile ? 25 : 30),
        initialX,
        initialY,
        animateX: [initialX, initialX + dx1, initialX + dx2, initialX],
        animateY: [initialY, initialY + dy1, initialY + dy2, initialY],
        rotate: [0, 180, 360, 0],
        scale: [0.8, 1.1, 0.9, 0.8],
        duration,
        delay,
        opacity: rng() * 0.4 + (isMobile ? 0.3 : 0.4),
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
    // regenerate only when dimensions or breakpoint changes
  }, [dimensions.width, dimensions.height, isMobile]);

  const shapeCount = isMobile ? 2 : 4;
  const floatingShapes = useMemo(() => {
    return Array.from({ length: shapeCount }, (_, i) => {
      const initialX = Math.floor(rng() * dimensions.width);
      const initialY = Math.floor(rng() * dimensions.height);
      const dx = Math.floor((rng() - 0.5) * 300);
      const dy = Math.floor((rng() - 0.5) * 200);
      const size =
        Math.floor(rng() * (isMobile ? 60 : 80)) + (isMobile ? 30 : 40);
      const duration = rng() * (isMobile ? 35 : 25) + (isMobile ? 20 : 15);
      const delay = rng() * 3;
      return {
        id: i,
        size,
        initialX,
        initialY,
        animateX: [initialX, initialX + dx, initialX],
        animateY: [initialY, initialY + dy, initialY],
        rotate: [0, 360, 0],
        duration,
        delay,
      };
    });
  }, [dimensions.width, dimensions.height, isMobile]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-1">
      {/* Floating gradient orbs - reduced on mobile */}
      <div className="absolute inset-0">
        <div className="floating-orb absolute top-1/4 left-1/4 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 rounded-full blur-2xl md:blur-3xl" />
        <div
          className="floating-orb absolute top-3/4 right-1/4 w-56 h-56 md:w-80 md:h-80 bg-gradient-to-r from-violet-500/25 to-fuchsia-600/25 rounded-full blur-2xl md:blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        {!isMobile && (
          <>
            <div
              className="floating-orb absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-blue-600/25 to-cyan-500/25 rounded-full blur-3xl"
              style={{ animationDelay: "4s" }}
            />
            <div
              className="floating-orb absolute top-1/3 right-1/3 w-56 h-56 bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-full blur-3xl"
              style={{ animationDelay: "6s" }}
            />
          </>
        )}
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
            x: icon.animateX,
            y: icon.animateY,
            rotate: icon.rotate,
            scale: icon.scale,
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
            x: shape.animateX,
            y: shape.animateY,
            rotate: shape.rotate,
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

      {/* Subtle tech grid pattern - simplified on mobile */}
      <div
        className={`absolute inset-0 ${isMobile ? "opacity-5" : "opacity-15"}`}
        style={{
          backgroundImage: `
               linear-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px),
               linear-gradient(90deg, rgba(99, 102, 241, 0.15) 1px, transparent 1px)
             `,
          backgroundSize: isMobile ? "80px 80px" : "60px 60px",
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />
    </div>
  );
};

export default memo(BackgroundAnimation);
