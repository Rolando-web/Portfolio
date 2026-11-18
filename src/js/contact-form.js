import config from "./config.js";
import { buildEmailParams } from "./email-params.js";
import { createRateLimiter, formatWait } from "./rate-limit.js";

const MIN_FILL_MS = 3000;
const LIMITS = {
  name: { min: 2, max: 80 },
  email: { min: 5, max: 120 },
  title: { min: 3, max: 120 },
  message: { min: 10, max: 2000 },
};

const limiter = createRateLimiter({
  key: "portfolio:contact:v1",
  cooldownMs: 60_000,
  windowMs: 10 * 60_000,
  maxInWindow: 3,
});

export function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = document.getElementById("formStatus");
  const submit = form.querySelector('button[type="submit"]');
  const submitLabel = submit?.querySelector("[data-label]") || submit;
  const honeypot = form.querySelector('[name="company"]');
  let sending = false;
  let firstInteraction = 0;

  if (window.emailjs && config.configured) {
    window.emailjs.init({ publicKey: config.publicKey });
  }

  function setStatus(message, state = "") {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  }

  function fieldWrap(id) {
    return form.querySelector(`#${id}`)?.closest(".field");
  }

  function setFieldError(id, message) {
    const input = form.querySelector(`#${id}`);
    const error = form.querySelector(`[data-error-for="${id}"]`);
    const wrap = fieldWrap(id);

    wrap?.classList.toggle("has-error", Boolean(message));
    if (input) input.setAttribute("aria-invalid", message ? "true" : "false");

    if (error) {
      error.textContent = message || "";
      error.hidden = !message;
    }
  }

  function clearErrors() {
    Object.keys(LIMITS).forEach((id) => setFieldError(id, ""));
    setStatus("");
  }

  function validate(values) {
    const errors = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const title = values.title.trim();
    const message = values.message.trim();

    if (name.length < LIMITS.name.min) {
      errors.name = "Enter your name.";
    } else if (name.length > LIMITS.name.max) {
      errors.name = `Keep it under ${LIMITS.name.max} characters.`;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      errors.email = "Enter a valid email address.";
    } else if (email.length > LIMITS.email.max) {
      errors.email = "That email is too long.";
    }

    if (title.length < LIMITS.title.min) {
      errors.title = "Add a project title.";
    } else if (title.length > LIMITS.title.max) {
      errors.title = `Keep it under ${LIMITS.title.max} characters.`;
    }

    if (message.length < LIMITS.message.min) {
      errors.message = "Tell me a little more about the project.";
    } else if (message.length > LIMITS.message.max) {
      errors.message = `Keep it under ${LIMITS.message.max} characters.`;
    }

    return errors;
  }

  form.addEventListener("input", (event) => {
    if (!firstInteraction) firstInteraction = Date.now();
    const target = event.target;
    if (target?.id && LIMITS[target.id]) {
      setFieldError(target.id, "");
    }
    if (status?.dataset.state === "error") setStatus("");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;

    const values = {
      name: form.elements.name?.value || "",
      email: form.elements.email?.value || "",
      title: form.elements.title?.value || "",
      message: form.elements.message?.value || "",
    };

    // Honeypot: real users never see or fill this.
    if (honeypot?.value) {
      form.reset();
      setStatus("Message sent. Thanks for reaching out.", "success");
      return;
    }

    if (firstInteraction && Date.now() - firstInteraction < MIN_FILL_MS) {
      setStatus("Please take a moment to review your message.", "error");
      return;
    }

    clearErrors();
    const errors = validate(values);
    const errorIds = Object.keys(errors);

    if (errorIds.length) {
      errorIds.forEach((id) => setFieldError(id, errors[id]));
      setStatus("Check the highlighted fields and try again.", "error");
      form.querySelector(`#${errorIds[0]}`)?.focus();
      return;
    }

    const limit = limiter.status();
    if (!limit.allowed) {
      const wait = formatWait(limit.retryAfterMs);
      setStatus(
        `Too many attempts. Try again in ${wait}, or email tluayon7@gmail.com.`,
        "error"
      );
      return;
    }

    if (!config.configured || !config.serviceId?.startsWith("service_")) {
      setStatus(
        "The form is being configured. Email tluayon7@gmail.com for now.",
        "error"
      );
      return;
    }

    if (!window.emailjs) {
      setStatus(
        "The email service did not load. Email tluayon7@gmail.com instead.",
        "error"
      );
      return;
    }

    sending = true;
    limiter.record();
    submit?.setAttribute("aria-busy", "true");
    if (submit) submit.disabled = true;
    if (submitLabel) submitLabel.textContent = "Sending";
    setStatus("Sending your message…");

    try {
      await window.emailjs.send(
        config.serviceId,
        config.templateId,
        buildEmailParams(values)
      );

      form.reset();
      firstInteraction = 0;
      setStatus("Message sent. I will reply within two business days.", "success");
    } catch (error) {
      setStatus(
        "Could not send right now. Email tluayon7@gmail.com or try again shortly.",
        "error"
      );
      console.error("EmailJS send failed:", error);
    } finally {
      sending = false;
      submit?.removeAttribute("aria-busy");
      if (submit) submit.disabled = false;
      if (submitLabel) submitLabel.textContent = "Send message";
    }
  });
}
