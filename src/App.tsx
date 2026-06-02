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
      <div className="site-backdrop" />
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
