import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./ImageWithFallback";
import projects from "../../data/portfolio-projects.json";

const getVisibleCount = () => {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 768px)").matches) return 2;
  return 1;
};

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);
  const dragStart = useRef<number | null>(null);
  const wasDragging = useRef(false);
  const maxIndex = Math.max(projects.length - visibleCount, 0);
  const slideWidth = useMemo(() => 100 / visibleCount, [visibleCount]);

  useEffect(() => {
    const updateVisibleCount = () => setVisibleCount(getVisibleCount());
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  const goTo = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  };

  const handlePointerEnd = (clientX: number) => {
    if (dragStart.current === null) return;
    const distance = clientX - dragStart.current;
    dragStart.current = null;

    if (Math.abs(distance) < 42) return;
    wasDragging.current = true;
    goTo(activeIndex + (distance < 0 ? 1 : -1));
  };

  return (
    <section id="projects" className="relative z-10 overflow-hidden py-20">
      <div className="site-shell">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker mb-4">Featured Work</p>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
              Selected Projects
            </h2>
          </div>
          <Button
            asChild
            variant="ghost"
            className="w-fit rounded-full text-violet-200 hover:-translate-y-0.5 hover:bg-violet-300/10 hover:text-white"
          >
            <a
              href="https://github.com/marcgregory"
              target="_blank"
              rel="noopener noreferrer"
            >
              View all projects <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.62 }}
          className="relative"
        >
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Selected projects carousel"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={(event) => {
              dragStart.current = event.clientX;
              wasDragging.current = false;
            }}
            onPointerMove={(event) => {
              if (
                dragStart.current !== null &&
                Math.abs(event.clientX - dragStart.current) > 12
              ) {
                wasDragging.current = true;
              }
            }}
            onPointerUp={(event) => handlePointerEnd(event.clientX)}
            onPointerCancel={() => {
              dragStart.current = null;
            }}
            className="overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70"
          >
            <div
              className="flex touch-pan-y transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(-${activeIndex * slideWidth}%, 0, 0)`,
              }}
            >
              {projects.map((project, index) => (
                <article
                  key={project.title}
                  aria-label={`${index + 1} of ${projects.length}: ${project.title}`}
                  className="min-w-0 shrink-0 px-3"
                  style={{ flexBasis: `${slideWidth}%` }}
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => {
                      if (!wasDragging.current) return;
                      event.preventDefault();
                      wasDragging.current = false;
                    }}
                    className="group block h-full cursor-pointer overflow-hidden rounded-xl border border-violet-200/14 bg-[linear-gradient(145deg,rgba(31,41,78,0.92),rgba(12,18,43,0.92))] shadow-[0_22px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-2 hover:border-violet-300/45 hover:bg-[linear-gradient(145deg,rgba(45,56,103,0.96),rgba(18,27,58,0.96))] hover:shadow-[0_28px_86px_rgba(91,124,250,0.22)]"
                  >
                    <div className="relative h-56 overflow-hidden border-b border-white/10 bg-[#111833]">
                      <div className="absolute inset-x-5 bottom-0 top-7 rounded-t-lg border border-white/18 bg-slate-950/35 shadow-2xl transition duration-500 group-hover:-translate-y-1 group-hover:scale-[1.025]">
                        <ImageWithFallback
                          src={project.image}
                          alt={`${project.title} preview`}
                          className="h-full w-full rounded-t-lg object-cover object-top"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101735] via-transparent to-white/[0.04]" />
                    </div>

                    <div className="space-y-5 p-6">
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-violet-200">
                          {project.category}
                        </p>
                        <h3 className="text-xl font-black text-white">
                          {project.title}
                        </h3>
                        <p className="mt-3 min-h-[70px] text-sm leading-7 text-slate-300">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="border-violet-200/25 bg-violet-200/[0.08] text-violet-50"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-2 text-sm font-bold text-violet-100 transition duration-300 group-hover:text-white">
                        View Project{" "}
                        <ArrowUpRight className="size-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to project slide ${index + 1}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  onClick={() => goTo(index)}
                  className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-8 bg-violet-300 shadow-[0_0_18px_rgba(167,139,250,0.62)]"
                      : "w-2.5 bg-white/20 hover:bg-white/45"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Previous projects"
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="size-11 rounded-full border border-white/10 bg-white/[0.04] text-white hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-300/10 hover:shadow-[0_0_28px_rgba(124,58,237,0.26)]"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Next projects"
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === maxIndex}
                className="size-11 rounded-full border border-white/10 bg-white/[0.04] text-white hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-300/10 hover:shadow-[0_0_28px_rgba(124,58,237,0.26)]"
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
