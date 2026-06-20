const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

// Small mobile navigation helper; no framework needed for this interaction.
if (toggle && links) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    links.classList.toggle("open");
  });
}

const form = document.querySelector("[data-enquiry-form]");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // The demo form is intentionally static until a real endpoint is chosen.
    const status = form.querySelector("[data-form-status]");
    if (status) status.textContent = "Thank you. This static demo form is ready to connect to your preferred mail or CRM endpoint.";
  });
}
