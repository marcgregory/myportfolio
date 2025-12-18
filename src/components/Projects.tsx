import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Github } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

const Projects = () => {
  // const projects = [
  //   {
  //     title: "Volenday Staffing",
  //     description:
  //       "A staffing solutions platform built with Next.js and React, integrating the Volenday SDK for seamless workforce management. I worked on developing responsive UI with Material UI, GSAP animations, and styled components to ensure a polished and interactive user experience.",

  //     image: "./projects/volendaystaffing.png",
  //     technologies: [
  //       "Next.js",
  //       "React",
  //       "Volenday SDK",
  //       "GSAP",
  //       "Material UI",
  //       "Styled Components",
  //       "CSS",
  //     ],
  //     github: "#",
  //     live: "https://volendaystaffing.com/",
  //   },
  //   {
  //     title: "Lending App",
  //     description:
  //       "LendAmi is a peer-to-peer lending platform built on WordPress with Elementor, integrated with AWS, Bux API, and Movider. I contributed by fixing styling issues, improving responsiveness, and optimizing UI components for a better user experience.",

  //     image: "./projects/lendami.png",

  //     technologies: [
  //       "Wordpress - Elementor",
  //       "AWS",
  //       "Bux",
  //       "React",
  //       "Movider",
  //       "CSS",
  //       "i18n",
  //     ],
  //     github: "#",
  //     live: "https://lendami.com.ph/",
  //   },
  //   {
  //     title: "Asia Ceo",
  //     description:
  //       "Asia CEO Forum is a national business event platform built with Next.js, React, Framer Motion, and Ant Design. I helped implement smooth animations and responsive layouts, ensuring the site is visually appealing and easy to navigate.",

  //     image: "./projects/asiaceo.png",
  //     technologies: ["Next.js", "React", "Framer Motion", "Ant Design", "CSS"],
  //     github: "#",
  //     live: "https://www.asia-ceo.org/",
  //   },
  // ];

  const projects = [
    {
      title: "Volenday Staffing",
      description:
        "A staffing solutions platform built with Next.js and React, integrating the Volenday SDK. I contributed by fixing bugs, developing responsive UI with Material UI and styled components, and adding GSAP animations for a polished, interactive user experience.",
      image: "./projects/volendaystaffing.png",
      technologies: [
        "Next.js",
        "React",
        "Volenday SDK",
        "GSAP",
        "Material UI",
        "Styled Components",
        "CSS",
        "Git Kraken",
      ],
      github: "#",
      live: "https://volendaystaffing.com/",
    },
    {
      title: "Lending App",
      description:
        "LendAmi is a peer-to-peer lending platform built on WordPress with Elementor, integrated with AWS, Bux API, Movider, and i18n. I contributed by fixing bugs, creating API endpoints, setting up cron jobs with EventBridge, implementing email templates using SES, integrating SMS functionality via Movider, and improving UI responsiveness.",
      image: "./projects/lendami.png",
      technologies: [
        "Wordpress - Elementor",
        "AWS",
        "Bux",
        "React",
        "Movider",
        "CSS",
        "i18n",
        "CSS",
        "Styled Components",
        "Material UI",
        "Postgre SQL",
        "Git Kraken",
      ],
      github: "#",
      live: "https://lendami.com.ph/",
    },

    {
      title: "Asia SEO",
      description:
        "Revamped the Asia CEO website by upgrading Next.js from version 13 to 14 using the App Router. I contributed by fixing bugs, migrating pages to the new app folder structure, updating components to leverage Next.js 14 features, and improving performance and SEO best practices.",
      image: "./projects/asiaceo.png",
      technologies: [
        "Next.js",
        "React",
        "Material UI",
        "Framer Motion",
        "CSS",
        "Volenday SDK",
        "Git Kraken",
      ],
      github: "#",
      live: "https://asia-ceo.org/",
    },
  ];

  return (
    <section className="py-20 px-4 relative z-10" id="projects">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-white md:text-[22px]">Featured Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work spanning web applications , and SaaS
            platforms
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 cursor-pointer hover:text-blue-500"
                      onClick={() =>
                        window.open(
                          project.live,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
