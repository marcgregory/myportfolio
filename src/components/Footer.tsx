import { Button } from "./ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative z-10 py-8 px-4 border-t border-border/30 glass">
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-2 sm:right-8 z-50 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none p-4 rounded-full shadow-lg transition-all animate-pulse"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </Button>
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-muted-foreground">
          {" "}
          © {currentYear} Marc Gregory. Built with React, TypeScript, and
          Tailwind.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
