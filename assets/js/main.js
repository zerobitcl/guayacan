(() => {
  "use strict";

  /* ---------- Loader ---------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) setTimeout(() => loader.classList.add("is-hidden"), 250);
  });

  /* ---------- Sticky navbar ---------- */
  const nav = document.getElementById("nav");
  const onScrollNav = () => {
    if (window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  document.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");
  const setMenuOpen = (open) => {
    navLinks.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    document.body.classList.toggle("is-menu-open", open);
  };
  burger.addEventListener("click", () => setMenuOpen(!navLinks.classList.contains("is-open")));
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setMenuOpen(false))
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("is-open")) setMenuOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100 && navLinks.classList.contains("is-open")) setMenuOpen(false);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- Hero parallax (subtle, disabled on touch for perf) ---------- */
  const heroBg = document.getElementById("heroBg");
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (heroBg && !isTouch) {
    document.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroBg.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
        }
      },
      { passive: true }
    );
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Gallery lightbox ---------- */
  const galleryItems = Array.from(document.querySelectorAll("[data-gallery-src]"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  let galleryIndex = 0;

  const showGallery = (index) => {
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[galleryIndex];
    lightboxImg.src = item.getAttribute("data-gallery-src");
    lightboxImg.alt = item.getAttribute("data-gallery-alt") || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
  };

  if (lightbox && galleryItems.length) {
    galleryItems.forEach((item, i) => {
      item.addEventListener("click", () => showGallery(i));
    });
    lightboxClose.addEventListener("click", closeGallery);
    lightboxPrev.addEventListener("click", () => showGallery(galleryIndex - 1));
    lightboxNext.addEventListener("click", () => showGallery(galleryIndex + 1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeGallery();
    });
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowLeft") showGallery(galleryIndex - 1);
      if (e.key === "ArrowRight") showGallery(galleryIndex + 1);
    });
  }
})();
