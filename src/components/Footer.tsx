import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/marcgregory/myportfolio",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/marc-gregory-t-866623310/",
    icon: Linkedin,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/",
    icon: Twitter,
  },
  {
    label: "Email",
    href: "mailto:marcgregory.developer@gmail.com",
    icon: Mail,
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-slate-900/10 py-9 dark:border-white/10">
      <div className="site-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gradient text-2xl font-black tracking-[-0.08em]">
            MG
          </span>
          <span className="text-sm font-bold text-foreground dark:text-white">Marc Gregory</span>
        </div>

        <p className="text-sm text-muted-foreground dark:text-slate-500">
          &copy; {currentYear} All rights reserved.
        </p>

        <div className="flex items-center gap-5">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="icon-link rounded-full p-2 text-muted-foreground transition duration-300 hover:-translate-y-0.5 hover:bg-teal-50 hover:text-teal-700 hover:shadow-[0_10px_24px_rgba(15,118,110,0.14)] dark:text-slate-400 dark:hover:bg-violet-300/10 dark:hover:text-white dark:hover:shadow-[0_0_24px_rgba(124,58,237,0.22)]"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
