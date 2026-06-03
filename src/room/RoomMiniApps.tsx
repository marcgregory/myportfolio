import { cvProfile, cvProjects } from "@/data/cv-content";
import portfolioProjects from "../../data/portfolio-projects.json";
import { findInteractable } from "./interactables-data";
import type { RoomMiniAppId } from "./room-types";

type RoomMiniAppsProps = {
  appId: RoomMiniAppId | null;
  onClose: () => void;
  onGoHome: () => void;
};

const RoomMiniApps = ({ appId, onClose, onGoHome }: RoomMiniAppsProps) => {
  if (!appId) return null;

  const interactable = findInteractable(appId);
  const title = interactable?.label ?? "Studio app";
  const dismiss = appId === "monitor" ? onGoHome : onClose;

  return (
    <div className="room-mini-backdrop" role="presentation" onClick={dismiss}>
      <div
        className={`room-mini-panel room-mini-panel--${appId}`}
        role="dialog"
        aria-labelledby="room-mini-title"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="room-mini-panel__header">
          <div>
            <p className="room-mini-panel__kicker">In-room app</p>
            <h2 id="room-mini-title">{title}</h2>
          </div>
          <button
            type="button"
            className="room-btn room-btn--ghost"
            onClick={dismiss}
            aria-label={appId === "monitor" ? "Exit to portfolio home" : "Close app"}
          >
            {appId === "monitor" ? "Exit" : "Close"}
          </button>
        </header>

        <div className="room-mini-panel__body">
          {appId === "monitor" && (
            <>
              <p className="room-mini-panel__lede">
                Retro BIOS desktop running inside the studio CRT.
              </p>
              <div className="room-mini-crt">
                <iframe
                  className="room-mini-iframe"
                  src="/cv"
                  title="CV desktop experience"
                />
              </div>
            </>
          )}

          {appId === "projects" && (
            <>
              <p className="room-mini-panel__lede">
                Shipped work — open a project or jump to the portfolio grid.
              </p>
              <ul className="room-mini-list">
                {portfolioProjects.map((project) => (
                  <li key={project.title} className="room-mini-list__item">
                    <img src={project.image} alt="" className="room-mini-list__thumb" />
                    <div>
                      <strong>{project.title}</strong>
                      <span>{project.category}</span>
                      <p>{project.description}</p>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit live site
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {appId === "contact" && (
            <>
              <p className="room-mini-panel__lede">Reach Marc from the studio terminal.</p>
              <dl className="room-contact-panel__list">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${cvProfile.email}`}>{cvProfile.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{cvProfile.phone}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{cvProfile.location}</dd>
                </div>
              </dl>
              <div className="room-mini-panel__actions">
                <a
                  className="room-btn room-btn--primary"
                  href={`mailto:${cvProfile.email}?subject=Portfolio%20inquiry`}
                >
                  Send email
                </a>
              </div>
            </>
          )}

          {appId === "github" && (
            <>
              <p className="room-mini-panel__lede">
                Open-source work and experiments on GitHub.
              </p>
              <div className="room-mini-github">
                <span className="room-mini-github__avatar" aria-hidden>
                  MG
                </span>
                <div>
                  <strong>marcgregory</strong>
                  <p>Junior developer · React, Next.js, TypeScript, AWS</p>
                  <p className="room-mini-github__stats">
                    {cvProjects.length} featured projects in CV · portfolio synced
                  </p>
                </div>
              </div>
              <div className="room-mini-panel__actions">
                <a
                  className="room-btn room-btn--primary"
                  href={cvProfile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open GitHub
                </a>
              </div>
            </>
          )}

          {appId === "radio" && (
            <>
              <p className="room-mini-panel__lede">
                Default room ambience plays when you enter and stops when you exit.
              </p>
              <div className="room-mini-radio">
                <div className="room-mini-radio__display">
                  <span className="room-mini-radio__status">
                    ROOM AMBIENCE
                  </span>
                  <span className="room-mini-radio__track">Studio floor mix</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomMiniApps;
