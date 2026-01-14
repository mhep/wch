// Simple enhancements for the Weather, Climate & Health group site

document.addEventListener("DOMContentLoaded", () => {
  try {
    setupYearAndLastUpdated();
    setupEventFilters();
    setupPosterButton();
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
        const dateEl = event.querySelector(".event-date");
        const timeEl = event.querySelector(".event-time");
        const titleEl = event.querySelector(".event-title");
        const locationEl = event.querySelector(".event-location");
        const formatEl = event.querySelector(".event-tag--format");
        const kindEl = event.querySelector(".event-tag--kind");
        const descriptionEl = event.querySelector(".event-description");

        const date = dateEl ? dateEl.textContent.trim() : "";
        const time = timeEl ? timeEl.textContent.trim() : "";
        const title = titleEl ? titleEl.textContent.trim() : "";
        const location = locationEl ? locationEl.textContent.trim() : "";
        const format = formatEl ? formatEl.textContent.trim() : "";
        const kind = kindEl ? kindEl.textContent.trim() : "";
        const typeLine = [format, kind].filter(Boolean).join(" · ");

        // Extract co-organisation info from description
        let coOrg = "";
        if (descriptionEl) {
          const text = descriptionEl.textContent;
          const match = text.match(/Co-organised with[^\.]+\./);
          if (match) {
            coOrg = match[0];
          }
        }

        return `
      <div class="poster-event-row">
        <div class="poster-event-meta">
          <div class="poster-event-date">${date}</div>
          <div class="poster-event-time">${time}</div>
        </div>
        <div class="poster-event-content">
          <div class="poster-event-title">${title}</div>
          ${coOrg ? `<div class="poster-event-coorg">${coOrg}</div>` : ''}
          <div class="poster-event-type">${typeLine}</div>
          <div class="poster-event-location">${location}</div>
        </div>
      </div>`;
      })
      .join("");

    const posterHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Weather, Climate &amp; Health – Events Poster</title>
    <script src="qrcode.min.js"></script>
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
        overflow: hidden;
      }
      body::before {
        content: '';
        position: fixed;
        bottom: -45%;
        left: 50%;
        transform: translateX(-50%);
        width: 200%;
        height: 180%;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='blurFilter' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='80' /%3E%3C/filter%3E%3ClinearGradient id='fadeUp' x1='0%25' y1='100%25' x2='0%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='white' stop-opacity='0'/%3E%3Cstop offset='30%25' stop-color='white' stop-opacity='0'/%3E%3Cstop offset='100%25' stop-color='white' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg filter='url(%23blurFilter)'%3E%3Cellipse cx='200' cy='520' rx='280' ry='200' fill='%23ff0000' opacity='0.7' /%3E%3Cellipse cx='300' cy='540' rx='270' ry='190' fill='%23ff0000' opacity='0.65' /%3E%3Cellipse cx='400' cy='520' rx='260' ry='180' fill='%23ff2200' opacity='0.6' /%3E%3C/g%3E%3Crect width='600' height='600' fill='url(%23fadeUp)' /%3E%3C/svg%3E");
        background-size: contain;
        background-position: bottom center;
        z-index: -1;
      }
      .poster-page {
        padding: 24mm 20mm 20mm;
      }
      .poster-logo {
        position: fixed;
        top: 20mm;
        right: 20mm;
        height: 130px;
        width: auto;
      }
      .poster-title {
        font-size: 48pt;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin: 0 0 4mm;
        color: #111827;
        line-height: 1.1;
      }
      .poster-divider {
        width: 120px;
        height: 3px;
        background: linear-gradient(to right, #ff0000, #ff2200);
        margin: 6mm 0 10mm;
        border-radius: 2px;
      }
      .poster-events-heading {
        font-size: 22pt;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin: 0 0 6mm;
        color: #111827;
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
        font-size: 18pt;
        font-weight: 600;
        margin-bottom: 2mm;
      }
      .poster-event-coorg {
        font-size: 12pt;
        margin-bottom: 2mm;
      }
      .poster-event-type {
        margin-bottom: 2mm;
      }
      .poster-event-location {
        font-style: italic;
        margin-bottom: 2.5mm;
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
    <img src="imh.png" alt="IMH" class="poster-logo">
    <div class="poster-page">
      <h1 class="poster-title">Weather<br>Climate<br>Health</h1>
      <div class="poster-divider"></div>
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
        colorDark: "#ffffff",
        colorLight: "transparent",
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


