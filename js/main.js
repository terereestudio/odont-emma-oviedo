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

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Carruseles (solo mobile): una tarjeta por vez, puntos de navegación y,
  // en los marcados con data-carousel="auto", avance suave con botón de pausa.
  const mobile = window.matchMedia("(max-width: 759px)");
  const SVG_NS = "http://www.w3.org/2000/svg";
  const icon = (d) => {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 12 12");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
    return svg;
  };
  const ICON_PAUSE = "M2.5 1.5h2.6v9H2.5zM6.9 1.5h2.6v9H6.9z";
  const ICON_PLAY = "M3 1.5v9l7.5-4.5L3 1.5Z";
  const setBtn = (btn, playing) => {
    btn.replaceChildren(icon(playing ? ICON_PAUSE : ICON_PLAY));
    btn.setAttribute("aria-label", playing ? "Pausar el avance automático" : "Reanudar el avance automático");
  };
  document.querySelectorAll("[data-carousel]").forEach((track) => {
    const slides = Array.from(track.children);
    const nav = document.createElement("div");
    nav.className = "carousel-nav";
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "carousel-dot";
      b.setAttribute("aria-label", "Ver tarjeta " + (i + 1) + " de " + slides.length);
      b.addEventListener("click", () => { stop(); go(i); });
      nav.appendChild(b);
      return b;
    });
    track.after(nav);

    let current = -1;
    const setActive = (i) => {
      if (i === current) return;
      current = i;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
      dots.forEach((d, k) => d.setAttribute("aria-current", k === i ? "true" : "false"));
    };
    const go = (i) => {
      const s = slides[i];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior: reduce ? "auto" : "smooth" });
    };
    const update = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0, dist = Infinity;
      slides.forEach((s, k) => {
        const d = Math.abs(s.offsetLeft + s.clientWidth / 2 - center);
        if (d < dist) { dist = d; best = k; }
      });
      setActive(best);
    };
    let ticking = false;
    track.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });
    update();

    let stopped = true;
    let pauseBtn = null;
    const stop = () => {
      stopped = true;
      if (pauseBtn) setBtn(pauseBtn, false);
    };
    if (track.dataset.carousel === "auto" && !reduce && "IntersectionObserver" in window) {
      stopped = false;
      let visible = false;
      pauseBtn = document.createElement("button");
      pauseBtn.type = "button";
      pauseBtn.className = "carousel-pause";
      setBtn(pauseBtn, true);
      pauseBtn.addEventListener("click", () => {
        if (stopped) {
          stopped = false;
          setBtn(pauseBtn, true);
        } else {
          stop();
        }
      });
      nav.appendChild(pauseBtn);
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.6 }).observe(track);
      ["pointerdown", "touchstart", "wheel", "focusin"].forEach((ev) => track.addEventListener(ev, stop, { passive: true }));
      setInterval(() => {
        if (!stopped && visible && mobile.matches && !document.hidden) go((current + 1) % slides.length);
      }, 4200);
    }
  });

  // Aparición suave al hacer scroll
  const items = document.querySelectorAll(".reveal");
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
