import emailjs from "@emailjs/browser";

const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;

const emailClient = (
  name: string,
  subject: string,
  email: string,
  message: string
) => {
  const templateParams = {
    name,
    email,
    subject: !subject ? `You’ve received a new message – ${name}` : subject,
    message,
    time: new Date().toLocaleString(),
  };

  return emailjs
    .send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
    })
    .then(
      (response) => response,

      (err) => err
    );
};

export { emailClient };
