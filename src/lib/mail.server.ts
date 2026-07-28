import nodemailer from "nodemailer";

// Retrieve environment variables
const smtpHost = process.env.SMTP_ADDRESS || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT || 587);
// SMTP_SSL = false for port 587 (STARTTLS), true for port 465 (SSL)
const smtpSecure = process.env.SMTP_SSL === "true" || smtpPort === 465;
const smtpUser = process.env.SMTP_USERNAME;
const smtpPass = process.env.SMTP_PASSWORD;
const defaultSender = process.env.MAILER_SENDER_EMAIL || smtpUser || "";
const rejectUnauthorized = process.env.SMTP_OPENSSL_VERIFY_MODE !== "none";

let transporter: nodemailer.Transporter | null = null;

/**
 * Initializes and returns the nodemailer SMTP transporter
 */
function getTransporter() {
  if (transporter) return transporter;

  if (!smtpUser || !smtpPass) {
    console.warn("Aviso: Credenciais de SMTP não configuradas. Os e-mails serão apenas exibidos no console.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      // If SMTP_OPENSSL_VERIFY_MODE is peer, verify certificate, otherwise ignore validation
      rejectUnauthorized: rejectUnauthorized,
    },
  });

  return transporter;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Sends an email using the configured SMTP server.
 * If credentials are not set, it logs the email to the console.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
}: SendEmailOptions) {
  const mailTransporter = getTransporter();
  const sender = from || defaultSender;

  const mailOptions = {
    from: sender,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ""), // Simple fallback to plain text if not provided
  };

  if (!mailTransporter) {
    console.log("=== [EMAIL LOG MOCK] ===");
    console.log(`De: ${mailOptions.from}`);
    console.log(`Para: ${mailOptions.to}`);
    console.log(`Assunto: ${mailOptions.subject}`);
    console.log(`Corpo (HTML): ${mailOptions.html}`);
    console.log("=========================");
    return { mock: true, messageId: "mock-id-" + Date.now() };
  }

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`E-mail enviado com sucesso! Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erro ao enviar e-mail via SMTP:", error);
    throw error;
  }
}
