// إعدادات واتساب: ضع رقمك بصيغة دولية (رمز الدولة + الرقم) بدون + أو أصفار بادئة
const WHATSAPP_NUMBER = "966500000000";
const WHATSAPP_MESSAGE = "مرحباً شيماء، اطلعت على أعمالك وأود مناقشة مشروع موقع معك.";

document.addEventListener("DOMContentLoaded", () => {
  setupWhatsApp();
  setupHeader();
  setupReveal();
  setupCounters();
  setupActiveNav();
  setupCopyEmail();
  setYear();
});

function setupWhatsApp() {
  const btn = document.getElementById("whatsapp-btn");
  if (!btn) return;
  btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

function setupHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
    observer.observe(el);
  });
}

function setupCounters() {
  const counters = document.querySelectorAll(".counter");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animate = (el) => {
    const target = Number(el.dataset.target) || 0;
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

function setupActiveNav() {
  const links = document.querySelectorAll(".nav-links a");
  if (!links.length || !("IntersectionObserver" in window)) return;

  const sections = [...links]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupCopyEmail() {
  const btn = document.querySelector(".copy-email");
  if (!btn) return;
  const hint = btn.querySelector(".copy-hint");
  const email = btn.dataset.email;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      hint.textContent = "تم النسخ";
      setTimeout(() => {
        hint.textContent = "نسخ";
      }, 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
}

function setYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

