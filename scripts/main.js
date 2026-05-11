const sampleEvents = [
  {
    title: "Alpine Nights Festival",
    date: "15 January 2027",
    location: "St. Moritz",
    description:
      "A premium winter night with curated music, alpine atmosphere and unforgettable energy.",
    cta: "Tickets Soon",
  },
  {
    title: "Midnight Glow Party",
    date: "12 February 2027",
    location: "St. Moritz",
    description:
      "A dark and energetic party concept with lights, sound and a premium crowd experience.",
    cta: "Tickets Soon",
  },
  {
    title: "JUNO Winter Session",
    date: "26 February 2027",
    location: "St. Moritz",
    description:
      "A signature JUNO night built around music, visuals and a strong nightlife atmosphere.",
    cta: "More Info",
  },
  {
    title: "St. Moritz Sunset Beats",
    date: "13 March 2027",
    location: "St. Moritz",
    description:
      "From sunset mood to late-night energy, created for people who love sound and atmosphere.",
    cta: "More Info",
  },
  {
    title: "Private Mountain Club Night",
    date: "27 March 2027",
    location: "St. Moritz",
    description:
      "An exclusive event concept with a private club feeling and refined alpine nightlife energy.",
    cta: "Tickets Soon",
  },
];

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const eventsGrid = document.querySelector("[data-events-grid]");
const modal = document.querySelector("[data-ticket-modal]");
const modalEyebrow = document.querySelector("[data-modal-eyebrow]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const dropdowns = document.querySelectorAll("[data-dropdown]");
const navLinks = document.querySelectorAll(".nav-link[href]");
const pageNavLinks = document.querySelectorAll("[data-nav-page]");
const observedSections = document.querySelectorAll(
  "#home, #events, #news, #partner, #work, #about, #tickets"
);
let lastFocusedElement = null;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderEvents(events) {
  if (!eventsGrid) return;

  eventsGrid.innerHTML = events
    .map(
      (event, index) => `
        <article class="event-card reveal" style="transition-delay:${index * 60}ms">
          <span class="event-badge">Sample Event</span>
          <div class="event-meta">
            <span>${escapeHtml(event.date)}</span>
            <span>${escapeHtml(event.location)}</span>
          </div>
          <h3>${escapeHtml(event.title)}</h3>
          <p>${escapeHtml(event.description)}</p>
          <button
            class="btn btn-secondary"
            type="button"
            data-ticket="${escapeHtml(event.title)}"
          >
            ${escapeHtml(event.cta)}
          </button>
        </article>
      `
    )
    .join("");
}

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeNav() {
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
  siteNav?.classList.remove("is-open");
  header?.classList.remove("is-open");
  closeDropdowns();
}

function closeDropdowns(exceptDropdown = null) {
  dropdowns.forEach((dropdown) => {
    if (dropdown === exceptDropdown) return;
    dropdown.classList.remove("is-open");
    dropdown.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
  });
}

function toggleDropdown(dropdown) {
  const isOpen = dropdown.classList.contains("is-open");
  closeDropdowns(dropdown);
  dropdown.classList.toggle("is-open", !isOpen);
  dropdown.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", String(!isOpen));
}

function openEventModal(button) {
  if (!modal || !modalTitle || !modalText) return;

  lastFocusedElement = document.activeElement;
  if (modalEyebrow) modalEyebrow.textContent = "Sample Event";
  modalTitle.textContent = button.dataset.ticket || "Tickets Soon";
  modalText.textContent =
    "This is a sample event concept. Real ticket details can be added later.";
  if (!modal.open) modal.showModal();
}

function openTicketModal() {
  if (!modal || !modalTitle || !modalText) return;

  lastFocusedElement = document.activeElement;
  if (modalEyebrow) modalEyebrow.textContent = "Tickets";
  modalTitle.textContent = "Tickets";
  modalText.textContent = "Tickets will be available soon.";
  if (!modal.open) modal.showModal();
}

function closeModal() {
  if (!modal?.open) return;
  modal.close();

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

function initReveals() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initActiveLinks() {
  const currentPage = document.body.dataset.page;
  pageNavLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.navPage === currentPage);
  });

  if (currentPage === "events") {
    document.querySelector('[aria-controls="events-menu"]')?.classList.add("is-active");
  }

  if (currentPage === "about") {
    document.querySelector('[aria-controls="about-menu"]')?.classList.add("is-active");
  }

  if (!("IntersectionObserver" in window)) return;
  if (window.location.pathname.split("/").pop() !== "index.html" && window.location.pathname !== "/") return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { rootMargin: "-42% 0px -48% 0px", threshold: [0.12, 0.28, 0.5] }
  );

  observedSections.forEach((section) => observer.observe(section));
}

renderEvents(sampleEvents);
initReveals();
initActiveLinks();
setHeaderState();

window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav?.classList.toggle("is-open", !isOpen);
  header?.classList.toggle("is-open", !isOpen);
});

siteNav?.addEventListener("click", (event) => {
  const dropdownToggle = event.target instanceof Element ? event.target.closest("[data-dropdown-toggle]") : null;
  if (dropdownToggle instanceof HTMLButtonElement) {
    event.preventDefault();
    event.stopPropagation();
    const dropdown = dropdownToggle.closest("[data-dropdown]");
    if (dropdown instanceof HTMLElement) {
      toggleDropdown(dropdown);
    }
    return;
  }

  const ticketTrigger = event.target instanceof Element ? event.target.closest("[data-ticket-modal-trigger]") : null;
  if (ticketTrigger) {
    event.preventDefault();
    event.stopPropagation();
    openTicketModal();
    closeNav();
    return;
  }

  if (event.target instanceof HTMLAnchorElement) {
    closeNav();
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const dropdown = target.closest("[data-dropdown]");
  if (!dropdown && !target.closest("[data-nav-toggle]")) {
    closeDropdowns();
  }

  if (target.closest("[data-ticket-modal-trigger]")) {
    openTicketModal();
    return;
  }

  const ticketButton = target.closest("[data-ticket]");
  if (ticketButton instanceof HTMLButtonElement) {
    openEventModal(ticketButton);
    return;
  }

  if (target.closest("[data-modal-close]")) {
    closeModal();
  }
});

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNav();
    closeDropdowns();
    closeModal();
  }
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (formStatus) {
    formStatus.textContent = "Thanks. This is a sample form.";
  }
  contactForm.reset();
});
