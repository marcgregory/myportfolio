export type NavLinksProps = {
  isMenuOpen: boolean;
  toggleMenu?: () => void;
  activeLink?: string;
  onChangeTheme?: (theme: "light" | "dark") => void;
  handleNavLinkClick?: (name: string) => void;
  setIsOpenMenu?: (isOpen: boolean) => void;
};
