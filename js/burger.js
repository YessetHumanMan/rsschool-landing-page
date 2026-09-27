(() => {
  const MOBILE_QUERY = "(max-width: 768px)";

  const initializeBurger = () => {
    const header = document.querySelector(".header");
    const navigation = document.querySelector(".navigation");
    const burger = document.querySelector(".burger");

    if (!header || !navigation || !burger) {
      return;
    }

    const mobileMedia = window.matchMedia(MOBILE_QUERY);

    const updateMenuPosition = () => {
      document.documentElement.style.setProperty(
        "--mobile-menu-top",
        `${header.getBoundingClientRect().bottom}px`,
      );
    };

    const setMenuState = (isOpen) => {
      const shouldOpen = isOpen && mobileMedia.matches;

      navigation.classList.toggle("navigation--open", shouldOpen);
      burger.classList.toggle("burger--active", shouldOpen);
      document.body.classList.toggle("menu-open", shouldOpen);
      burger.setAttribute("aria-expanded", String(shouldOpen));
      burger.setAttribute(
        "aria-label",
        shouldOpen ? "Закрыть меню" : "Открыть меню",
      );

      if (shouldOpen) {
        updateMenuPosition();
      }
    };

    burger.addEventListener("click", () => {
      setMenuState(!navigation.classList.contains("navigation--open"));
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navigation.classList.contains("navigation--open")) {
        setMenuState(false);
        burger.focus();
      }
    });

    mobileMedia.addEventListener("change", () => setMenuState(false));
    window.addEventListener("resize", () => {
      if (navigation.classList.contains("navigation--open")) {
        updateMenuPosition();
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeBurger);
  } else {
    initializeBurger();
  }
})();
