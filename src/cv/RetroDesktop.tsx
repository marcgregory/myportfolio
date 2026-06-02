import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import RetroWindow from "./RetroWindow";
import CvTerminal from "./CvTerminal";
import {
  cvEducation,
  cvExperience,
  cvObjective,
  cvProfile,
  cvProjects,
  cvQualities,
  cvSkillGroups,
} from "@/data/cv-content";

type WindowId =
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "contact"
  | "terminal";

type DesktopWindow = {
  id: WindowId;
  title: string;
  icon: string;
  defaultPosition: { x: number; y: number };
};

const desktopWindows: DesktopWindow[] = [
  { id: "about", title: "About Marc", icon: "👤", defaultPosition: { x: 48, y: 40 } },
  {
    id: "experience",
    title: "Experience",
    icon: "💼",
    defaultPosition: { x: 88, y: 72 },
  },
  { id: "skills", title: "Skills", icon: "⚙️", defaultPosition: { x: 128, y: 104 } },
  {
    id: "projects",
    title: "Projects",
    icon: "📁",
    defaultPosition: { x: 168, y: 136 },
  },
  {
    id: "contact",
    title: "Contact",
    icon: "✉️",
    defaultPosition: { x: 208, y: 168 },
  },
  {
    id: "terminal",
    title: "CV Terminal",
    icon: "⌨️",
    defaultPosition: { x: 120, y: 88 },
  },
];

const formatClock = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

type RetroDesktopProps = {
  onExit: () => void;
};

const RetroDesktop = ({ onExit }: RetroDesktopProps) => {
  const [openWindows, setOpenWindows] = useState<WindowId[]>([]);
  const [minimized, setMinimized] = useState<WindowId[]>([]);
  const [activeId, setActiveId] = useState<WindowId | null>(null);
  const [positions, setPositions] = useState<Record<WindowId, { x: number; y: number }>>(
    () =>
      Object.fromEntries(
        desktopWindows.map((window) => [window.id, window.defaultPosition]),
      ) as Record<WindowId, { x: number; y: number }>,
  );
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState(formatClock);
  const startMenuRef = useRef<HTMLElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!startOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (startMenuRef.current?.contains(target)) return;
      if (startButtonRef.current?.contains(target)) return;
      setStartOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [startOpen]);

  const focusWindow = useCallback((id: WindowId) => {
    setMinimized((current) => current.filter((item) => item !== id));
    setActiveId(id);
    setStartOpen(false);
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    setOpenWindows((current) => (current.includes(id) ? current : [...current, id]));
    setMinimized((current) => current.filter((item) => item !== id));
    setActiveId(id);
    setStartOpen(false);
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setOpenWindows((current) => current.filter((item) => item !== id));
    setMinimized((current) => current.filter((item) => item !== id));
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setMinimized((current) => (current.includes(id) ? current : [...current, id]));
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const windowContent = useMemo(
    () =>
      ({
        about: (
          <>
            <p>
              <strong>{cvProfile.name}</strong>
            </p>
            <p>{cvProfile.title}</p>
            <p>{cvProfile.location}</p>
            <h3>Objective</h3>
            <p>{cvObjective}</p>
            <h3>Qualities</h3>
            <ul>
              {cvQualities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>Education</h3>
            <ul>
              {cvEducation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ),
        experience: (
          <>
            {cvExperience.map((role) => (
              <div key={`${role.company}-${role.title}`}>
                <h3>{role.title}</h3>
                <p>
                  <strong>{role.company}</strong>
                  {role.workSetup ? ` · ${role.workSetup}` : ""}
                </p>
                <p>{role.dates}</p>
                <ul>
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        ),
        skills: (
          <>
            {cvSkillGroups.map((group) => (
              <div key={group.label}>
                <h3>{group.label}</h3>
                <p>{group.items}</p>
              </div>
            ))}
          </>
        ),
        projects: (
          <>
            {cvProjects.map((project) => (
              <div key={project.title}>
                <h3>{project.title}</h3>
                <p>
                  <em>{project.category}</em>
                </p>
                <p>{project.description}</p>
                <p>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Open project
                  </a>
                </p>
              </div>
            ))}
          </>
        ),
        contact: (
          <>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${cvProfile.email}`}>{cvProfile.email}</a>
            </p>
            <p>
              <strong>Phone:</strong> {cvProfile.phone}
            </p>
            <p>
              <strong>GitHub:</strong>{" "}
              <a href={cvProfile.githubUrl} target="_blank" rel="noopener noreferrer">
                {cvProfile.githubUrl}
              </a>
            </p>
          </>
        ),
        terminal: <CvTerminal />,
      }) satisfies Record<WindowId, ReactNode>,
    [],
  );

  const taskbarWindows = openWindows
    .map((id) => desktopWindows.find((item) => item.id === id))
    .filter((item): item is DesktopWindow => Boolean(item));

  return (
    <div className="cv-desktop">
      <div
        className="cv-desktop-wallpaper"
        aria-hidden
        onPointerDown={() => setStartOpen(false)}
      />
      <div className="cv-desktop-icons">
        {desktopWindows.map((item) => (
          <button
            key={item.id}
            type="button"
            className="cv-desktop-icon"
            onDoubleClick={() => openWindow(item.id)}
            onClick={() => {
              if (window.matchMedia("(max-width: 767px)").matches) {
                openWindow(item.id);
              }
            }}
          >
            <span className="cv-desktop-icon-glyph" aria-hidden>
              {item.icon}
            </span>
            <span>{item.title}</span>
          </button>
        ))}
      </div>

      <div className="cv-windows-layer">
        {openWindows.map((id) => {
          const config = desktopWindows.find((item) => item.id === id);
          if (!config) return null;

          return (
            <RetroWindow
              key={id}
              id={id}
              title={config.title}
              isActive={activeId === id}
              isMinimized={minimized.includes(id)}
              position={positions[id]}
              onClose={() => closeWindow(id)}
              onMinimize={() => minimizeWindow(id)}
              onFocus={() => setActiveId(id)}
              onMove={(position) =>
                setPositions((current) => ({ ...current, [id]: position }))
              }
            >
              {windowContent[id]}
            </RetroWindow>
          );
        })}
      </div>

      {startOpen && (
        <nav
          ref={startMenuRef}
          className="cv-start-menu"
          aria-label="Start menu"
        >
          {desktopWindows.map((item) => (
            <button key={item.id} type="button" onClick={() => openWindow(item.id)}>
              {item.title}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setStartOpen(false);
              onExit();
            }}
          >
            Back to Portfolio
          </button>
          <button type="button" onClick={onExit}>
            Exit
          </button>
        </nav>
      )}

      <footer className="cv-taskbar">
        <button
          ref={startButtonRef}
          type="button"
          className={`cv-taskbar-start${startOpen ? " is-open" : ""}`}
          onClick={() => setStartOpen((open) => !open)}
        >
          Start
        </button>
        <div className="cv-taskbar-windows">
          {taskbarWindows.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`cv-taskbar-window${activeId === item.id && !minimized.includes(item.id) ? " is-active" : ""}${minimized.includes(item.id) ? " is-minimized" : ""}`}
              onClick={() => focusWindow(item.id)}
              title={item.title}
            >
              {item.title}
            </button>
          ))}
        </div>
        <span className="cv-taskbar-clock">{clock}</span>
      </footer>
    </div>
  );
};

export default RetroDesktop;
