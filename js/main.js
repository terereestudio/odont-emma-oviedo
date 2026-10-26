/* Emma Oviedo · landing — JS sin dependencias, compatible con CSP script-src 'self' */
"use strict";
(() => {
  const WA_NUMBER = "5491126370134";
  document.body.classList.remove("no-js");

  // Enlaces de WhatsApp armados con encodeURIComponent (el href estático queda como respaldo sin JS)
  document.querySelectorAll(".js-wa[data-msg]").forEach((a) => {
    a.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(a.dataset.msg);
  });

  // Sombra del header al hacer scroll
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menú móvil
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu-movil");
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // Video: fachada. Nada se conecta con Instagram hasta que la persona elige "Ver en Instagram".
  const play = document.querySelector(".reel-play");
  const notice = document.getElementById("aviso-reel");
  if (play && notice) {
    play.addEventListener("click", () => {
      notice.hidden = false;
      play.setAttribute("aria-expanded", "true");
      notice.querySelector("a").focus();
    });
    notice.querySelector(".reel-close").addEventListener("click", () => {
      notice.hidden = true;
      play.setAttribute("aria-expanded", "false");
      play.focus();
    });
  }

  // Aparición suave al hacer scroll
  const items = document.querySelectorAll(".reveal");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  }
})();
