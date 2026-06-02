import { motion } from "motion/react";
import {
  ArrowUpRight,
  Code2,
  Download,
  Figma,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import HeroScene from "./HeroScene";
import { ReactIcon, TypeScriptIcon, NodeIcon } from "./TechIcons";
import { scrollToSection } from "@/utils/scrollToSection";

const heroStats = [
  { value: "2+", label: "Years Experience" },
  { value: "20+", label: "Projects Completed" },
  { value: "100%", label: "Client Satisfaction" },
];

const clients = ["/avatar.png", "/projects/volendaystaffing.png", "/projects/lendami.png"];

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden pb-16 pt-28 md:pt-32"
    >
      <HeroScene />
      <div className="site-shell relative z-10 grid min-h-[calc(100vh-8rem)] items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="section-kicker mb-6">Full-Stack Developer</p>
          <h1 className="font-display text-[clamp(3rem,7vw,5.95rem)] font-black leading-[0.98] tracking-[-0.045em] text-white">
            Crafting Digital Experiences{" "}
            <span className="text-gradient block">That Matter</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
            I build fast, scalable, and beautiful web applications with modern
            technologies and thoughtful design.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button
              onClick={() => scrollToSection("projects")}
              className="button-gradient h-14 rounded-lg px-7 text-base font-bold text-white hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(124,58,237,0.5)]"
            >
              View My Work <ArrowUpRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-lg border-white/15 bg-white/[0.03] px-7 text-base font-bold text-white hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/10 hover:shadow-[0_16px_34px_rgba(124,58,237,0.18)]"
            >
              Download CV <Download className="size-4" />
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-5">
            <div className="flex -space-x-3">
              {clients.map((client, index) => (
                <img
                  key={client}
                  src={client}
                  alt=""
                  className="size-10 rounded-full border-2 border-[#070b1d] object-cover"
                  style={{ zIndex: clients.length - index }}
                />
              ))}
            </div>
            <p className="max-w-[170px] text-sm leading-6 text-slate-400">
              Trusted by 20+ clients worldwide{" "}
              <span className="inline-block size-2 rounded-full bg-emerald-400" />
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: "easeOut" }}
          className="relative mx-auto flex w-full max-w-[640px] items-center justify-center lg:min-h-[680px]"
        >
          <div className="absolute left-[7%] top-[23%] hidden size-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-cyan-300 shadow-[0_0_32px_rgba(56,189,248,0.2)] backdrop-blur-xl sm:flex">
            <Sparkles className="size-5" />
          </div>
          <div className="absolute right-[7%] top-[17%] hidden size-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-cyan-300 shadow-[0_0_42px_rgba(56,189,248,0.22)] backdrop-blur-xl md:flex">
            <ReactIcon className="size-9" />
          </div>
          <div className="absolute bottom-[25%] left-[12%] hidden size-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-blue-300 backdrop-blur-xl sm:flex">
            <TypeScriptIcon className="size-7" />
          </div>
          <div className="absolute bottom-[18%] right-[14%] hidden size-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-yellow-300 backdrop-blur-xl sm:flex">
            <NodeIcon className="size-7" />
          </div>

          <div className="hero-orbit hidden md:block" />
          <div className="absolute h-[74%] w-[62%] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.36)_0%,rgba(56,189,248,0.16)_42%,transparent_72%)] blur-3xl" />
          <div className="absolute bottom-[14%] h-[28%] w-[54%] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative w-[min(83vw,480px)]">
            <div className="absolute inset-x-[17%] bottom-5 h-20 rounded-full bg-black/55 blur-2xl" />
            <img
              src="/hero/marc-hero.png"
              alt="Marc Gregory"
              className="relative z-10 mx-auto max-h-[650px] w-full object-contain drop-shadow-[0_34px_84px_rgba(0,0,0,0.64)]"
            />
          </div>

          <div className="absolute right-0 top-[35%] hidden w-40 space-y-7 lg:block">
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.5 + index * 0.12 }}
                className="flex gap-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-violet-300/20 bg-violet-400/10 text-violet-200">
                  {index === 0 ? (
                    <Rocket className="size-4" />
                  ) : index === 1 ? (
                    <Code2 className="size-4" />
                  ) : (
                    <Figma className="size-4" />
                  )}
                </span>
                <span>
                  <span className="block text-2xl font-black text-white">
                    {stat.value}
                  </span>
                  <span className="block text-xs leading-5 text-slate-400">
                    {stat.label}
                  </span>
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
