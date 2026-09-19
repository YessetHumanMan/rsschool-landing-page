(() => {
  const STORAGE_KEY = "simplefood-theme";
  const LIGHT_THEME = "light";
  const DARK_THEME = "dark";
  const root = document.documentElement;

  const getStoredTheme = () => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === LIGHT_THEME || value === DARK_THEME ? value : null;
    } catch {
      return null;
    }
  };

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();

    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK_THEME
      : LIGHT_THEME;
  };

  const updatePageTheme = (theme) => {
    root.dataset.theme = theme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = theme === DARK_THEME ? "#1d1f2b" : "#f9faff";
    }
  };

  const updateSwitch = (button, theme) => {
    const isDark = theme === DARK_THEME;
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute(
      "aria-label",
      isDark ? "Включить светлую тему" : "Включить тёмную тему",
    );
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The selected theme still works for the current page if storage is unavailable.
    }
  };

  const applyTheme = (theme, buttons = []) => {
    updatePageTheme(theme);
    buttons.forEach((button) => updateSwitch(button, theme));
  };

  const initialTheme = getPreferredTheme();
  updatePageTheme(initialTheme);

  const initializeThemeSwitches = () => {
    const buttons = [...document.querySelectorAll(".theme-switch")];
    applyTheme(root.dataset.theme, buttons);

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme =
          root.dataset.theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

        applyTheme(nextTheme, buttons);
        saveTheme(nextTheme);
      });
    });

    window.addEventListener("storage", (event) => {
      if (
        event.key === STORAGE_KEY &&
        (event.newValue === LIGHT_THEME || event.newValue === DARK_THEME)
      ) {
        applyTheme(event.newValue, buttons);
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeThemeSwitches);
  } else {
    initializeThemeSwitches();
  }
})();
