const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative z-10 py-8 px-4 border-t border-border/30 glass">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-muted-foreground">
          {" "}
          © {currentYear} Marc Gregory Developer. Built with React, TypeScript,
          and Tailwind.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
