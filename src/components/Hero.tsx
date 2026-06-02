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
      className="relative min-h-screen overflow-x-hidden pb-10 pt-28 md:pt-32"
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
          <h1 className="font-display text-[clamp(3rem,7vw,5.95rem)] font-black leading-[0.98] tracking-[-0.045em] text-foreground dark:text-white">
            Crafting Digital Experiences{" "}
            <span className="text-gradient block">That Matter</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground dark:text-slate-300">
            I build fast, scalable, and beautiful web applications with modern
            technologies and thoughtful design.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button
              onClick={() => scrollToSection("projects")}
              className="button-gradient h-14 rounded-lg px-7 text-base font-bold text-white hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,118,110,0.26)] dark:hover:shadow-[0_20px_48px_rgba(124,58,237,0.5)]"
            >
              View My Work <ArrowUpRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-lg border-slate-900/10 bg-white/70 px-7 text-base font-bold text-foreground hover:-translate-y-1 hover:border-teal-700/35 hover:bg-teal-50 hover:shadow-[0_16px_34px_rgba(15,118,110,0.14)] dark:border-white/15 dark:bg-white/[0.03] dark:text-white dark:hover:border-violet-300/35 dark:hover:bg-white/10 dark:hover:shadow-[0_16px_34px_rgba(124,58,237,0.18)]"
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
                  className="size-10 rounded-full border-2 border-white object-cover dark:border-[#070b1d]"
                  style={{ zIndex: clients.length - index }}
                />
              ))}
            </div>
            <p className="max-w-[170px] text-sm leading-6 text-muted-foreground dark:text-slate-400">
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
          <div className="absolute left-[7%] top-[23%] hidden size-14 items-center justify-center rounded-full border border-teal-700/15 bg-white/60 text-teal-700 shadow-[0_18px_40px_rgba(15,118,110,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:text-cyan-300 dark:shadow-[0_0_32px_rgba(56,189,248,0.2)] sm:flex">
            <Sparkles className="size-5" />
          </div>
          <div className="absolute right-[7%] top-[17%] hidden size-20 items-center justify-center rounded-full border border-teal-700/15 bg-white/60 text-teal-700 shadow-[0_18px_46px_rgba(15,118,110,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:text-cyan-300 dark:shadow-[0_0_42px_rgba(56,189,248,0.22)] md:flex">
            <ReactIcon className="size-9" />
          </div>
          <div className="absolute bottom-[25%] left-[12%] hidden size-14 items-center justify-center rounded-xl border border-teal-700/15 bg-white/60 text-teal-700 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:text-blue-300 sm:flex">
            <TypeScriptIcon className="size-7" />
          </div>
          <div className="absolute bottom-[18%] right-[14%] hidden size-14 items-center justify-center rounded-xl border border-teal-700/15 bg-white/60 text-teal-700 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:text-yellow-300 sm:flex">
            <NodeIcon className="size-7" />
          </div>

          <div className="absolute h-[68%] w-[58%] rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.16)_0%,rgba(52,211,153,0.1)_44%,transparent_72%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(124,58,237,0.22)_0%,rgba(56,189,248,0.1)_44%,transparent_72%)]" />
          <div className="absolute bottom-[17%] h-[18%] w-[42%] rounded-full bg-emerald-500/8 blur-2xl dark:bg-cyan-500/8" />
          <div className="relative w-[min(83vw,480px)]">
            <div className="absolute inset-x-[24%] bottom-7 h-10 rounded-full bg-slate-950/18 blur-xl dark:bg-black/35" />
            <img
              src="/hero/marc-hero.png"
              alt="Marc Gregory"
              className="relative z-10 mx-auto max-h-[650px] w-full object-contain drop-shadow-[0_24px_52px_rgba(0,0,0,0.38)]"
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
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-teal-700/20 bg-teal-500/10 text-teal-700 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-200">
                  {index === 0 ? (
                    <Rocket className="size-4" />
                  ) : index === 1 ? (
                    <Code2 className="size-4" />
                  ) : (
                    <Figma className="size-4" />
                  )}
                </span>
                <span>
                  <span className="block text-2xl font-black text-foreground dark:text-white">
                    {stat.value}
                  </span>
                  <span className="block text-xs leading-5 text-muted-foreground dark:text-slate-400">
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
