// Main application entry point

import state from "./state.js";
import { showStatus } from "./ui.js";
import { initDarkMode } from "./dark-mode.js";

// Initialize dark mode
initDarkMode();

/**
 * Initialize the application
 */
function init() {
  try {
    // Check for service worker support
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("ServiceWorker registration successful");
          })
          .catch((error) => {
            console.error("ServiceWorker registration failed:", error);
          });
      });
    }

    // Handle offline/online status
    window.addEventListener("online", () => {
      showStatus("You are back online", "success");
    });

    window.addEventListener("offline", () => {
      showStatus(
        "You are currently offline. Some features may be limited.",
        "warning"
      );
    });

    // Initial status check
    if (!navigator.onLine) {
      showStatus(
        "You are currently offline. Some features may be limited.",
        "warning"
      );
    }

    // Handle beforeunload to save any pending changes
    window.addEventListener("beforeunload", (e) => {
      // If there are unsaved changes, prompt the user
      // This is a simplified example - in a real app, you'd track unsaved changes
      // const hasUnsavedChanges = checkForUnsavedChanges();
      // if (hasUnsavedChanges) {
      //     e.preventDefault();
      //     e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      //     return e.returnValue;
      // }
    });

    // Show welcome message
    setTimeout(() => {
      showStatus("Welcome to Student Finance Tracker!", "success");
    }, 1000);
  } catch (error) {
    console.error("Error initializing application:", error);
    showStatus(
      "Failed to initialize the application. Please refresh the page.",
      "error"
    );
  }
}

// Initialize the application when the DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  // DOMContentLoaded has already fired
  init();
}

// Export the state for debugging/console access
window.appState = state;
