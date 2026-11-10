export function initSwiper() {
  if (!window.Swiper) {
    console.warn("Swiper failed to load; project cards remain scrollable.");
    return null;
  }

  return new window.Swiper(".projectSwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    grabCursor: true,
    a11y: { enabled: true },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
}
