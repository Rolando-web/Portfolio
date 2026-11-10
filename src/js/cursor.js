const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function initCursor() {
  if (!finePointer.matches || reducedMotion.matches) return;
  if (document.querySelector(".cursor")) return;

  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = '<span class="cursor-ring"></span><span class="cursor-dot"></span>';

  document.body.appendChild(cursor);
  document.body.classList.add("has-cursor");

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let ringX = pointerX;
  let ringY = pointerY;
  let frame = 0;

  const interactive = "a, button, [role='button'], summary, input, textarea, select, label";

  function render() {
    frame = 0;
    ringX += (pointerX - ringX) * 0.16;
    ringY += (pointerY - ringY) * 0.16;

    cursor.style.setProperty("--cx", `${ringX.toFixed(2)}px`);
    cursor.style.setProperty("--cy", `${ringY.toFixed(2)}px`);

    if (Math.abs(pointerX - ringX) > 0.2 || Math.abs(pointerY - ringY) > 0.2) {
      frame = requestAnimationFrame(render);
    }
  }

  function queue() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.style.opacity = "1";
      if (event.target instanceof Element) {
        cursor.classList.toggle("is-active", Boolean(event.target.closest(interactive)));
      }
      queue();
    },
    { passive: true }
  );

  window.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
  window.addEventListener("pointerup", () => cursor.classList.remove("is-down"));

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
  });

  const disable = () => {
    document.body.classList.remove("has-cursor");
    cursor.remove();
  };

  finePointer.addEventListener?.("change", (event) => {
    if (!event.matches) disable();
  });
  reducedMotion.addEventListener?.("change", (event) => {
    if (event.matches) disable();
  });
}
