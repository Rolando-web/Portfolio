const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function initProjectModal() {
  const modal = document.getElementById("projectModal");
  if (!modal) return;

  const panel = modal.querySelector(".modal-panel");
  const closeBtn = document.getElementById("closeModal");
  const carousel = document.getElementById("carouselImages");
  const indicators = document.getElementById("carouselIndicators");
  const gallery = document.getElementById("modalGallery");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const visitSiteBtn = document.getElementById("visitSiteBtn");
  const visitLabel = visitSiteBtn?.querySelector("[data-label]");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentSlide = 0;
  let totalSlides = 0;
  let autoSlide;
  let lastFocused = null;
  let hovering = false;
  let focusInside = false;
  let suppressFocusPause = false;

  function syncAutoSlide() {
    window.clearInterval(autoSlide);
    if (modal.hidden || reducedMotion.matches || totalSlides < 2) return;
    if (hovering || focusInside) return;
    autoSlide = window.setInterval(nextSlide, 4000);
  }

  function startAutoSlide() {
    syncAutoSlide();
  }

  function stopAutoSlide() {
    window.clearInterval(autoSlide);
  }

  function updateCarousel() {
    if (!carousel) return;
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    indicators
      ?.querySelectorAll(".carousel-indicator")
      .forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
        dot.setAttribute("aria-current", index === currentSlide ? "true" : "false");
      });
  }

  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    startAutoSlide();
  }

  function nextSlide() {
    if (totalSlides < 2) return;
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    if (totalSlides < 2) return;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  function openModal(card) {
    const title = card.dataset.title || "Project";
    const description = card.dataset.description || "";
    const url = card.dataset.url || "";
    let images = [];
    try {
      images = JSON.parse(card.dataset.images || "[]");
    } catch {
      images = [];
    }

    if (modalTitle) modalTitle.textContent = title;
    if (modalDescription) {
      modalDescription.textContent =
        description || "Project details are being prepared.";
    }

    if (visitSiteBtn) {
      if (url) {
        visitSiteBtn.href = url;
        visitSiteBtn.hidden = false;
        if (visitLabel) {
          visitLabel.textContent = card.dataset.urlLabel || "Visit site";
        }
      } else {
        visitSiteBtn.hidden = true;
      }
    }

    carousel.innerHTML = "";
    indicators.innerHTML = "";

    if (!images.length) {
      const empty = document.createElement("div");
      empty.className = "carousel-empty";
      const note = document.createElement("p");
      note.textContent =
        "Screenshots pending. The live service was unavailable when this gallery was captured.";
      empty.appendChild(note);
      carousel.appendChild(empty);
      gallery?.classList.add("is-empty");
    } else {
      gallery?.classList.remove("is-empty");
      images.forEach((src, index) => {
        const slide = document.createElement("div");
        slide.className = "carousel-slide";
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${title} — screenshot ${index + 1}`;
        img.loading = index === 0 ? "eager" : "lazy";
        img.decoding = "async";
        slide.appendChild(img);
        carousel.appendChild(slide);

        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `carousel-indicator${index === 0 ? " active" : ""}`;
        dot.setAttribute("aria-label", `Show screenshot ${index + 1}`);
        dot.setAttribute("aria-current", index === 0 ? "true" : "false");
        dot.addEventListener("click", () => goToSlide(index));
        indicators.appendChild(dot);
      });
    }

    totalSlides = images.length;
    currentSlide = 0;
    updateCarousel();

    [prevBtn, nextBtn].forEach((button) => {
      if (!button) return;
      button.hidden = totalSlides < 2;
    });
    if (indicators) indicators.hidden = totalSlides < 2;

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("menu-open");
    suppressFocusPause = true;
    closeBtn?.focus({ preventScroll: true });
    suppressFocusPause = false;
    startAutoSlide();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("menu-open");
    stopAutoSlide();
    hovering = false;
    focusInside = false;
    lastFocused?.focus({ preventScroll: true });
    lastFocused = null;
  }

  document.querySelectorAll(".view-project-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const card = button.closest(".project-card");
      if (card) openModal(card);
    });
  });

  closeBtn?.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    startAutoSlide();
  });

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    startAutoSlide();
  });

  panel?.addEventListener("pointerenter", () => {
    hovering = true;
    stopAutoSlide();
  });
  panel?.addEventListener("pointerleave", () => {
    hovering = false;
    syncAutoSlide();
  });
  panel?.addEventListener("focusin", () => {
    if (suppressFocusPause) return;
    focusInside = true;
    stopAutoSlide();
  });
  panel?.addEventListener("focusout", (event) => {
    if (panel.contains(event.relatedTarget)) return;
    focusInside = false;
    syncAutoSlide();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoSlide();
    else if (!modal.hidden) startAutoSlide();
  });

  reducedMotion.addEventListener?.("change", () => {
    if (modal.hidden) return;
    if (reducedMotion.matches) stopAutoSlide();
    else startAutoSlide();
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key === "ArrowLeft") {
      prevSlide();
      startAutoSlide();
      return;
    }

    if (event.key === "ArrowRight") {
      nextSlide();
      startAutoSlide();
      return;
    }

    if (event.key !== "Tab" || !panel) return;

    const items = [...panel.querySelectorAll(focusableSelector)].filter(
      (element) => !element.hidden && element.offsetParent !== null
    );
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
