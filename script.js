// Simple enhancements for the Weather, Climate & Health group site

document.addEventListener("DOMContentLoaded", () => {
  setupYearAndLastUpdated();
  setupEventFilters();
  setupPosterButton();
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

function setupPosterButton() {
  const button = document.getElementById("print-poster-button");
  if (!button) return;

  button.addEventListener("click", () => {
    const events = Array.from(document.querySelectorAll(".event-item[data-status='upcoming']"));
    if (!events.length) return;

    const sorted = events
      .slice()
      .sort((a, b) => {
        const da = a.getAttribute("data-date") || "";
        const db = b.getAttribute("data-date") || "";
        return da.localeCompare(db);
      });

    const itemsHtml = sorted
      .map((event) => {
        const date = event.querySelector(".event-date")?.textContent.trim() || "";
        const time = event.querySelector(".event-time")?.textContent.trim() || "";
        const title = event.querySelector(".event-title")?.textContent.trim() || "";
        const location = event.querySelector(".event-location")?.textContent.trim() || "";
        const description = event.querySelector(".event-description")?.textContent.trim() || "";
        const format = event.querySelector(".event-tag--format")?.textContent.trim() || "";
        const kind = event.querySelector(".event-tag--kind")?.textContent.trim() || "";
        const typeLine = [format, kind].filter(Boolean).join(" · ");

        return `
      <div class="poster-event-row">
        <div class="poster-event-meta">
          <div class="poster-event-date">${date}</div>
          <div class="poster-event-time">${time}</div>
        </div>
        <div class="poster-event-content">
          <div class="poster-event-title">${title}</div>
          <div class="poster-event-type">${typeLine}</div>
          <div class="poster-event-location">${location}</div>
          <div class="poster-event-description">${description}</div>
        </div>
      </div>`;
      })
      .join("");

    const posterHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Weather, Climate &amp; Health – Events Poster</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <style>
      :root {
        --text: #111827;
        --purple: #4b306a;
      }
      * {
        box-sizing: border-box;
      }
      html, body {
        margin: 0;
        padding: 0;
      }
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
        color: var(--text);
        background: #ffffff;
        position: relative;
      }
      .poster-page {
        padding: 24mm 20mm 20mm;
      }
      .poster-title {
        font-size: 48pt;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin: 0 0 4mm;
        color: var(--purple);
        line-height: 1.1;
      }
      .poster-subtitle {
        font-size: 13pt;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        margin: 0 0 10mm;
        line-height: 1.4;
      }
      .poster-events-heading {
        font-size: 22pt;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin: 0 0 6mm;
        color: var(--purple);
      }
      .poster-events {
        display: flex;
        flex-direction: column;
        gap: 8mm;
      }
      .qrcode-container {
        position: fixed;
        bottom: 20mm;
        right: 20mm;
      }
      .poster-event-row {
        display: grid;
        grid-template-columns: 0.9fr 1.6fr;
        column-gap: 8mm;
        break-inside: avoid;
      }
      .poster-event-meta {
        font-size: 13pt;
      }
      .poster-event-date {
        font-weight: 600;
        margin-bottom: 1mm;
      }
      .poster-event-time {
        font-size: 12pt;
      }
      .poster-event-content {
        font-size: 12pt;
      }
      .poster-event-title {
        font-size: 16pt;
        font-weight: 600;
        margin-bottom: 2mm;
      }
      .poster-event-type {
        margin-bottom: 2mm;
      }
      .poster-event-location {
        font-style: italic;
        margin-bottom: 2.5mm;
      }
      .poster-event-description {
        line-height: 1.6;
      }
      @page {
        size: A3;
        margin: 0;
      }
      @media print {
        .poster-page {
          padding: 24mm 20mm 20mm;
        }
      }
    </style>
  </head>
  <body>
    <div class="poster-page">
      <h1 class="poster-title">Weather<br>Climate<br>Health</h1>
      <p class="poster-subtitle">An Institute for Medical Humanities research theme<br>Durham University</p>
      <h2 class="poster-events-heading">Events</h2>
      <div class="poster-events">
        ${itemsHtml}
      </div>
    </div>
    <div class="qrcode-container" id="qrcode"></div>
    <script>
      new QRCode(document.getElementById("qrcode"), {
        text: "https://mhep.github.io/wch/",
        width: 180,
        height: 180,
        colorDark: "#4b306a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    </script>
  </body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.open();
    win.document.write(posterHtml);
    win.document.close();
    win.focus();
  });
}


