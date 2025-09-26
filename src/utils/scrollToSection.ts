const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId.toLowerCase());

  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export { scrollToSection };
