import Contacts from "./components/Contacts";
import Cursor from "./components/Cursor";
import CvChatWidget from "./components/CvChatWidget";
import Expertise from "./components/Expertise";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navigation from "./components/Navigation";
import Projects from "./components/Projects";
import ScrollToTop from "./components/ScrollToTop";
import useTheme from "./hooks/useTheme";
import { useState } from "react";

function App() {
  const { handleThemeChange } = useTheme();
  const [isCvChatOpen, setIsCvChatOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_22%_8%,rgba(124,58,237,0.24),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(14,165,233,0.16),transparent_30%),linear-gradient(180deg,#050816_0%,#070b1d_45%,#050716_100%)]" />
      <div className="noise-layer" />
      <Navigation onChangeTheme={handleThemeChange} />
      <main>
        <Hero />
        <Expertise />
        <Projects />
        <Contacts onStartConversation={() => setIsCvChatOpen(true)} />
      </main>
      <Footer />
      <ScrollToTop />
      <Cursor />
      <CvChatWidget
        isOpen={isCvChatOpen}
        onClose={() => setIsCvChatOpen(false)}
        onOpen={() => setIsCvChatOpen(true)}
      />
    </div>
  );
}

export default App;
