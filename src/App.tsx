import About from "./components/About";
import BackgroundAnimation from "./components/BackgroundAnimation";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navigation from "./components/Navigation";
import Projects from "./components/Projects";

function App() {
  return (
    <div className="dark min-h-screen relative bg-animated-gradient">
      {/* Animated gradient background layer */}
      <div className="fixed inset-0 bg-animated-gradient opacity-90" />
      {/* Glass overlay for content readability */}
      <div className=" fixed inset-0 backdrop-blur-sm bg-background/20" />
      <BackgroundAnimation />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}

export default App;
