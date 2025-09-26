import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, Phone, MapPin, Send, Loader } from "lucide-react";
import { emailClient } from "@/email/client-email";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const contactFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name required." }),
  lastName: z.string().min(2, { message: "Last name required." }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters." }),
  email: z.string().email("Invalid email address."),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

const Contact = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
    try {
      setIsSuccess(false);
      const response = await emailClient(
        data.firstName + " " + data.lastName,
        data.subject,
        data.email,
        data.message
      );

      if (response.status === 200) {
        setIsSuccess(true);
      }
      reset();
    } catch {
      setError("root", {
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <section className="py-20 px-4 relative z-10" id="contact">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-white text-[22px]">Get In Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from
            you!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p>Email</p>
                    <p className="text-muted-foreground">
                      marcgregory.developer@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p>Phone</p>
                    <p className="text-muted-foreground">(+63) 9918900518</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p>Location</p>
                    <p className="text-muted-foreground">
                      Misamis Oriental, PH
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <p className="mb-4">
                    Let's connect and build something amazing together!
                  </p>
                  <p className="text-muted-foreground">
                    I'm always open to discussing new opportunities, interesting
                    projects, or just having a chat about technology and
                    development.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  Send a Message{"    "}
                  {isSuccess && (
                    <span className="text-green-500">✓message sent!</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        {...register("firstName")}
                        placeholder="First Name"
                        autoComplete="off"
                      />
                      {errors["firstName"] && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors["firstName"].message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        {...register("lastName")}
                        placeholder="Last Name"
                        autoComplete="off"
                      />
                      {errors["lastName"] && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors["lastName"].message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Input
                      {...register("email")}
                      placeholder="Email Address"
                      autoComplete="off"
                    />
                    {errors["email"] && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors["email"].message}
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Subject"
                      autoComplete="off"
                      {...register("subject")}
                    />
                    {errors["subject"] && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors["subject"].message}
                      </div>
                    )}
                  </div>

                  <Textarea
                    placeholder="Your message..."
                    className="min-h-[120px] resize-none"
                    autoComplete="off"
                    {...register("message")}
                  />
                  {errors["message"] && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors["message"].message}
                    </div>
                  )}
                  <Button
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                    className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                  {errors.root && (
                    <div className="text-center text-sm text-red-500">
                      {errors.root.message}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
