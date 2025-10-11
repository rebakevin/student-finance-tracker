/**
 * Initialize navigation routing
 */
function initRouting() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetSection = e.currentTarget.getAttribute("data-section");

      document.querySelectorAll(".section").forEach((section) => {
        section.classList.remove("active");
      });
      document.querySelectorAll(".nav-link").forEach((nav) => {
        nav.classList.remove("active");
      });

      document.getElementById(targetSection).classList.add("active");
      e.currentTarget.classList.add("active");

      window.location.hash = targetSection;
    });
  });
}

// Wait for components to be loaded before initializing routing
document.addEventListener('componentsLoaded', initRouting);

// Fallback: if components are already loaded, initialize immediately
if (document.querySelector('.nav-link')) {
  initRouting();
}
