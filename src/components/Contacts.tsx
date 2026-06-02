import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowUpRight,
  Clock,
  Loader,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { emailClient } from "@/email/client-email";

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

type ContactFormData = z.infer<typeof contactFormSchema>;

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "marcgregory.developer@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(+63) 991 890 0518",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Misamis Oriental, PH",
  },
  {
    icon: Clock,
    label: "Availability",
    value: "Open for opportunities",
  },
];

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-2 text-xs text-rose-300">{message}</p> : null;

type ContactsProps = {
  onStartConversation: () => void;
};

const Contacts = ({ onStartConversation }: ContactsProps) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      try {
        setIsSuccess(false);
        const response = await emailClient(
          `${data.firstName} ${data.lastName}`,
          data.subject,
          data.email,
          data.message
        );

        if (response.status === 200) {
          setIsSuccess(true);
          reset();
        }
      } catch {
        setError("root", {
          message: "Something went wrong. Please try again later.",
        });
      }
    },
    [reset, setError]
  );

  return (
    <section id="contact" className="relative z-10 py-24">
      <div className="site-shell grid gap-10 lg:max-w-[1200px] lg:grid-cols-[minmax(240px,0.68fr)_minmax(0,1.62fr)] lg:items-center xl:grid-cols-[minmax(300px,0.7fr)_minmax(820px,1.6fr)]">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.62 }}
        >
          <p className="section-kicker mb-5">Get In Touch</p>
          <h2 className="max-w-lg text-4xl font-black leading-tight tracking-[-0.04em] text-foreground dark:text-white md:text-5xl">
            Let&apos;s Build Something Amazing{" "}
            <span className="text-gradient">Together</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-muted-foreground dark:text-slate-400">
            I&apos;m always open to discussing new opportunities, interesting
            projects, or just having a chat about technology and development.
          </p>
          <Button
            onClick={onStartConversation}
            className="button-gradient mt-9 h-14 cursor-pointer rounded-lg px-7 text-base font-bold text-white hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,118,110,0.26)] dark:hover:shadow-[0_20px_48px_rgba(124,58,237,0.48)]"
          >
            Start a Conversation <ArrowUpRight className="size-4" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.68 }}
          className="glass-panel overflow-hidden rounded-2xl"
        >
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] xl:grid-cols-[minmax(420px,1.1fr)_minmax(320px,0.9fr)]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="min-w-0 space-y-4 border-slate-900/10 p-5 md:p-8 dark:border-white/10 lg:border-r lg:pr-9 xl:pr-10"
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <h3 className="text-lg font-black text-foreground dark:text-white">
                  Send me a message
                </h3>
                {isSuccess && (
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    Message sent
                  </span>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,1fr))]">
                <div className="min-w-0">
                  <Input
                    {...register("firstName")}
                    name="firstName"
                    placeholder="First name"
                    autoComplete="given-name"
                    className="h-12 border-slate-900/10 bg-white/70 text-foreground placeholder:text-muted-foreground dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-500"
                  />
                  <FieldError message={errors.firstName?.message} />
                </div>
                <div className="min-w-0">
                  <Input
                    {...register("lastName")}
                    placeholder="Last name"
                    autoComplete="family-name"
                    className="h-12 border-slate-900/10 bg-white/70 text-foreground placeholder:text-muted-foreground dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-500"
                  />
                  <FieldError message={errors.lastName?.message} />
                </div>
              </div>

              <div className="min-w-0">
                <Input
                  {...register("email")}
                  placeholder="Email address"
                  autoComplete="email"
                  className="h-12 border-slate-900/10 bg-white/70 text-foreground placeholder:text-muted-foreground dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-500"
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div className="min-w-0">
                <Input
                  {...register("subject")}
                  placeholder="Subject"
                  autoComplete="off"
                  className="h-12 border-slate-900/10 bg-white/70 text-foreground placeholder:text-muted-foreground dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-500"
                />
                <FieldError message={errors.subject?.message} />
              </div>

              <div className="min-w-0">
                <Textarea
                  {...register("message")}
                  placeholder="Your message"
                  autoComplete="off"
                  className="min-h-36 resize-none border-slate-900/10 bg-white/70 text-foreground placeholder:text-muted-foreground dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-500"
                />
                <FieldError message={errors.message?.message} />
              </div>

              <Button
                disabled={isSubmitting}
                type="submit"
                className="button-gradient h-13 w-full rounded-lg font-bold text-white hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,118,110,0.24)] dark:hover:shadow-[0_18px_42px_rgba(124,58,237,0.45)]"
              >
                {isSubmitting ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  <>
                    <Send className="size-4" /> Send Message
                  </>
                )}
              </Button>

              {errors.root && (
                <p className="text-center text-sm text-rose-300">
                  {errors.root.message}
                </p>
              )}
            </form>

            <aside className="min-w-0 space-y-7 p-5 md:p-8 lg:pl-9 xl:pl-10">
              {contactItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-teal-700/20 bg-teal-500/10 text-teal-700 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-200">
                    <Icon className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-foreground dark:text-white">
                      {label}
                    </span>
                    <span className="mt-1 block break-words text-sm leading-6 text-muted-foreground dark:text-slate-400">
                      {value}
                    </span>
                  </span>
                </div>
              ))}
            </aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contacts;
