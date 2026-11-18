const EMAIL_TIME_ZONE = "Asia/Manila";

/**
 * Format the submission time for the EmailJS template's `{{time}}` variable.
 * The recipient is in Davao, so the timestamp stays in Philippine time.
 */
export function formatEmailTime(date = new Date()) {
  const formatted = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: EMAIL_TIME_ZONE,
  }).format(date);

  return `${formatted} PHT`;
}

/**
 * Map the contact form values onto the EmailJS template variables.
 *
 * The live template body uses `{{name}}`, `{{time}}`, `{{Email}}`, and
 * `{{message}}`. `email`, `title`, and `reply_to` are sent as well so changing
 * the template copy does not silently blank the sender or subject.
 */
export function buildEmailParams(values, date = new Date()) {
  const email = values.email.trim();

  return {
    name: values.name.trim(),
    Email: email,
    email,
    title: values.title.trim(),
    message: values.message.trim(),
    time: formatEmailTime(date),
    reply_to: email,
  };
}
