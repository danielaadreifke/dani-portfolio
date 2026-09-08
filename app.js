const app = document.getElementById("app");
const lightbox = document.getElementById("lightbox");
const lightboxStage = lightbox.querySelector(".lightbox-stage");

function parseRoute() {
  const hash = (location.hash || "#/").replace(/^#/, "");
  const parts = hash.split("/").filter(Boolean);
  const page = parts[0] || "home";
  const sub = parts[1] || "";
  return { page, sub };
}

function setActiveNav(page) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === page);
  });
}

function renderHome() {
  setActiveNav("home");
  app.innerHTML = `
    <section class="home">
      <p class="home-kicker">ARTIST / ANIMATION / IMAGE</p>
      <div class="home-line"></div>
    </section>
  `;
}

function workItems(kind) {
  return (window.WORKS && window.WORKS[kind]) || [];
}

function renderWork(sub) {
  const kind = sub === "other" ? "other" : "ut";
  setActiveNav("work");
  const items = workItems(kind);
  const cards = items.length
    ? `<div class="grid">${items
        .map((item, i) => cardMarkup(kind, item, i))
        .join("")}</div>`
    : emptyMarkup(kind);

  app.innerHTML = `
    <section>
      <div class="section-head">
        <h1 class="section-title">WORK</h1>
        <nav class="subnav" aria-label="Work">
          <a href="#/work/ut" class="${kind === "ut" ? "is-active" : ""}">UT</a>
          <a href="#/work/other" class="${kind === "other" ? "is-active" : ""}">OTHER</a>
        </nav>
      </div>
      ${cards}
    </section>
  `;

  app.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.open);
      openLightbox(kind, index);
    });
  });
}

function cardMarkup(kind, item, index) {
  const media =
    kind === "other"
      ? `<video src="${escapeAttr(item.src)}" ${item.poster ? `poster="${escapeAttr(item.poster)}"` : ""} muted playsinline preload="metadata"></video>`
      : item.src
        ? `<img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.title || "ARTWORK")}" />`
        : `<span>NO FILE</span>`;

  return `
    <button class="card" type="button" data-open="${index}">
      <div class="card-media">${media}</div>
      <div class="card-meta">
        <span>${escapeHtml(item.title || (kind === "other" ? "VIDEO" : "ARTWORK"))}</span>
        <span>${kind === "other" ? "PLAY" : "VIEW"}</span>
      </div>
    </button>
  `;
}

function emptyMarkup(kind) {
  if (kind === "other") {
    return `<p class="empty">DROP ANIMATED ART VIDEOS INTO ASSETS/OTHER AND LIST THEM IN WORKS.JS</p>`;
  }
  return `<p class="empty">DROP ART WORKS INTO ASSETS/UT AND LIST THEM IN WORKS.JS</p>`;
}

function renderContact() {
  setActiveNav("contact");
  app.innerHTML = `
    <section class="contact">
      <div class="section-head">
        <h1 class="section-title">CONTACT</h1>
      </div>
      <div class="contact-item">
        <span class="contact-label">EMAIL</span>
        <a class="contact-value" href="mailto:dreifke.daniela@gmail.com">DREIFKE.DANIELA@GMAIL.COM</a>
      </div>
      <div class="contact-item">
        <span class="contact-label">INSTAGRAM</span>
        <a class="contact-value" href="https://instagram.com/daniiart" target="_blank" rel="noreferrer">@DANIIART</a>
      </div>
    </section>
  `;
}

function openLightbox(kind, index) {
  const item = workItems(kind)[index];
  if (!item) return;
  if (kind === "other") {
    lightboxStage.innerHTML = `<video src="${escapeAttr(item.src)}" controls autoplay playsinline></video>`;
  } else {
    lightboxStage.innerHTML = `<img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.title || "ARTWORK")}" />`;
  }
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxStage.innerHTML = "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function render() {
  const { page, sub } = parseRoute();
  if (page === "work") renderWork(sub);
  else if (page === "contact") renderContact();
  else renderHome();
}

window.addEventListener("hashchange", render);
lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

render();
