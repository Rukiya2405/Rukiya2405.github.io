// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Theme toggle (dark/light) with persistence =====
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function getPreferredTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  if (themeIcon) themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
}

applyTheme(getPreferredTheme());

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  applyTheme(current === "dark" ? "light" : "dark");
});

// ===== WebP support check =====
function supportsWebp() {
  try {
    const canvas = document.createElement("canvas");
    return canvas.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}
const CAN_USE_WEBP = supportsWebp();

// ===== Modal + Gallery (event delegation) =====
document.addEventListener("click", (e) => {
  // ---- Open modal ----
  const openBtn = e.target.closest("[data-open]");
  if (openBtn) {
    const openId = openBtn.dataset.open;
    document.getElementById(openId)?.showModal?.();
    return;
  }

  // ---- Close modal ----
  const closeBtn = e.target.closest("[data-close]");
  if (closeBtn) {
    closeBtn.closest("dialog")?.close();
    return;
  }

  // ---- Gallery thumbnail switching ----
  const thumb = e.target.closest(".thumb");
  if (!thumb) return;

  const gallery = thumb.closest(".gallery");
  if (!gallery) return;

  const imgEl = gallery.querySelector(".gallery-main");
  if (!imgEl) return;

  const sourceEl = gallery.querySelector('source[type="image/webp"]');

  const webp = thumb.dataset.webp;
  const png = thumb.dataset.png;
  const alt = thumb.dataset.alt || "Project screenshot";

  if (CAN_USE_WEBP && webp && sourceEl) {
    sourceEl.srcset = webp;
    imgEl.src = png || webp; // fallback
  } else {
    if (sourceEl) sourceEl.srcset = "";
    if (png) imgEl.src = png;
  }

  imgEl.alt = alt;

  gallery.querySelectorAll(".thumb").forEach((t) => t.classList.remove("is-active"));
  thumb.classList.add("is-active");
});

// Close modal when clicking on the backdrop
document.querySelectorAll("dialog.modal").forEach((dlg) => {
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
});

const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    navLinks.forEach(a => a.classList.remove("is-active"));
    const active = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
    active?.classList.add("is-active");
  });
}, { rootMargin: "-30% 0px -60% 0px" });

sections.forEach(sec => observer.observe(sec));