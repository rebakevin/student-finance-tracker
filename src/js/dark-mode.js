/**
 * Dark mode functionality
 * Handles toggling between light and dark themes and persists the user's preference
 */

function applyThemeFromStorage() {
  const storedTheme = localStorage.getItem("theme") || "light";
  if (storedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function updateToggleVisualState(button) {
  if (!button) return;
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  const moonIcon = button.querySelector(".fa-moon");
  const sunIcon = button.querySelector(".fa-sun");

  if (moonIcon && sunIcon) {
    // Show sun in dark mode (indicates you can switch to light), moon in light mode
    sunIcon.style.display = isDark ? "" : "none";
    moonIcon.style.display = isDark ? "none" : "";
  }

  button.setAttribute("aria-pressed", String(isDark));
  button.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
  button.title = isDark ? "Switch to light mode" : "Switch to dark mode";
}

function bindDarkModeToggle() {
  const button = document.querySelector(".dark-mode-toggle");
  if (!button) return;

  // Make idempotent by assigning onclick (overwrites previous handlers if any)
  button.onclick = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    if (isDark) {
      html.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    updateToggleVisualState(button);
  };

  // Ensure correct initial icon/text state
  updateToggleVisualState(button);
}

// Public initializer (kept/exported for any callers)
export function initDarkMode() {
  applyThemeFromStorage();
  bindDarkModeToggle();
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDarkMode);
} else {
  initDarkMode();
}

// Re-bind after dynamic components are injected
document.addEventListener("componentsLoaded", () => {
  bindDarkModeToggle();
});
