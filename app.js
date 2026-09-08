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
  const kind = sub === "videos" ? "videos" : "art";
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
          <a href="#/work/art" class="${kind === "art" ? "is-active" : ""}">ART</a>
          <a href="#/work/videos" class="${kind === "videos" ? "is-active" : ""}">VIDEOS</a>
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

function mediaUrl(value) {
  return escapeAttr(encodeURI(value));
}

function cardMarkup(kind, item, index) {
  const media =
    kind === "videos"
      ? `<video src="${mediaUrl(item.src)}" ${item.poster ? `poster="${mediaUrl(item.poster)}"` : ""} muted playsinline preload="metadata"></video>`
      : item.src
        ? `<img src="${mediaUrl(item.src)}" alt="${escapeAttr(item.title || "ARTWORK")}" />`
        : `<span>NO FILE</span>`;

  const label = item.title || (kind === "videos" ? "VIDEO" : "ARTWORK");
  return `
    <button class="card" type="button" data-open="${index}" aria-label="${escapeAttr(label)}">
      <div class="card-media">${media}</div>
    </button>
  `;
}

function emptyMarkup(kind) {
  if (kind === "videos") {
    return `<p class="empty">DROP ANIMATED ART VIDEOS INTO ASSETS/VIDEOS AND LIST THEM IN WORKS.JS</p>`;
  }
  return `<p class="empty">DROP ART WORKS INTO ASSETS/ART AND LIST THEM IN WORKS.JS</p>`;
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
        <a class="contact-value" href="https://instagram.com/daniiiart" target="_blank" rel="noreferrer">@DANIIIART</a>
      </div>
    </section>
  `;
}

let lightboxKind = "art";
let lightboxIndex = 0;

function openLightbox(kind, index) {
  const items = workItems(kind);
  if (!items.length) return;
  lightboxKind = kind;
  lightboxIndex = ((index % items.length) + items.length) % items.length;
  const item = items[lightboxIndex];
  const media =
    kind === "videos"
      ? `<video src="${mediaUrl(item.src)}" controls autoplay playsinline></video>`
      : `<img class="lightbox-media" src="${mediaUrl(item.src)}" alt="${escapeAttr(item.title || "ARTWORK")}" />`;
  const caption = item.caption || "CAPTION PENDING";
  lightboxStage.innerHTML = `
    <button class="lightbox-nav lightbox-prev" type="button" aria-label="PREVIOUS">‹</button>
    <figure class="lightbox-figure">
      ${media}
      <figcaption class="lightbox-caption">${escapeHtml(caption)}</figcaption>
    </figure>
    <button class="lightbox-nav lightbox-next" type="button" aria-label="NEXT">›</button>
  `;
  lightbox.querySelector(".lightbox-prev").addEventListener("click", (event) => {
    event.stopPropagation();
    stepLightbox(-1);
  });
  lightbox.querySelector(".lightbox-next").addEventListener("click", (event) => {
    event.stopPropagation();
    stepLightbox(1);
  });
  const img = lightboxStage.querySelector(".lightbox-media");
  if (img) {
    img.addEventListener("click", (event) => {
      event.stopPropagation();
      stepLightbox(1);
    });
  }
  const cap = lightboxStage.querySelector(".lightbox-caption");
  cap.addEventListener("click", (event) => {
    event.stopPropagation();
    stepLightbox(1);
  });
  lightbox.hidden = false;
}

function stepLightbox(delta) {
  if (lightbox.hidden) return;
  openLightbox(lightboxKind, lightboxIndex + delta);
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
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") stepLightbox(1);
  if (event.key === "ArrowLeft") stepLightbox(-1);
});

render();
