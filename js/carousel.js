(() => {
  const initializeCarousel = () => {
    const carousel = document.querySelector(".reviews__carousel");

    if (!carousel) {
      return;
    }

    const track = carousel.querySelector(".reviews__track");
    const slides = [...carousel.querySelectorAll(".reviews__slide")];
    const previousButton = carousel.querySelector(".reviews__arrow--previous");
    const nextButton = carousel.querySelector(
      ".reviews__arrow:not(.reviews__arrow--previous)",
    );
    const dots = [...carousel.querySelectorAll(".reviews__dot")];

    if (!track || slides.length < 3 || !previousButton || !nextButton) {
      return;
    }

    let activeIndex = 0;

    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${activeIndex * 100}%)`;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle("reviews__slide--active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle("reviews__dot--active", isActive);

        if (isActive) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    };

    previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
    nextButton.addEventListener("click", () => showSlide(activeIndex + 1));

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });

    window.addEventListener("resize", () => showSlide(activeIndex));
    showSlide(0);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCarousel);
  } else {
    initializeCarousel();
  }
})();
