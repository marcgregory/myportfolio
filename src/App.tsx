import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { MessageCircle, X } from "lucide-react";
import Hero from "./components/Hero";
import LowerSectionsBackdrop from "./components/LowerSectionsBackdrop";
import Navigation from "./components/Navigation";
import useTheme from "./hooks/useTheme";

const Contacts = lazy(() => import("./components/Contacts"));
const CvChatWidget = lazy(() => import("./components/CvChatWidget"));
const Expertise = lazy(() => import("./components/Expertise"));
const Footer = lazy(() => import("./components/Footer"));
const Projects = lazy(() => import("./components/Projects"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));

const SectionFallback = ({ className = "" }: { className?: string }) => (
  <div className={className} aria-hidden="true" />
);

const useIdleReady = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setIsReady(true), {
        timeout: 1600,
      });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(() => setIsReady(true), 900);
    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  return isReady;
};

const IdleMount = ({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => {
  const isReady = useIdleReady();

  return isReady ? children : fallback;
};

const ChatToggleButton = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <div className="fixed bottom-6 right-4 z-50 sm:bottom-6 sm:right-6">
    <button
      type="button"
      onClick={onClick}
      className="button-gradient ml-auto flex size-14 cursor-pointer items-center justify-center rounded-full text-white shadow-[0_18px_42px_rgba(15,118,110,0.24)] ring-1 ring-white/15 transition-transform hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.96] dark:shadow-[0_18px_48px_rgba(124,58,237,0.46)] sm:size-16"
      aria-label={isOpen ? "Close CV chat" : "Open CV chat"}
    >
      {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
    </button>
  </div>
);

function App() {
  const { handleThemeChange } = useTheme();
  const [isCvChatOpen, setIsCvChatOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <LowerSectionsBackdrop />
      <div className="noise-layer" />
      <Navigation onChangeTheme={handleThemeChange} />
      <main className="relative z-10">
        <Hero />
        <IdleMount fallback={<SectionFallback className="py-20" />}>
          <Suspense fallback={<SectionFallback className="py-20" />}>
            <Expertise />
          </Suspense>
        </IdleMount>
        <IdleMount fallback={<SectionFallback className="py-20" />}>
          <Suspense fallback={<SectionFallback className="py-20" />}>
            <Projects />
          </Suspense>
        </IdleMount>
        <IdleMount fallback={<SectionFallback className="py-24" />}>
          <Suspense fallback={<SectionFallback className="py-24" />}>
            <Contacts onStartConversation={() => setIsCvChatOpen(true)} />
          </Suspense>
        </IdleMount>
        <IdleMount>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </IdleMount>
      </main>
      <IdleMount>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
      </IdleMount>
      {isCvChatOpen ? (
        <Suspense
          fallback={
            <ChatToggleButton
              isOpen={isCvChatOpen}
              onClick={() => setIsCvChatOpen(false)}
            />
          }
        >
          <CvChatWidget
            isOpen={isCvChatOpen}
            onClose={() => setIsCvChatOpen(false)}
            onOpen={() => setIsCvChatOpen(true)}
          />
        </Suspense>
      ) : (
        <ChatToggleButton
          isOpen={isCvChatOpen}
          onClick={() => setIsCvChatOpen(true)}
        />
      )}
    </div>
  );
}

export default App;
