/* ═══════════════════════════════════════════════════════════════════
   FOR YOU ♥ — app.js
   All the life of the site: gate, typing, timeline, gallery, lightbox,
   secret, music, finale. Personal data lives in js/config.js only.
   ═══════════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── personalization tint ─────────────────────────────────────── */
  function applyFavoriteColor() {
    const c = SITE.FAVORITE_COLOR;
    if (c && !/^\[/.test(c)) {
      document.documentElement.style.setProperty("--favorite", c);
    }
  }

  /* ── tiny helpers ─────────────────────────────────────────────── */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function fillText(selector, value) {
    $$(`[data-${selector}]`).forEach((el) => { el.textContent = value; });
  }

  function isPlaceholder(v) {
    return !v || /^\[/.test(String(v).trim());
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;                     // free text like "September 2021"
    return d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
  }

  /* ── 1 · inject personal data ─────────────────────────────────── */
  function applyContent() {
    applyFavoriteColor();

    // names
    fillText("nickname", isPlaceholder(SITE.NICKNAME) ? (isPlaceholder(SITE.HER_NAME) ? "you" : SITE.HER_NAME) : SITE.NICKNAME);
    fillText("her", isPlaceholder(SITE.HER_NAME) ? "my love" : SITE.HER_NAME);
    fillText("me", isPlaceholder(SITE.MY_NAME) ? "me" : SITE.MY_NAME);
    fillText("song", isPlaceholder(SITE.SONG_NAME) ? "Our song (add it in js/config.js)" : SITE.SONG_NAME);
    fillText("footer", SITE.footerNote || "Made with love, just for you.");

    // hero date line
    const dateEl = $$("[data-today-date]")[0];
    if (dateEl) {
      dateEl.textContent = isPlaceholder(SITE.BIRTHDAY_DATE)
        ? new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
        : formatDate(SITE.BIRTHDAY_DATE);
    }

    // day counter
    const counter = $("#dayCounter");
    if (counter && SITE.SHOW_DAY_COUNTER !== false && !isPlaceholder(SITE.RELATIONSHIP_DATE)) {
      const then = new Date(SITE.RELATIONSHIP_DATE);
      if (!isNaN(then)) {
        const now = new Date(); now.setHours(0,0,0,0); then.setHours(0,0,0,0);
        const days = Math.floor((now - then) / 86400000);
        if (days >= 0) {
          counter.innerHTML = "";
          const pre = document.createTextNode("us, for ");
          const b = document.createElement("b");
          b.textContent = days.toLocaleString();
          const post = document.createTextNode(" days and counting");
          counter.append(pre, b, post);
          counter.hidden = false;
        }
      }
    }

    // finale lines
    (SITE.finalLines || []).forEach((line, i) => {
      $$(`[data-final-${i}]`).forEach((el) => { el.textContent = line; });
    });

    // secret
    const s = SITE.secret || {};
    const tease = $("#secretTease"); if (tease) tease.textContent = s.tease || "";
    const big = $("#secretBig"); if (big) big.textContent = s.message || "";
    const big2 = $("#secretBig2"); if (big2) big2.textContent = s.message2 || "";

    // story quote
    const quote = $("#storyQuote");
    if (quote) {
      if (SITE.storyQuote) { quote.textContent = SITE.storyQuote; }
      else { quote.hidden = true; }
    }
  }

  /* ── 2 · gate + cinematic reveal ──────────────────────────────── */
  function initGate() {
    const gate = $("#gate"), reveal = $("#reveal"), journey = $("#journey");
    const btn = $("#openBtn");
    document.documentElement.classList.add("locked");

    function open() {
      if (gate.classList.contains("is-open")) return;
      gate.classList.add("is-open");
      document.documentElement.classList.remove("locked");
      journey.setAttribute("aria-hidden", "false");
      reveal.classList.add("is-on");

      const showSite = () => {
        reveal.classList.remove("is-on");
        reveal.setAttribute("aria-hidden", "true");
        journey.classList.add("journey--live");
        startJourney();
      };

      if (reduceMotion) { setTimeout(showSite, 150); }
      else { setTimeout(showSite, 2400); }
    }

    btn.addEventListener("click", open);
    gate.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
  }

  /* ── 3 · scroll reveals + timeline ───────────────────────────── */
  let io;
  function initReveals() {
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    // stagger siblings inside grids
    $$(".loves__grid .love-card, .grid .tile, .timeline .tl-item").forEach((el, i) => {
      el.style.setProperty("--i", i % 6);
    });

    $$(".reveal-item").forEach((el) => io.observe(el));
    // cards/tiles/timeline items animate in with a keyframe so their
    // own hover transitions stay snappy
    $$(".love-card, .tile, .tl-item").forEach((el) => {
      el.classList.add("anim-in");
      io.observe(el);
    });

    // the letter types itself only when she actually scrolls to it
    const letterCard = $("#letterCard");
    if (letterCard) {
      const letterIO = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            typeLetter();
            letterIO.disconnect();
          }
        });
      }, { threshold: 0.25 });
      letterIO.observe(letterCard);
    }
  }

  /* ── 4 · letter typing ───────────────────────────────────────── */
  let letterStarted = false;
  function typeLetter() {
    if (letterStarted) return;
    letterStarted = true;
    const body = $("#letterBody"), sign = $("#letterSign");
    const text = SITE.PERSONAL_MESSAGE || "";
    if (!body) return;
    if (reduceMotion) {
      text.split(/\n\s*\n/).forEach((para) => {
        const p = document.createElement("p");
        p.textContent = para.trim();
        body.appendChild(p);
      });
      sign.hidden = false; sign.classList.add("is-on");
      return;
    }
    // Build paragraph spans up-front so layout doesn't jump while typing
    const paras = text.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
    let current = null, caret = null, pi = 0, ci = 0;

    function step() {
      if (pi >= paras.length) {
        if (caret) caret.remove();
        sign.hidden = false;
        requestAnimationFrame(() => sign.classList.add("is-on"));
        return;
      }
      if (!current) {
        current = document.createElement("p");
        caret = document.createElement("span");
        caret.className = "caret";
        current.appendChild(caret);
        body.appendChild(current);
      }
      const para = paras[pi];
      if (ci < para.length) {
        const chunk = para.slice(ci, ci + 2);         // 2 chars/frame ≈ natural pace
        caret.before(document.createTextNode(chunk));
        ci += 2;
        setTimeout(step, 18 + Math.random() * 26);
      } else {
        pi++; ci = 0; current = null;
        setTimeout(step, 320);                         // pause between paragraphs
      }
    }
    step();
  }

  /* ── 5 · timeline items ──────────────────────────────────────── */
  function buildTimeline() {
    const ol = $("#timeline");
    if (!ol) return;
    (SITE.timeline || []).forEach((item) => {
      const li = document.createElement("li");
      li.className = "tl-item";
      li.innerHTML = `
        <span class="dot" aria-hidden="true"></span>
        <div class="tl-body">
          <p class="tl-date"></p>
          <h3></h3>
          <p class="tl-text"></p>
        </div>`;
      li.querySelector(".tl-date").textContent = isPlaceholder(item.date) ? "" : item.date;
      li.querySelector("h3").textContent = item.title || "";
      li.querySelector(".tl-text").textContent = item.text || "";
      ol.appendChild(li);
    });
  }

  function initTimelineLighting() {
    const items = $$(".tl-item");
    if (!items.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-lit");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    items.forEach((li) => obs.observe(li));

    // progress line fill via CSS var
    const tl = $("#timeline");
    const fill = () => {
      const r = tl.getBoundingClientRect();
      const mid = window.innerHeight * 0.62;
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      tl.style.setProperty("--progress", p);
    };
    fill();
    window.addEventListener("scroll", fill, { passive: true });
  }

  /* ── 6 · gallery + lightbox ──────────────────────────────────── */
  function buildGallery() {
    const grid = $("#grid");
    if (!grid) return;
    const patterns = ["", "tile--wide", "tile--tall", "", "tile--wide", "", "tile--tall", "", ""];
    (SITE.memories || []).forEach((m, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tile " + (patterns[i % patterns.length] || "");
      btn.dataset.ph = m.title || "your photo here";
      btn.innerHTML = `
        <img alt="" loading="lazy" />
        <span class="tile__veil">
          <span class="tile__date"></span>
          <span class="tile__title"></span>
        </span>`;
      const img = btn.querySelector("img");
      img.src = m.image;
      img.alt = m.title || "Our memory";
      img.onerror = () => { img.remove(); btn.classList.add("tile--empty"); };
      btn.querySelector(".tile__date").textContent = isPlaceholder(m.date) ? "" : m.date;
      btn.querySelector(".tile__title").textContent = m.title || "";
      btn.addEventListener("click", () => openLightbox(i));
      grid.appendChild(btn);
    });
  }

  // note: tiles whose image fails get a styled placeholder via .tile--empty (CSS below)
  const style = document.createElement("style");
  style.textContent = `
    .tile--empty { border: 1px dashed rgba(244,236,230,0.16); background: repeating-linear-gradient(45deg, rgba(255,240,238,0.02) 0 14px, rgba(255,240,238,0.045) 14px 28px); }
    .tile--empty::after { content: "add this photo → " attr(data-ph); position: absolute; inset: 0; display: grid; place-items: center; color: var(--faint); font-size: 0.75rem; letter-spacing: 0.06em; text-align: center; padding: 1rem; }
  `;
  document.head.appendChild(style);

  let lbItems = [];
  let lbIndex = 0;

  function openLightbox(i) {
    lbItems = (SITE.memories || []);
    lbIndex = i;
    renderLightbox();
    const lb = $("#lightbox");
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("is-open"));
    document.documentElement.classList.add("locked");
    lb.setAttribute("aria-hidden", "false");
  }

  function renderLightbox() {
    const m = lbItems[lbIndex];
    const img = $("#lbImg");
    const frame = $(".lightbox__frame");
    frame.classList.remove("is-empty");
    img.onerror = () => frame.classList.add("is-empty");
    img.src = m.image;
    img.alt = m.title || "Our memory";
    $("#lbTitle").textContent = m.title || "";
    $("#lbDate").textContent = isPlaceholder(m.date) ? "" : m.date;
    $("#lbNote").textContent = m.note || "";
    $("#lbNote").hidden = !m.note;
  }

  function moveLightbox(delta) {
    lbIndex = (lbIndex + delta + lbItems.length) % lbItems.length;
    const frame = $(".lightbox__frame");
    frame.style.opacity = "0";
    setTimeout(() => {
      renderLightbox();
      frame.style.opacity = "1";
      frame.style.transition = "opacity .35s ease";
    }, 180);
  }

  function closeLightbox() {
    const lb = $("#lightbox");
    lb.classList.remove("is-open");
    document.documentElement.classList.remove("locked");
    setTimeout(() => { lb.hidden = true; }, 450);
    lb.setAttribute("aria-hidden", "true");
  }

  function initLightbox() {
    $("#lbClose").addEventListener("click", closeLightbox);
    $("#lbPrev").addEventListener("click", () => moveLightbox(-1));
    $("#lbNext").addEventListener("click", () => moveLightbox(1));
    $("#lightbox").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      const lb = $("#lightbox");
      if (lb.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") moveLightbox(1);
      if (e.key === "ArrowLeft") moveLightbox(-1);
    });
    // simple swipe on mobile
    let x0 = null;
    $("#lightbox").addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    $("#lightbox").addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 60) moveLightbox(dx > 0 ? -1 : 1);
      x0 = null;
    }, { passive: true });
  }

  /* ── 7 · things I love ───────────────────────────────────────── */
  function buildLoves() {
    const wrap = $("#lovesGrid");
    if (!wrap) return;
    (SITE.loves || []).forEach((love) => {
      const card = document.createElement("article");
      card.className = "love-card";
      card.innerHTML = `
        <span class="love-card__emoji" aria-hidden="true"></span>
        <h3></h3>
        <p></p>`;
      card.querySelector(".love-card__emoji").textContent = love.emoji || "♥";
      card.querySelector("h3").textContent = love.title || "";
      card.querySelector("p").textContent = love.text || "";
      wrap.appendChild(card);
    });
  }

  /* ── 8 · secret ──────────────────────────────────────────────── */
  function initSecret() {
    const btn = $("#secretBtn"), panel = $("#secretReveal"), hearts = $("#secretHearts");
    btn.addEventListener("click", () => {
      btn.style.transition = "opacity .6s ease, transform .6s ease";
      btn.style.opacity = "0";
      btn.style.transform = "scale(.9)";
      setTimeout(() => { btn.hidden = true; }, 600);
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add("is-on"));

      if (!reduceMotion) {
        for (let i = 0; i < 14; i++) {
          const s = document.createElement("span");
          s.textContent = "♥";
          s.style.left = 4 + Math.random() * 92 + "%";
          s.style.fontSize = 12 + Math.random() * 16 + "px";
          s.style.animationDelay = 0.4 + Math.random() * 2.4 + "s";
          s.style.animationDuration = 3.6 + Math.random() * 2.2 + "s";
          hearts.appendChild(s);
          setTimeout(() => s.remove(), 8000);
        }
      }
    });
  }

  /* ── 9 · music ───────────────────────────────────────────────── */
  function initMusic() {
    const audio = $("#song"), btn = $("#playBtn"), player = $("#player"), note = $("#musicNote");
    if (!audio || !btn) return;

    audio.addEventListener("error", () => {
      if (note) {
        note.hidden = false;
        note.textContent = "(add your song as audio/song.mp3 — drop the file in and it plays)";
      }
    });

    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => {
          player.classList.add("is-playing");
          btn.setAttribute("aria-pressed", "true");
        }).catch(() => {
          if (note) {
            note.hidden = false;
            note.textContent = "couldn't play the file — check audio/song.mp3";
          }
        });
      } else {
        audio.pause();
        player.classList.remove("is-playing");
        btn.setAttribute("aria-pressed", "false");
      }
    });
    audio.addEventListener("ended", () => {
      player.classList.remove("is-playing");
      btn.setAttribute("aria-pressed", "false");
    });
  }

  /* ── 10 · canvases: gate + hero particles, finale drift ──────── */
  function makeParticles(canvas, opts) {
    const ctx = canvas.getContext("2d");
    let w, h, parts = [], raf = null, running = false;
    const reduced = opts.reduced || reduceMotion;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = reduced ? 0 : Math.round((w * h) / opts.density);
      parts = Array.from({ length: count }, () => spawn(true));
    }

    function spawn(anywhere) {
      const isHeart = Math.random() < opts.heartRatio;
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 12,
        r: (isHeart ? 5 : 1.2) + Math.random() * opts.size,
        vx: (Math.random() - 0.5) * opts.sway,
        vy: -(opts.rise * (0.5 + Math.random())),
        a: 0.08 + Math.random() * opts.alpha,
        heart: isHeart,
        tw: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.004,
      };
    }

    function heart(x, y, s, rot, alpha) {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s / 16, s / 16);
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.bezierCurveTo(-9, -3, -4, -11, 0, -5);
      ctx.bezierCurveTo(4, -11, 9, -3, 0, 5);
      ctx.fillStyle = opts.colors[(Math.random() * opts.colors.length) | 0];
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.restore();
    }

    function dot(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = opts.colors[(p.tw | 0) % opts.colors.length];
      ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
      ctx.fill();
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx + Math.sin(p.tw) * 0.18;
        p.y += p.vy;
        p.tw += 0.02;
        p.rot += p.vr;
        if (p.y < -20) Object.assign(p, spawn(false));
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        p.heart ? heart(p.x, p.y, p.r * 1.6, p.rot, Math.min(0.5, p.a)) : dot(p);
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!running && !reduced) { running = true; frame(); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    resize();
    window.addEventListener("resize", () => { resize(); }, { passive: true });
    if (opts.pauseWhenHidden !== false) {
      document.addEventListener("visibilitychange", () => {
        document.hidden ? stop() : start();
      });
    }
    start();
    return { start, stop };
  }

  function initCanvases() {
    const soft = ["rgba(232,160,180,0.9)", "rgba(185,167,216,0.8)", "rgba(243,215,210,0.9)", "rgba(255,255,255,0.85)"];
    const gate = $("#gateCanvas");
    if (gate) makeParticles(gate, { density: 26000, size: 1.6, alpha: 0.35, rise: 0.16, sway: 0.2, heartRatio: 0.12, colors: soft, pauseWhenHidden: false });
    const hero = $("#heroCanvas");
    if (hero) makeParticles(hero, { density: 30000, size: 1.8, alpha: 0.3, rise: 0.18, sway: 0.22, heartRatio: 0.14, colors: soft });
    const finale = $("#finaleCanvas");
    if (finale) makeParticles(finale, { density: 18000, size: 1.6, alpha: 0.4, rise: 0.3, sway: 0.28, heartRatio: 0.2, colors: soft });
  }

  /* ── journey start: fire everything once gate opens ──────────── */
  function startJourney() {
    initReveals();
    initTimelineLighting();
  }

  /* ── boot ────────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    applyContent();
    buildTimeline();
    buildGallery();
    buildLoves();
    initGate();
    initLightbox();
    initSecret();
    initMusic();
    initCanvases();
  });
})();
