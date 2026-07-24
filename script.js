// Simple enhancements for the Weather, Climate & Health group site

document.addEventListener("DOMContentLoaded", () => {
  try {
    setupYearAndLastUpdated();
    setupEventOrder();
  } catch (error) {
    console.error("Error initializing page:", error);
  }
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

function setupEventOrder() {
  const events = Array.from(document.querySelectorAll(".event-item"));
  const list = document.getElementById("events-list");

  if (!events.length || !list) return;

  // Show all events, most recent first.
  const sorted = [...events].sort((a, b) => {
    const da = a.getAttribute("data-date") || "";
    const db = b.getAttribute("data-date") || "";
    return db.localeCompare(da);
  });

  list.innerHTML = "";
  sorted.forEach((event) => {
    list.appendChild(event);
    event.style.display = "";
  });
}
