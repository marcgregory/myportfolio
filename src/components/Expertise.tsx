import { motion } from "motion/react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import {
  MongoIcon,
  NextIcon,
  NodeIcon,
  ReactIcon,
  TypeScriptIcon,
} from "./TechIcons";

const stats = [
  { icon: BriefcaseBusiness, value: "2+", label: "Years Experience" },
  { icon: ShieldCheck, value: "20+", label: "Projects Delivered" },
  { icon: UsersRound, value: "15+", label: "Happy Clients" },
  { icon: BadgeCheck, value: "100%", label: "Success Rate" },
];

const technologies = [
  { name: "React", icon: ReactIcon, color: "text-teal-700 dark:text-cyan-300" },
  { name: "TypeScript", icon: TypeScriptIcon, color: "text-teal-700 dark:text-blue-400" },
  { name: "Next.js", icon: NextIcon, color: "text-foreground dark:text-white" },
  { name: "Node.js", icon: NodeIcon, color: "text-teal-700 dark:text-emerald-400" },
  { name: "Tailwind CSS", text: "~", color: "text-teal-700 dark:text-sky-300" },
  { name: "PostgreSQL", text: "PG", color: "text-teal-700 dark:text-blue-300" },
  { name: "MongoDB", icon: MongoIcon, color: "text-teal-700 dark:text-emerald-400" },
  { name: "AWS", text: "aws", color: "text-teal-700 dark:text-orange-300" },
];

const Expertise = () => {
  return (
    <section id="about" className="relative z-10 -mt-4 pb-20 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="site-shell glass-panel rounded-2xl p-6 md:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
          <div>
            <p className="section-kicker mb-4">Expertise</p>
            <h2 className="max-w-md text-3xl font-black leading-tight tracking-[-0.035em] text-foreground dark:text-white md:text-4xl">
              Modern technologies,{" "}
              <span className="text-gradient">exceptional results</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-teal-700/20 bg-teal-500/10 text-teal-700 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-200">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-2xl font-black text-foreground dark:text-white">
                    {value}
                  </span>
                  <span className="block text-xs leading-5 text-muted-foreground dark:text-slate-400">
                    {label}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-slate-900/10 pt-7 dark:border-white/10">
          <p className="section-kicker mb-5">Technologies I Work With</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-900/10 bg-white/55 px-3 py-2 dark:border-white/5 dark:bg-white/[0.025]"
              >
                <span className={tech.color}>
                  {"icon" in tech && tech.icon ? (
                    <tech.icon className="size-5" />
                  ) : (
                    <span className="text-sm font-black">{tech.text}</span>
                  )}
                </span>
                <span className="text-xs font-semibold text-muted-foreground dark:text-slate-300">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Expertise;
