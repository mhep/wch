// Simple enhancements for the Weather, Climate & Health group site

document.addEventListener("DOMContentLoaded", () => {
  setupYearAndLastUpdated();
  setupEventFilters();
});

function setupYearAndLastUpdated() {
  const yearEl = document.getElementById("year");
  const updatedEl = document.getElementById("last-updated");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (updatedEl) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    updatedEl.textContent = formatter.format(now);
  }
}

function setupEventFilters() {
  const buttons = Array.from(document.querySelectorAll(".filter-button"));
  const events = Array.from(document.querySelectorAll(".event-item"));
  const list = document.getElementById("events-list");

  if (!buttons.length || !events.length || !list) return;

  const applyFilter = (activeButton, filter) => {
    buttons.forEach((btn) => btn.classList.toggle("is-active", btn === activeButton));

    // Always keep list in chronological order based on data-date
    const sorted = events
      .slice()
      .sort((a, b) => {
        const da = a.getAttribute("data-date") || "";
        const db = b.getAttribute("data-date") || "";
        return da.localeCompare(db);
      });

    sorted.forEach((event) => {
      list.appendChild(event);
      const status = event.getAttribute("data-status") || "all";
      const show = filter === "all" || filter === status;
      event.style.display = show ? "" : "none";
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter") || "all";
      applyFilter(button, filter);
    });
  });

  // Default view: upcoming events only, in the DOM order (already chronological)
  const defaultButton = buttons.find((btn) => btn.getAttribute("data-filter") === "upcoming");
  if (defaultButton) {
    applyFilter(defaultButton, "upcoming");
  }
}


