import state from "./state.js";
import { showStatus } from "./ui.js";
import { initDarkMode } from "./dark-mode.js";

initDarkMode();

function init() {
  try {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("./service-worker.js")
          .catch((error) =>
            console.error("ServiceWorker registration failed:", error)
          );
      });
    }

    window.addEventListener("online", () =>
      showStatus("You are back online", "success")
    );
    window.addEventListener("offline", () =>
      showStatus(
        "You are currently offline. Some features may be limited.",
        "warning"
      )
    );

    if (!navigator.onLine) {
      showStatus(
        "You are currently offline. Some features may be limited.",
        "warning"
      );
    }

    window.addEventListener("beforeunload", () => {});

    setTimeout(
      () => showStatus("Welcome to Student Finance Tracker!", "success"),
      1000
    );
  } catch (error) {
    console.error("Error initializing application:", error);
    showStatus(
      "Failed to initialize the application. Please refresh the page.",
      "error"
    );
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

window.appState = state;
