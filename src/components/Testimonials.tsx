import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { useState, useEffect, useMemo } from "react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = useMemo(() => [
    {
      id: 1,
      name: "Sarah Chen",
      title: "CTO, TechStart Inc.",
      company: "TechStart Inc.",
      avatar: "/avatar.png",
      content: "Working with Marc transformed our digital presence. His technical expertise combined with exceptional design sensibility resulted in a platform that not only looks stunning but performs flawlessly under heavy load.",
      rating: 5,
      date: "March 2024",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "Product Director, GlobalSolutions",
      company: "GlobalSolutions",
      avatar: "/avatar.png",
      content: "Marc's ability to translate complex business requirements into elegant technical solutions is unparalleled. He delivered our enterprise application two weeks ahead of schedule while exceeding all quality benchmarks.",
      rating: 5,
      date: "January 2024",
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      title: "Lead Researcher, Innovation Labs",
      company: "Innovation Labs",
      avatar: "/avatar.png",
      content: "The level of innovation and creativity Marc brought to our project was extraordinary. He doesn't just write code—he creates digital experiences that resonate with users on an emotional level.",
      rating: 5,
      date: "November 2023",
    },
    {
      id: 4,
      name: "Alex Turner",
      title: "Founder, StartupXYZ",
      company: "StartupXYZ",
      avatar: "/avatar.png",
      content: "As a non-technical founder, I was initially apprehensive about the development process. Marc's clear communication, patience, and technical excellence made the entire journey enjoyable and successful.",
      rating: 4,
      date: "September 2023",
    },
  ], []);

  useEffect(() => {
    // Auto-rotate testimonials every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section
      className="pt-24 pb-16 px-4 relative z-10 overflow-hidden"
      id="testimonials"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating quotation marks */}
        <div className="absolute" style={{ top: "-5%", left: "-5%", width: "150px", height: "150px" }}>
          <motion.div
            className="w-full h-full flex items-center justify-center"
            style={{
              fontSize: "80px",
              color: "rgba(0,255,255,0.05)",
              fontFamily: "'Georgia', serif",
            }}
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              rotate: [-10, 10, -10],
              transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            &ldquo;
          </motion.div>
        </div>

        <div className="absolute" style={{ bottom: "-5%", right: "-5%", width: "150px", height: "150px" }}>
          <motion.div
            className="w-full h-full flex items-center justify-center"
            style={{
              fontSize: "80px",
              color: "rgba(138,43,226,0.05)",
              fontFamily: "'Georgia', serif",
            }}
            initial={{ scale: 0.5, rotate: 10 }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              rotate: [10, -10, 10],
              transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              },
            }}
          >
            &rdquo;
          </motion.div>
        </div>

        {/* Floating stars */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                backgroundColor: "#ffffff",
                borderRadius: "50%",
                opacity: Math.random() * 0.6 + 0.2,
              }}
              initial={{ opacity: 0.2 }}
              animate={{
                opacity: [0.2, 1, 0.2],
                transition: {
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3,
                },
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 1.2,
              delay: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 30,
            }
          }}
        >
          <h2 className="mb-8 text-4xl lg:text-5xl font-display text-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">What Others Say</span>
            <span className="ml-4 text-xl text-muted-foreground">Client Testimonials</span>
          </h2>

          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            Authentic feedback from clients who have experienced the Marc Gregory difference.
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              delay: 0.6,
              type: "spring",
            }
          }}
        >
          <Card className="glass-glow h-full">
            {/* Testimonial Content */}
            <motion.div
              key={testimonials[currentIndex].id}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  type: "spring",
                }
              }}
            >
              <CardContent className="text-center py-10">
                {/* Rating Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, index) => (
                    <motion.div
                      key={`star-${index}`}
                      className="inline-block"
                      initial={{ scale: 0.8 }}
                      animate={{
                        scale: [
                          index < testimonials[currentIndex].rating ? 1 : 0.8,
                          index < testimonials[currentIndex].rating ? 1.2 : 0.8,
                          index < testimonials[currentIndex].rating ? 1 : 0.8,
                        ],
                        transition: {
                          duration: 0.5,
                          type: "spring",
                        }
                      }}
                    >
                      <span className="text-yellow-400">⭐</span>
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial Text */}
                <motion.p
                  className="mb-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto italic"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.6,
                      type: "spring",
                    }
                  }}
                >
                  “{testimonials[currentIndex].content}”
                </motion.p>

                {/* Client Info */}
                <div className="flex items-center justify-center space-x-6">
                  {/* Avatar */}
                  <motion.div
                    className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20"
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: [0.8, 1.1, 0.9],
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }
                    }}
                  >
                    <img
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Info */}
                  <div className="text-left">
                    <motion.p
                      className="mb-1 font-semibold text-lg"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: 0.5,
                          type: "spring",
                        }
                      }}
                    >
                      {testimonials[currentIndex].name}
                    </motion.p>
                    <motion.p
                      className="text-sm text-muted-foreground"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: 0.5,
                          type: "spring",
                        }
                      }}
                    >
                      {testimonials[currentIndex].title} at {testimonials[currentIndex].company}
                    </motion.p>
                    <motion.p
                      className="text-xs text-muted-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: 0.5,
                          type: "spring",
                        }
                      }}
                    >
                      {testimonials[currentIndex].date}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          </Card>
        </motion.div>

        {/* Navigation Dots */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              delay: 1.4,
              type: "spring",
            }
          }}
          className="flex justify-center gap-3 mt-8"
        >
          {testimonials.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full bg-primary/5 transition-all duration-300 ${
                currentIndex === index ? "bg-primary w-6" : ""
              }`}
              initial={{ scale: 0.8 }}
              animate={{
                scale: [
                  currentIndex === index ? 1 : 0.8,
                  currentIndex === index ? 1.2 : 0.8,
                  currentIndex === index ? 1 : 0.8,
                ],
                transition: {
                  duration: 0.5,
                  type: "spring",
                }
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;