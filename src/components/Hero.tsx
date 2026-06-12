import { ArrowUpRight, Code2, Figma, Rocket, Sparkles } from "lucide-react";
import CountUp from "./CountUp";
import { Button } from "./ui/button";
import HeroScene from "./HeroScene";
import { ReactIcon, TypeScriptIcon, NodeIcon } from "./TechIcons";
import { scrollToSection } from "@/utils/scrollToSection";

const heroStats = [
  { value: "2+", label: "Years Experience" },
  { value: "20+", label: "Projects Completed" },
  { value: "100%", label: "Client Satisfaction" },
];

const clients = [
  "/clients/avatar-80.webp",
  "/clients/volendaystaffing-80.webp",
  "/clients/lendami-80.webp",
];

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-x-hidden pb-10 pt-28 md:pt-32"
    >
      <HeroScene />
      <div className="site-shell relative z-10 grid min-h-[calc(100vh-8rem)] items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="hero-reveal max-w-2xl">
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
              asChild
              className="h-14 rounded-lg border-slate-900/10 bg-white/70 px-7 text-base font-bold text-foreground hover:-translate-y-1 hover:border-teal-700/35 hover:bg-teal-50 hover:shadow-[0_16px_34px_rgba(15,118,110,0.14)] dark:border-white/15 dark:bg-white/[0.03] dark:text-white dark:hover:border-violet-300/35 dark:hover:bg-white/10 dark:hover:shadow-[0_16px_34px_rgba(124,58,237,0.18)]"
            >
              <a href="/room">
                Enter room <Sparkles className="size-4" />
              </a>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-5">
            <div className="flex -space-x-3">
              {clients.map((client, index) => (
                <img
                  key={client}
                  src={client}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="size-10 rounded-full border-2 border-white object-cover dark:border-[#070b1d]"
                  style={{ zIndex: clients.length - index }}
                />
              ))}
            </div>
            <p className="max-w-[170px] text-sm leading-6 text-muted-foreground dark:text-slate-400">
              Trusted by <CountUp value="20+" className="tabular-nums" />{" "}
              clients worldwide{" "}
              <span className="inline-block size-2 rounded-full bg-emerald-400" />
            </p>
          </div>
        </div>

        <div className="hero-reveal hero-reveal-delayed relative mx-auto flex w-full max-w-[640px] items-center justify-center lg:min-h-[680px]">
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
            <picture>
              <source
                type="image/avif"
                srcSet="/hero/marc-hero-640.avif 640w, /hero/marc-hero-960.avif 960w"
                sizes="(min-width: 1024px) 480px, 83vw"
              />
              <source
                type="image/webp"
                srcSet="/hero/marc-hero-640.webp 640w, /hero/marc-hero-960.webp 960w"
                sizes="(min-width: 1024px) 480px, 83vw"
              />
              <img
                src="/hero/marc-hero-960.webp"
                alt="Marc Gregory"
                width={1024}
                height={1536}
                fetchPriority="high"
                className="relative z-10 mx-auto max-h-[650px] w-full object-contain drop-shadow-[0_24px_52px_rgba(0,0,0,0.38)]"
              />
            </picture>
          </div>

          <div className="absolute right-0 top-[35%] hidden w-40 space-y-7 lg:block">
            {heroStats.map((stat, index) => (
              <div
                key={stat.label}
                className="hero-stat-reveal flex gap-4"
                style={{ animationDelay: `${500 + index * 120}ms` }}
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
                  <CountUp
                    value={stat.value}
                    delay={index * 120}
                    className="block text-2xl font-black tabular-nums text-foreground dark:text-white"
                  />
                  <span className="block text-xs leading-5 text-muted-foreground dark:text-slate-400">
                    {stat.label}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
