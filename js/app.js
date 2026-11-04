/* =========================================================================
   bubble-pop · app.js  v1.0（2026-09-24）
   資料：data/resume-data.js（window.RESUME_DATA）
   動態編號（G1、H1、W2…）對應 motion-spec.html
   ========================================================================= */
(() => {
  'use strict';

  const D = window.RESUME_DATA || {};
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const G = window.gsap;
  const hasG = !!G;
  if (hasG) G.registerPlugin(...[window.ScrollTrigger, window.Flip, window.Draggable, window.InertiaPlugin, window.ScrollToPlugin].filter(Boolean));
  const ST = window.ScrollTrigger;

  let lang = root.dataset.lang === 'en' ? 'en' : 'zh';
  const store = (k, v) => { try { localStorage.setItem('bp-' + k, v); } catch (e) {} };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const bi = (zh, en) => `data-zh="${esc(zh)}" data-en="${esc(en || zh)}"`;
  const cur = (zh, en) => esc(lang === 'en' ? (en || zh) : zh);
  const span = (zh, en, cls = '') => `<span${cls ? ` class="${cls}"` : ''} ${bi(zh, en)}>${cur(zh, en)}</span>`;
  const visible = arr => (arr || []).filter(x => x && x.visible !== false);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  const PLUS = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M8 2v12M2 8h12"/></svg>';

  /* ---------- 介面文字 ---------- */
  const T = {
    zh: {
      skip: '跳到主要內容', status: '接案中', tagline: '跨領域視覺設計師，把品牌變得有趣又好記。',
      ctaWorks: '看作品', ctaContact: '聯絡我', scroll: '往下滑',
      aboutTitle: '關於我', expTitle: '工作經歷', skillsTitle: '專長工具', xpTitle: '擅長', worksTitle: '作品', contactTitle: '一起做點有趣的東西吧！',
      all: '全部', visit: '前往網站', aboutProject: '專案介紹', prev: '上一件', next: '下一件',
      copied: '已複製！', copyFail: '請手動複製', toTop: '回到頂端', theme: '切換深色／淺色', menuOpen: '開啟選單', menuClose: '關閉選單',
      back: '返回', close: '關閉', copy: '複製 email', prevImg: '上一張', nextImg: '下一張', navLabel: '主要導覽', filterLabel: '作品分類', items: '項',
      title: 'Vincent Kuo 郭慶禮 · 視覺設計師',
    },
    en: {
      skip: 'Skip to content', status: 'Available for work', tagline: 'A cross-disciplinary visual designer making brands playful & memorable.',
      ctaWorks: 'See my work', ctaContact: 'Say hello', scroll: 'Scroll',
      aboutTitle: 'About me', expTitle: 'Experience', skillsTitle: 'Tools', xpTitle: 'Expertise', worksTitle: 'Works', contactTitle: "Let's make something fun together!",
      all: 'All', visit: 'Visit site', aboutProject: 'About the project', prev: 'Previous', next: 'Next',
      copied: 'Copied!', copyFail: 'Please copy manually', toTop: 'Back to top', theme: 'Toggle dark / light', menuOpen: 'Open menu', menuClose: 'Close menu',
      back: 'Back', close: 'Close', copy: 'Copy email', prevImg: 'Previous image', nextImg: 'Next image', navLabel: 'Main navigation', filterLabel: 'Work categories', items: 'items',
      title: 'Vincent Kuo · Visual Designer',
    },
  };
  const t = k => (T[lang] && T[lang][k]) || T.zh[k] || k;

  const SECTIONS = [
    ['about', '關於我', 'About', 'var(--section-about)'],
    ['experience', '經歷', 'Experience', 'var(--section-experience)'],
    ['skills', '工具', 'Tools', 'var(--section-skills)'],
    ['expertise', '擅長', 'Expertise', 'var(--section-expertise)'],
    ['works', '作品', 'Works', 'var(--section-works)'],
    ['contact', '聯絡', 'Contact', 'var(--section-contact)'],
  ];
  const CANDY = ['pink', 'orange', 'mint', 'sky', 'violet', 'yellow'];
  const candyVars = c => `--cc:var(--candy-${c});--cs:var(--candy-${c}-soft);--cd:var(--candy-${c}-deep)`;

  /* =======================================================================
     Render
     ======================================================================= */
  function renderNav() {
    $('#navLinks').innerHTML = '<li class="pill" aria-hidden="true"></li>' + SECTIONS.map(([id, zh, en, c]) =>
      `<li><a href="#${id}" data-nav="${id}" style="--sc:${c}" data-cursor data-cc="${c}">${span(zh, en)}</a></li>`).join('');
    $('#menuLinks').innerHTML = SECTIONS.map(([id, zh, en, c]) =>
      `<li><a href="#${id}" style="--sc:${c}" data-cursor data-cc="var(--candy-yellow)">${span(zh, en)}</a></li>`).join('');
  }

  function renderMarquee() {
    const svc = visible(D.services && D.services.items);
    const words = [];
    svc.forEach(s => words.push([s.title_zh, s.title_en]));
    ['Brand', 'Web', 'GUI', 'Motion', 'Illustration', 'AI'].forEach(w => words.push([w, w]));
    const group = cls => `<div class="grp ${cls}" style="display:flex;gap:14px;padding-right:14px">${words.map(([zh, en], i) =>
      `<span class="item"><i style="--c:var(--candy-${CANDY[i % 6]})"></i>${span(zh, en)}</span>`).join('')}</div>`;
    $('#marquee').innerHTML = group('') + group('dup');
  }

  /* 關於我：逐字／逐詞 token＋重點詞標記 */
  const HL = {
    zh: ['跨領域', '平面、網頁、GUI、動畫與插畫'],
    en: ['cross-disciplinary', 'graphic design, web, GUI, animation, and illustration'],
  };
  const LOOP_PATH = 'M10,24 C8,8 40,3 62,4 C86,5 98,13 96,23 C94,34 70,38 48,37 C22,36 3,30 6,19 C8,12 20,7 34,6';
  function tokenize(str) {
    const out = [];
    if (lang === 'en') str.split(/(\s+)/).forEach(p => { if (p) out.push(/^\s+$/.test(p) ? p : `<span class="tk">${esc(p)}</span>`); });
    else [...str].forEach(ch => out.push(/[，。、；：！？（）「」]/.test(ch) && out.length ? out.pop().replace('</span>', esc(ch) + '</span>') : `<span class="tk">${esc(ch)}</span>`));
    return out.join('');
  }
  function renderAbout() {
    const text = (D.about && (lang === 'en' ? D.about.en || D.about.zh : D.about.zh)) || '';
    let html = '', rest = text;
    const hls = HL[lang].filter(h => text.includes(h));
    while (rest.length) {
      let idx = -1, hit = null;
      hls.forEach(h => { const i = rest.indexOf(h); if (i >= 0 && (idx < 0 || i < idx)) { idx = i; hit = h; } });
      if (!hit) { html += tokenize(rest); break; }
      html += tokenize(rest.slice(0, idx));
      const long = hit.length > 14;
      html += long
        ? `<mark class="long">${tokenize(hit)}</mark>`
        : `<mark>${tokenize(hit)}<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="${LOOP_PATH}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg></mark>`;
      rest = rest.slice(idx + hit.length);
    }
    const el = $('#aboutText');
    el.innerHTML = html;
    el.setAttribute('aria-label', text);
    $$('.tk, mark', el).forEach(n => n.setAttribute('aria-hidden', 'true'));
    if (RM || !hasG) { $$('.tk', el).forEach(n => n.style.opacity = 1); $$('path', el).forEach(p => p.style.strokeDashoffset = 0); $$('mark.long', el).forEach(m => m.style.backgroundSize = '100% 36%'); }
  }

  function renderDomains() {
    const list = [['平面設計', 'Graphic'], ['網頁設計', 'Web'], ['GUI', 'GUI'], ['動畫', 'Animation'], ['插畫', 'Illustration']];
    $('#domains').innerHTML =
      list.map(([zh, en], i) => `<span class="chip" data-drag><i class="dot" style="--dc:var(--candy-${CANDY[(i + 1) % 6]})"></i>${span(zh, en)}</span>`).join('');
  }

  function renderTimeline() {
    const items = visible(D.experience && D.experience.items);
    const html = items.map((x, i) => {
      const isNow = /至今|present|now/i.test((x.period_zh || '') + (x.period_en || ''));
      const id = `exp-${i}`;
      const role = (x.title_zh || x.title_en) ? `<span class="role">${span(x.title_zh, x.title_en)}</span>` : '';
      return `<div class="tl-item${i === 0 ? ' is-open' : ''}" data-reveal>
        <div class="tl-when">${span(x.period_zh, x.period_en)}</div>
        <div class="tl-node" aria-hidden="true"></div>
        <div class="tl-card">
          <h3 class="tl-h"><button class="tl-head" aria-expanded="${i === 0}" aria-controls="${id}" data-cursor data-cc="var(--section-experience)">
            <span class="chip when-m">${span(x.period_zh, x.period_en)}</span>
            <span class="h">${span(x.company_zh || x.company, x.company_en)}${isNow ? '<span class="now">NOW</span>' : ''}</span>${role}
            <span class="tog">${PLUS}</span>
          </button></h3>
          <div class="tl-body" id="${id}" role="region"><p>${span(x.zh, x.en)}</p></div>
        </div></div>`;
    }).join('');
    $('#timeline').insertAdjacentHTML('beforeend', html);
  }

  const SKILL_EN = { 'AI 工具': 'AI Tools', '設計軟體': 'Design Software' };
  const ICON_ALIAS = { antigravity: 'antigravity-ide' };
  const PRESETS = {
    1: [[50, 50, 38]], 2: [[34, 46, 32], [68, 58, 28]], 3: [[28, 40, 30], [66, 32, 26], [52, 76, 24]],
    4: [[20, 34, 28], [56, 20, 22], [42, 76, 25], [80, 62, 21]],
    5: [[16, 32, 24], [47, 18, 21], [81, 30, 22], [32, 78, 21], [66, 76, 20]],
    6: [[16, 34, 24], [44, 20, 21], [76, 26, 23], [26, 74, 21], [56, 64, 24], [86, 72, 18]],
  };
  function iconFor(name) {
    const k = String(name).toLowerCase().trim().replace(/\s+/g, '-');
    const I = window.BP_ICONS || {};
    return I[ICON_ALIAS[k] || k] || `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="currentColor"/><text x="24" y="31" font-size="20" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="700">${esc(String(name)[0] || '?')}</text></svg>`;
  }
  function renderSkills() {
    const cats = (D.skills && D.skills.categories) || [];
    $('#skillsGrid').innerHTML = cats.map(c => {
      const items = c.items || [];
      const pre = PRESETS[items.length] || items.map((_, i) => [15 + (i % 4) * 23, 25 + Math.floor(i / 4) * 40, 19]);
      return `<div class="cluster" data-reveal><h3>${span(c.name_zh || c.name, c.name_en || SKILL_EN[c.name] || c.name)}<span class="count">${items.length}</span></h3>
        <div class="bubbles">${items.map((n, i) => {
          const [x, y, s] = pre[i] || [50, 50, 20];
          return `<div class="bubble" style="--x:${x}%;--y:${y}%;--s:${s}%" data-cursor data-cc="var(--candy-mint)"><div class="fl"><div class="in" tabindex="0" role="img" aria-label="${esc(n)}">${iconFor(n)}<span>${esc(n)}</span></div></div></div>`;
        }).join('')}</div></div>`;
    }).join('');
  }

  const XP_ICONS = {
    brand: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    graphic: '<circle cx="7.5" cy="7.5" r="4"/><rect x="13" y="13" width="8" height="8" rx="2"/><path d="M17 3l4 6.5h-8z"/>',
    web: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18"/><path d="M7 14h6"/>',
    illus: '<path d="M14.5 4.5l5 5L10 19H5v-5z"/><path d="M12.5 6.5l5 5"/>',
    ai: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><path d="M12 7.5l1.6 2.9 2.9 1.6-2.9 1.6L12 16.5l-1.6-2.9L7.5 12l2.9-1.6z"/>',
  };
  function xpKey(s) { const z = (s.title_zh || '') + (s.title_en || ''); return /品牌|brand/i.test(z) ? 'brand' : /圖像|icon|graphic/i.test(z) ? 'graphic' : /網站|web/i.test(z) ? 'web' : /插畫|illus/i.test(z) ? 'illus' : /AI/.test(z) ? 'ai' : 'brand'; }
  function renderExpertise() {
    const items = visible(D.services && D.services.items);
    const cols = ['orange', 'sky', 'mint', 'pink', 'violet', 'yellow'];
    $('#xp').innerHTML = items.map((s, i) => `
      <button class="xp-card${i === 0 ? ' is-open' : ''}" style="--c:var(--candy-${cols[i % 6]})" aria-expanded="${i === 0}" data-reveal data-cursor data-cc="var(--candy-${cols[i % 6]})">
        <span class="num">0${i + 1}</span>
        <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${XP_ICONS[xpKey(s)]}</svg></span>
        <span class="txt"><span class="h">${span(s.title_zh, s.title_en)}</span><span class="desc">${span(s.desc_zh, s.desc_en)}</span></span>
        <span class="v" aria-hidden="true">${span(s.title_zh, s.title_en)}</span>
      </button>`).join('');
    $('#xpDots').innerHTML = items.map((_, i) => `<i class="${i === 0 ? 'is-on' : ''}"></i>`).join('');
  }

  /* 作品資料攤平 */
  const CATS = (D.works && D.works.categories || []).map((c, ci) => ({ ...c, color: CANDY[ci % CANDY.length], idx: ci }));
  let WORKS = [];
  CATS.forEach(c => visible(c.items).forEach(w => WORKS.push({ ...w, cat: c })));
  const featured = WORKS.find(w => w.featured) || WORKS[0];
  if (featured) WORKS = [featured, ...WORKS.filter(w => w !== featured)];
  const tagsOf = w => { const pick = (lang === 'en' && w.tags_en) ? w.tags_en : w.tags; if (!pick) return []; return (Array.isArray(pick) ? pick : String(pick).split(/[,，、]/)).map(s => s.trim()).filter(Boolean); };

  function renderWorks() {
    $('#filters').insertAdjacentHTML('beforeend', `<button data-filter="all" aria-pressed="true">${span(T.zh.all, T.en.all)}<small>${WORKS.length}</small></button>` +
      CATS.filter(c => WORKS.some(w => w.cat === c)).map(c => `<button data-filter="${esc(c.id)}" aria-pressed="false">${span(c.name_zh, c.name_en)}<small>${WORKS.filter(w => w.cat === c).length}</small></button>`).join(''));
    $('#grid').innerHTML = WORKS.map(w => `
      <button class="card" data-id="${esc(w.id)}" data-cat="${esc(w.cat.id)}" style="${candyVars(w.cat.color)}" data-reveal data-cursor data-cursor-label="View" data-cc="var(--candy-${w.cat.color})">
        <span class="im">${w.cover ? `<img src="${esc(w.cover)}" alt="" loading="lazy" decoding="async">` : ''}</span>
        <span class="meta"><span><span class="chip"><i class="dot" style="--dc:var(--candy-${w.cat.color})"></i>${span(w.cat.name_zh, w.cat.name_en)}</span><span class="h">${span(w.title_zh, w.title_en)}</span></span><span class="go">${ARROW}</span></span>
      </button>`).join('');
    layoutSpans();
  }
  let currentFilter = 'all';
  function layoutSpans() {
    const cards = $$('#grid .card');
    const vis = cards.filter(c => !c.hidden);
    cards.forEach(c => c.classList.remove('is-big', 'span-d-2', 'span-d-3', 'span-t-2'));
    if (!vis.length) return;
    const big = currentFilter === 'all' && vis.length >= 4;
    if (big) vis[0].classList.add('is-big');
    const rest = vis.length - (big ? 1 : 0);
    const last = vis[vis.length - 1];
    const tail = big ? rest - 2 : rest;
    if (tail > 0) { const r = tail % 3; if (r === 1) last.classList.add('span-d-3'); else if (r === 2 && tail > 2) last.classList.add('span-d-2'); }
    if (rest % 2 === 1 && rest > 0) last.classList.add('span-t-2');
  }

  function renderContact() {
    const c = D.contact || {};
    const mail = c.email ? `mailto:${c.email}` : '#';
    $('#emailLink').textContent = c.email || '';
    $('#emailLink').href = mail; $('#sayHi').href = mail;
    const mm = $('#menuMail'); mm.textContent = c.email || ''; mm.href = mail;
    if (!c.email) $('#emailBox').hidden = true;
    const ext = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h7v7M13 3 4 12"/></svg>';
    $('#contactLinks').innerHTML = (c.links || []).filter(l => l && l.url).map((l, i) =>
      `<a class="chip" href="${esc(l.url)}" target="_blank" rel="noopener" data-reveal data-cursor data-cc="var(--candy-${CANDY[(i + 2) % 6]})"><i class="dot" style="--dc:var(--candy-${CANDY[(i + 2) % 6]})"></i>${esc(l.label || l.url)}${ext}</a>`).join('');
    $('#year').textContent = new Date().getFullYear();
  }

  /* =======================================================================
     語言（G7）
     ======================================================================= */
  function applyTexts() {
    $$('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
    $$('[data-t-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.tAria)));
    $$('[data-zh]').forEach(el => { el.textContent = lang === 'en' ? (el.dataset.en || el.dataset.zh) : el.dataset.zh; });
    $$('.lang').forEach(g => { g.dataset.lang = lang; $$('button', g).forEach(b => b.setAttribute('aria-pressed', b.dataset.setLang === lang)); });
    root.lang = lang === 'en' ? 'en' : 'zh-Hant';
    root.dataset.lang = lang;
    document.title = t('title');
  }
  function setLang(next) {
    if (next === lang) return;
    const inView = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0; };
    const targets = hasG && !RM ? $$('[data-t], [data-zh]').filter(el => !el.closest('.marquee, .menu, .detail') && inView(el)).slice(0, 60) : [];
    const swap = () => {
      lang = next; store('lang', next);
      applyTexts(); renderAbout(); setupAbout();
      if (detailState.open) renderDetail(detailState.item, true);
      requestAnimationFrame(() => { moveFilterKnob(true); moveNavPill(activeSection, true); if (ST) ST.refresh(); });
    };
    if (!targets.length) return swap();
    G.to(targets, { yPercent: -40, opacity: 0, duration: .16, ease: 'power2.in', stagger: .005, onComplete: () => {
      swap();
      G.fromTo(targets, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .32, ease: 'back.out(1.7)', stagger: .005, clearProps: 'transform,opacity' });
    } });
  }
  $$('[data-set-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.setLang)));

  /* =======================================================================
     深色模式（G6）
     ======================================================================= */
  function setThemeColor() { const m = $('meta[name="theme-color"]'); if (m) m.content = root.dataset.theme === 'dark' ? '#110F1E' : '#816DFF'; }
  function toggleTheme(btn) {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => { root.dataset.theme = next; store('theme', next); setThemeColor(); };
    if (!document.startViewTransition || RM) return apply();
    const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 600, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
  }
  $$('.theme-btn').forEach(b => b.addEventListener('click', () => toggleTheme(b)));
  setThemeColor();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    let saved = null; try { saved = localStorage.getItem('bp-theme'); } catch (err) {}
    if (!saved) { root.dataset.theme = e.matches ? 'dark' : 'light'; setThemeColor(); }
  });

  /* =======================================================================
     導覽（G8）＋選單（G9）＋錨點捲動
     ======================================================================= */
  let activeSection = null;
  function moveNavPill(id, instant) {
    const pill = $('#navLinks .pill');
    $$('[data-nav]').forEach(a => a.classList.toggle('is-active', a.dataset.nav === id));
    const a = id && $(`[data-nav="${id}"]`);
    if (!pill) return;
    if (!a || !a.offsetWidth) { hasG ? G.to(pill, { opacity: 0, duration: .2 }) : pill.style.opacity = 0; return; }
    const sec = SECTIONS.find(s => s[0] === id);
    pill.style.setProperty('--pc', sec ? sec[3] : 'var(--color-primary)');
    const props = { x: a.parentElement.offsetLeft, width: a.offsetWidth, opacity: 1 };
    if (!hasG) { pill.style.transform = `translateX(${props.x}px)`; pill.style.width = props.width + 'px'; pill.style.opacity = 1; return; }
    G.to(pill, { ...props, duration: instant || RM ? 0 : .45, ease: 'back.out(1.7)' });
  }
  function setActive(id) { if (id === activeSection) return; activeSection = id; moveNavPill(id); }

  function scrollToTarget(sel) {
    const el = typeof sel === 'string' ? $(sel) : sel;
    if (!el) return;
    const y = el.id === 'top' ? 0 : el.getBoundingClientRect().top + scrollY - 80;
    if (hasG && window.ScrollToPlugin && !RM) G.to(window, { scrollTo: { y, autoKill: true }, duration: clamp(Math.abs(y - scrollY) / 2600, .6, 1.2), ease: 'power3.inOut' });
    else window.scrollTo(0, y);
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#' || href.startsWith('#work/') || a.classList.contains('skip')) return;
    const target = $(href);
    if (!target) return;
    e.preventDefault();
    if (menuOpen) closeMenu(true);
    scrollToTarget(target);
  });
  $('#toTop').addEventListener('click', () => scrollToTarget('#top'));

  const menu = $('#menu'), menuBtn = $('.menu-btn');
  let menuOpen = false;
  function openMenu() {
    menuOpen = true;
    const r = menuBtn.getBoundingClientRect();
    menu.style.setProperty('--mx', (r.left + r.width / 2) + 'px'); menu.style.setProperty('--my', (r.top + r.height / 2) + 'px');
    menu.style.visibility = 'visible'; menu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.setAttribute('aria-label', t('menuClose'));
    menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    root.classList.add('is-locked');
    const at = `at ${menu.style.getPropertyValue('--mx')} ${menu.style.getPropertyValue('--my')}`;
    if (hasG && !RM) {
      G.fromTo(menu, { clipPath: `circle(0% ${at})` }, { clipPath: `circle(150% ${at})`, duration: .7, ease: 'power3.inOut' });
      G.fromTo($$('#menuLinks a, .menu-foot > *'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'back.out(1.7)', stagger: .05, delay: .25 });
    } else menu.style.clipPath = 'none';
    setTimeout(() => { const f = $('#menuLinks a'); if (f) f.focus(); }, RM ? 0 : 500);
  }
  function closeMenu(quick) {
    menuOpen = false;
    menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', t('menuOpen'));
    menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg>';
    root.classList.remove('is-locked'); menu.setAttribute('aria-hidden', 'true');
    const done = () => { menu.style.visibility = 'hidden'; };
    const at = `at ${menu.style.getPropertyValue('--mx')} ${menu.style.getPropertyValue('--my')}`;
    if (hasG && !RM) G.to(menu, { clipPath: `circle(0% ${at})`, duration: quick ? .35 : .5, ease: 'power3.inOut', onComplete: done });
    else { menu.style.clipPath = ''; done(); }
  }
  menuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());

  /* =======================================================================
     經歷展開（E3）
     ======================================================================= */
  function toggleExp(item, open) {
    const body = $('.tl-body', item), btn = $('.tl-head', item);
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
    if (!hasG || RM) { body.style.height = open ? 'auto' : '0px'; if (ST) ST.refresh(); return; }
    if (open) G.fromTo(body, { height: body.offsetHeight }, { height: 'auto', duration: .5, ease: 'power3.out', onComplete: () => ST && ST.refresh() });
    else G.fromTo(body, { height: body.offsetHeight }, { height: 0, duration: .4, ease: 'power3.out', onComplete: () => ST && ST.refresh() });
    if (open) G.fromTo($('p', body), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .4, delay: .1 });
  }
  function bindTimeline() {
    $$('.tl-item').forEach(item => $('.tl-head', item).addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      if (open) $$('.tl-item.is-open').forEach(o => o !== item && toggleExp(o, false));
      toggleExp(item, open);
    }));
  }

  /* =======================================================================
     擅長（X1 手風琴、X3 手機輪播）
     ======================================================================= */
  const DESK = matchMedia('(min-width: 1025px)');
  const PHONE = matchMedia('(max-width: 640px)');
  let xpTl = null;
  function sizeXp() {                                                        // 文字寬度＝展開卡片的內容寬
    const xp = $('#xp'), open = $('.xp-card.is-open', xp);
    if (!DESK.matches || !open || (xpTl && xpTl.isActive())) return;
    const cs = getComputedStyle(open);
    xp.style.setProperty('--xp-w', (open.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) + 'px');
  }
  function openXp(card) {
    const cards = $$('.xp-card');
    if (card.classList.contains('is-open') || !DESK.matches) return;
    const swap = () => cards.forEach(c => { c.classList.toggle('is-open', c === card); c.setAttribute('aria-expanded', c === card); });
    if (!hasG || RM) return swap();
    if (xpTl) xpTl.progress(1).kill();                                      // 快速連續切換時先把上一段收尾
    const prev = cards.find(c => c.classList.contains('is-open'));
    const from = cards.map(c => parseFloat(getComputedStyle(c).flexGrow) || 1);
    swap();
    const to = cards.map(c => parseFloat(getComputedStyle(c).flexGrow) || 1);
    const vis = { visibility: 'visible' };
    xpTl = G.timeline({ onComplete: () => { G.set(cards, { clearProps: 'flexGrow' }); G.set($$('.txt, .v, .h, .desc', $('#xp')), { clearProps: 'opacity,visibility,transform' }); } })
      .fromTo(cards, { flexGrow: i => from[i] }, { flexGrow: i => to[i], duration: .7, ease: 'power3.inOut' }, 0)
      // 展開的卡片：直書標題往下滑出，橫書標題與說明跟著卡片變寬一起滑入（文字全程都在）
      .fromTo($('.v', card), { ...vis, opacity: 1, y: 0 }, { opacity: 0, y: 40, duration: .3, ease: 'power2.in' }, 0)
      .fromTo($('.txt', card), { ...vis, opacity: 1 }, { opacity: 1, duration: .01 }, 0)
      .fromTo($('.h', card), { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: .6, ease: 'expo.out' }, .12)
      .fromTo($('.desc', card), { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: .75, ease: 'expo.out' }, .2);
    if (prev) xpTl
      // 收合的卡片：說明被卡片邊緣「收」進去，同時淡出；直書標題由下往上浮現
      .fromTo($('.txt', prev), { ...vis, opacity: 1, x: 0 }, { opacity: 0, x: -24, duration: .3, ease: 'power2.in' }, 0)
      .fromTo($('.v', prev), { ...vis, opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .55, ease: 'back.out(1.6)' }, .32);
  }
  function bindExpertise() {
    const cards = $$('.xp-card');
    cards.forEach(c => {
      c.addEventListener('click', () => openXp(c));
      let hov = null;
      if (FINE) { c.addEventListener('pointerenter', () => { hov = setTimeout(() => openXp(c), 90); }); c.addEventListener('pointerleave', () => clearTimeout(hov)); }
      c.addEventListener('focus', () => openXp(c));
    });
    sizeXp();
    addEventListener('resize', sizeXp, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeXp);
    const dots = $$('#xpDots i');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (!PHONE.matches) return;
        if (e.isIntersecting) {
          const i = cards.indexOf(e.target);
          cards.forEach((c, j) => c.classList.toggle('is-center', j === i));
          dots.forEach((d, j) => d.classList.toggle('is-on', j === i));
        }
      }), { root: $('#xp'), threshold: .6 });
      cards.forEach(c => io.observe(c));
    }
  }

  /* =======================================================================
     作品篩選（W1、W2）
     ======================================================================= */
  function moveFilterKnob(instant) {
    const btn = $('#filters button[aria-pressed="true"]'), knob = $('#filters .knob');
    if (!btn || !knob) return;
    const props = { x: btn.offsetLeft, width: btn.offsetWidth };
    if (!hasG) { knob.style.transform = `translateX(${props.x}px)`; knob.style.width = props.width + 'px'; return; }
    G.to(knob, { ...props, duration: instant || RM ? 0 : .45, ease: 'back.out(1.7)' });
  }
  function applyFilter(f) {
    currentFilter = f;
    $$('#filters button').forEach(b => b.setAttribute('aria-pressed', b.dataset.filter === f));
    moveFilterKnob();
    const cards = $$('#grid .card');
    const state = hasG && window.Flip && !RM ? Flip.getState(cards) : null;
    cards.forEach(c => { c.hidden = !(f === 'all' || c.dataset.cat === f); });
    layoutSpans();
    if (state) {
      Flip.from(state, {
        duration: .6, ease: 'power3.inOut', absolute: true, nested: true,
        onEnter: els => G.fromTo(els, { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(1.7)', delay: .15, clearProps: 'transform' }),
        onLeave: els => G.to(els, { opacity: 0, scale: .8, duration: .3 }),
        onComplete: () => { G.set(cards, { clearProps: 'transform,opacity' }); if (ST) ST.refresh(); },
      });
    } else if (ST) ST.refresh();
  }
  function bindWorks() {
    $$('#filters button').forEach(b => b.addEventListener('click', () => { applyFilter(b.dataset.filter); b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: RM ? 'auto' : 'smooth' }); }));
    $$('#grid .card').forEach(c => c.addEventListener('click', () => openWork(c.dataset.id, c)));
    requestAnimationFrame(() => moveFilterKnob(true));
  }

  /* =======================================================================
     作品詳情（D1–D5）＋燈箱（D4）
     ======================================================================= */
  const detail = $('#detail'), veil = $('.veil'), dWrap = $('#dWrap');
  const detailState = { open: false, item: null, origin: null, pushed: false, busy: false, ctx: null, trigger: null };
  const splitTitle = text => String(text).split(/(\s+)/).map(p => /^\s+$/.test(p) ? ' ' : `<span class="w">${[...p].map(ch => `<span class="ch">${esc(ch)}</span>`).join('')}</span>`).join('');
  const workTitle = w => lang === 'en' ? (w.title_en || w.title_zh) : (w.title_zh || w.title_en);
  function renderDetail(w, keepScroll) {
    const i = WORKS.indexOf(w), prev = WORKS[(i - 1 + WORKS.length) % WORKS.length], next = WORKS[(i + 1) % WORKS.length];
    const imgs = [w.cover, ...(w.images || []).filter(src => src !== w.cover)].filter(Boolean);
    const cat = lang === 'en' ? (w.cat.name_en || w.cat.name_zh) : w.cat.name_zh;
    const desc = lang === 'en' ? (w.desc_en || w.desc_zh) : (w.desc_zh || w.desc_en);
    detail.setAttribute('style', candyVars(w.cat.color));
    $('#dCrumb').textContent = `${cat} · ${workTitle(w)}`;
    const tags = tagsOf(w);
    dWrap.innerHTML = `
      <header class="d-hero">
        <div><span class="chip" style="--cb:var(--candy-${w.cat.color}-soft);--cf:var(--candy-${w.cat.color}-deep)"><i class="dot" style="--dc:var(--candy-${w.cat.color})"></i>${esc(cat)}</span>
          <h1 id="dTitle" tabindex="-1" aria-label="${esc(workTitle(w))}"><span aria-hidden="true">${splitTitle(workTitle(w))}</span></h1></div>
        <div class="side">${tags.length ? `<div class="tags">${tags.map(tg => `<span class="chip flat" style="--cb:var(--color-surface-2)">#${esc(tg)}</span>`).join('')}</div>` : ''}
          ${w.link ? `<a class="btn small magnet" href="${esc(w.link)}" target="_blank" rel="noopener" data-cursor data-cc="var(--candy-${w.cat.color})">${esc(t('visit'))}<span class="arrow">${ARROW}</span></a>` : ''}</div>
      </header>
      ${imgs[0] ? `<figure class="d-cover" style="margin-left:0;margin-right:0;margin-bottom:0"><button style="all:unset;display:block;cursor:zoom-in" data-lb="0" aria-label="${esc(workTitle(w))}"><img src="${esc(imgs[0])}" alt="${esc(workTitle(w))}" decoding="async"></button></figure>` : ''}
      ${desc ? `<div class="d-body"><span class="eyebrow" style="--sc:var(--candy-${w.cat.color})">${esc(t('aboutProject'))}</span><p>${esc(desc)}</p></div>` : ''}
      ${imgs.length > 1 ? `<div class="gallery">${imgs.slice(1).map((src, k) => `<button data-lb="${k + 1}" data-cursor data-cc="var(--candy-${w.cat.color})" aria-label="${esc(workTitle(w))} ${k + 2}"><img src="${esc(src)}" alt="" loading="lazy" decoding="async"></button>`).join('')}</div>` : ''}
      ${WORKS.length > 1 ? `<nav class="pn">
        <button data-go="${esc(prev.id)}" style="${candyVars(prev.cat.color)}" data-cursor data-cc="var(--candy-${prev.cat.color})"><span class="th">${prev.cover ? `<img src="${esc(prev.cover)}" alt="" loading="lazy">` : ''}</span><span class="txt"><small>← ${esc(t('prev'))}</small><b>${esc(workTitle(prev))}</b></span></button>
        <button class="next" data-go="${esc(next.id)}" style="${candyVars(next.cat.color)}" data-cursor data-cc="var(--candy-${next.cat.color})"><span class="th">${next.cover ? `<img src="${esc(next.cover)}" alt="" loading="lazy">` : ''}</span><span class="txt"><small>${esc(t('next'))} →</small><b>${esc(workTitle(next))}</b></span></button>
      </nav>` : ''}`;
    detailState.item = w; detailState.imgs = imgs;
    $$('[data-lb]', dWrap).forEach(b => b.addEventListener('click', () => openLightbox(+b.dataset.lb, $('img', b))));
    $$('[data-go]', dWrap).forEach(b => b.addEventListener('click', () => switchWork(b.dataset.go, b)));
    bindMagnets(dWrap);
    if (!keepScroll) detail.scrollTop = 0;
    // D3 封面下沉
    if (detailState.ctx) detailState.ctx.revert();
    if (hasG && ST && !RM) detailState.ctx = G.context(() => {
      const cov = $('.d-cover', dWrap);
      if (cov) G.to(cov, { scale: .94, borderRadius: 96, ease: 'none', scrollTrigger: { trigger: cov, scroller: detail, start: 'top 30%', end: 'bottom top', scrub: true } });
    });
  }
  function introDetail() {
    if (!hasG || RM) return;
    G.fromTo($$('#dTitle .ch'), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'back.out(1.7)', stagger: .02 });
    G.fromTo($('.d-cover', dWrap), { y: 60, scale: .96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .9, ease: 'expo.out', delay: .1, clearProps: 'transform,opacity' });
    G.fromTo($$('.d-hero .chip, .d-hero .side > *, .d-body, .gallery, .pn'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'expo.out', stagger: .06, delay: .15, clearProps: 'transform,opacity' });
  }
  const centerOf = el => { if (!el || !el.offsetParent) return { x: innerWidth / 2, y: innerHeight / 2 }; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  /* 圓形轉場：從游標（或點擊的元素）位置擴張，擴張過程中由分類色漸變成頁面底色，
     蓋滿時剛好等於詳情頁底色，內容再浮現——全程只有一個圓，沒有第二層遮罩。 */
  const cssVar = n => getComputedStyle(root).getPropertyValue(n).trim();
  const farR = (x, y) => Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 24;
  function startPoint(fromEl, useCursor) {
    const cu = $('.cursor');
    if (useCursor && root.classList.contains('has-cursor') && cu && +G.getProperty(cu, 'opacity') > 0) {
      const c = $('.c', cu).getBoundingClientRect();
      return { x: c.left + c.width / 2, y: c.top + c.height / 2, r: c.width / 2 };
    }
    return { ...centerOf(fromEl), r: 0 };
  }
  function hideCursor() { const cu = $('.cursor'); if (cu) { cu.classList.remove('is-big', 'has-label'); if (hasG) G.set(cu, { opacity: 0 }); } }
  function growVeil(p, color, dur) {                                       // 分類色 → 底色
    const bg = cssVar('--color-bg'), R = farR(p.x, p.y);
    return G.timeline()
      .set(veil, { visibility: 'visible', opacity: 1, backgroundColor: color, clipPath: `circle(${p.r}px at ${p.x}px ${p.y}px)` })
      .to(veil, { clipPath: `circle(${R}px at ${p.x}px ${p.y}px)`, duration: dur, ease: 'power3.inOut' }, 0)
      .to(veil, { backgroundColor: bg, duration: dur, ease: 'sine.inOut' }, 0);
  }
  function openWork(id, fromEl, opts = {}) {
    const w = WORKS.find(x => String(x.id) === String(id));
    if (!w || detailState.busy) return;
    if (detailState.open) return switchWork(id, null);
    detailState.busy = true; detailState.open = true;
    detailState.trigger = fromEl || $(`#grid .card[data-id="${CSS.escape(String(id))}"]`);
    if (!opts.fromPop) {
      const h = '#work/' + encodeURIComponent(id);
      if (location.hash !== h) { history.pushState({ work: id }, '', h); detailState.pushed = true; }
    }
    const done = () => { detailState.busy = false; const h1 = $('#dTitle'); if (h1) h1.focus({ preventScroll: true }); };
    if (!hasG || RM) { renderDetail(w); root.classList.add('is-locked'); detail.classList.add('is-open'); if (hasG) G.fromTo(detail, { opacity: 0 }, { opacity: 1, duration: .3 }); return done(); }
    const p = startPoint(fromEl, !!fromEl);
    hideCursor();
    G.timeline({ onComplete: done })
      .add(growVeil(p, cssVar(`--candy-${w.cat.color}`), .95))
      .add(() => {
        renderDetail(w); root.classList.add('is-locked');
        detail.classList.add('is-open'); G.set(detail, { opacity: 1 });
        G.set(veil, { visibility: 'hidden' });                             // 顏色已等於詳情頁底色，直接換手
        introDetail();
      });
  }
  function closeWork(opts = {}) {
    if (!detailState.open || detailState.busy) return;
    if (!opts.fromPop && detailState.pushed) { history.back(); return; }        // popstate 會再呼叫一次 closeWork
    if (!opts.fromPop) history.replaceState(null, '', location.pathname + location.search);
    detailState.busy = true;
    const w = detailState.item;
    const card = $(`#grid .card[data-id="${CSS.escape(String(w.id))}"]`);
    const target = card && !card.hidden ? card : null;
    const finish = () => {
      detail.classList.remove('is-open'); root.classList.remove('is-locked');
      detailState.open = false; detailState.busy = false; detailState.pushed = false;
      if (detailState.ctx) { detailState.ctx.revert(); detailState.ctx = null; }
      const f = target || detailState.trigger; if (f && f.focus) f.focus({ preventScroll: true });
    };
    if (!hasG || RM) { if (hasG) G.to(detail, { opacity: 0, duration: .25, onComplete: finish }); else finish(); return; }
    hideCursor();
    const { x, y } = centerOf(target), R = farR(x, y);
    G.timeline({ onComplete: finish })
      .set(veil, { visibility: 'visible', opacity: 1, backgroundColor: cssVar('--color-bg'), clipPath: `circle(${R}px at ${x}px ${y}px)` })
      .to(detail, { opacity: 0, duration: .25, ease: 'power1.in' })          // 內容淡出，底下是同色的圓
      .add(() => { detail.classList.remove('is-open'); root.classList.remove('is-locked'); G.set(detail, { opacity: 1 }); })
      .to(veil, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: .75, ease: 'power3.inOut' })
      .to(veil, { backgroundColor: cssVar(`--candy-${w.cat.color}`), duration: .75, ease: 'sine.inOut' }, '<')
      .set(veil, { visibility: 'hidden' });
  }
  function switchWork(id, fromBtn) {                                                   // D5
    const w = WORKS.find(x => String(x.id) === String(id));
    if (!w || detailState.busy) return;
    history.replaceState({ work: id }, '', '#work/' + encodeURIComponent(id));
    if (!hasG || RM) { renderDetail(w); const h = $('#dTitle'); if (h) h.focus({ preventScroll: true }); return; }
    detailState.busy = true;
    const p = startPoint(fromBtn, !!fromBtn);
    hideCursor();
    G.timeline({ onComplete: () => { detailState.busy = false; const h = $('#dTitle'); if (h) h.focus({ preventScroll: true }); } })
      .add(growVeil(p, cssVar(`--candy-${w.cat.color}`), .85))
      .add(() => { renderDetail(w); G.set(veil, { visibility: 'hidden' }); introDetail(); });
  }
  $('#dBack').addEventListener('click', () => closeWork());
  $('#dClose').addEventListener('click', () => closeWork());
  function routeFromHash(fromPop) {
    const m = location.hash.match(/^#work\/(.+)$/);
    if (m) { const id = decodeURIComponent(m[1]); if (!detailState.open) openWork(id, null, { fromPop: true }); else if (String(detailState.item.id) !== id) switchWork(id, null); }
    else if (detailState.open) closeWork({ fromPop: true });
  }
  addEventListener('popstate', () => { if (lb.open) closeLightbox(true); detailState.pushed = false; routeFromHash(true); });

  const lbEl = $('#lightbox'), lbImg = $('#lbImg');
  const lb = { open: false, i: 0, from: null };
  function flipFrom(fromEl, toEl, dur = .55) {
    if (!hasG || RM || !fromEl || !fromEl.offsetParent) return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    if (!b.width) return;
    G.fromTo(toEl, { x: (a.left + a.width / 2) - (b.left + b.width / 2), y: (a.top + a.height / 2) - (b.top + b.height / 2), scale: a.width / b.width },
      { x: 0, y: 0, scale: 1, duration: dur, ease: 'power3.inOut' });
  }
  function showLb(i) {
    const imgs = detailState.imgs || [];
    lb.i = (i + imgs.length) % imgs.length;
    lbImg.src = imgs[lb.i];
    lbImg.alt = `${workTitle(detailState.item)} ${lb.i + 1}`;
    $('#lbCnt').textContent = `${lb.i + 1} / ${imgs.length}`;
    const multi = imgs.length > 1; $('#lbPrev').hidden = !multi; $('#lbNext').hidden = !multi;
  }
  async function openLightbox(i, fromImg) {
    lb.open = true; lb.from = fromImg; showLb(i);
    lbEl.classList.add('is-open');
    try { await lbImg.decode(); } catch (e) {}
    if (hasG) { G.to(lbEl, { opacity: 1, duration: RM ? 0 : .3 }); flipFrom(fromImg, lbImg); } else lbEl.style.opacity = 1;
    $('#lbClose').focus({ preventScroll: true });
  }
  function closeLightbox(quick) {
    if (!lb.open) return;
    lb.open = false;
    const target = $$(`[data-lb="${lb.i}"] img`, dWrap)[0];
    const end = () => { lbEl.classList.remove('is-open'); G && G.set(lbImg, { clearProps: 'transform' }); const b = target && target.closest('button'); if (b) b.focus({ preventScroll: true }); };
    if (!hasG || RM || quick) { lbEl.style.opacity = 0; return end(); }
    if (target && target.offsetParent) {
      const a = target.getBoundingClientRect(), b = lbImg.getBoundingClientRect();
      G.to(lbImg, { x: (a.left + a.width / 2) - (b.left + b.width / 2), y: (a.top + a.height / 2) - (b.top + b.height / 2), scale: a.width / b.width, duration: .45, ease: 'power3.inOut' });
    }
    G.to(lbEl, { opacity: 0, duration: .45, delay: .05, onComplete: end });
  }
  function stepLb(d) {
    showLb(lb.i + d);
    if (hasG && !RM) G.fromTo(lbImg, { x: d * 60, opacity: 0 }, { x: 0, opacity: 1, duration: .4, ease: 'expo.out' });
  }
  $('#lbClose').addEventListener('click', () => closeLightbox());
  $('#lbPrev').addEventListener('click', () => stepLb(-1));
  $('#lbNext').addEventListener('click', () => stepLb(1));
  lbEl.addEventListener('click', e => { if (e.target === lbEl) closeLightbox(); });
  let sx = null, sy = null;
  lbEl.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; });
  lbEl.addEventListener('pointerup', e => {
    if (sx == null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) stepLb(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (lb.open) {
      if (e.key === 'Escape') closeLightbox(); else if (e.key === 'ArrowRight') stepLb(1); else if (e.key === 'ArrowLeft') stepLb(-1);
      else if (e.key === 'Tab') { const f = $$('button:not([hidden])', lbEl); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
      return;
    }
    if (detailState.open && e.key === 'Escape') return closeWork();
    if (menuOpen && e.key === 'Escape') { closeMenu(); menuBtn.focus(); }
  });

  /* =======================================================================
     聯絡（C3 複製 email）
     ======================================================================= */
  async function copyEmail() {
    const email = (D.contact && D.contact.email) || '';
    let ok = false;
    try { await navigator.clipboard.writeText(email); ok = true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = email; ta.style.position = 'fixed'; ta.style.opacity = 0; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (err) {} ta.remove();
    }
    const toast = $('#toast'); toast.textContent = ok ? t('copied') : t('copyFail');
    const btn = $('#copyBtn'), box = $('#emailBox');
    if (!hasG) { toast.style.opacity = 1; setTimeout(() => toast.style.opacity = 0, 1600); return; }
    G.timeline().fromTo(toast, { opacity: 0, y: 10, scale: .8 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: 'back.out(2)' }).to(toast, { opacity: 0, y: -6, duration: .3, delay: 1.6 });
    if (RM || !ok) return;
    const br = btn.getBoundingClientRect(), bx = box.getBoundingClientRect();
    for (let i = 0; i < 12; i++) {
      const b = document.createElement('i'); b.className = 'burst';
      b.style.background = `var(--candy-${CANDY[i % 6]})`;
      b.style.left = (br.left - bx.left + br.width / 2) + 'px'; b.style.top = (br.top - bx.top + br.height / 2) + 'px';
      box.appendChild(b);
      const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 50;
      G.fromTo(b, { x: 0, y: 0, scale: .4 + Math.random() * .6 }, { x: Math.cos(a) * d, y: Math.sin(a) * d, scale: 0, duration: .7 + Math.random() * .3, ease: 'expo.out', onComplete: () => b.remove() });
    }
  }
  $('#copyBtn').addEventListener('click', copyEmail);

  /* =======================================================================
     互動：游標（G2）、磁吸（G3）、拖曳（A4、S5）
     ======================================================================= */
  function setupCursor() {
    if (!FINE || RM || !hasG) return;
    root.classList.add('has-cursor');
    const cur = $('.cursor'), label = $('.cursor span');
    const xTo = G.quickTo(cur, 'x', { duration: .35, ease: 'power3' }), yTo = G.quickTo(cur, 'y', { duration: .35, ease: 'power3' });
    G.set(cur, { x: innerWidth / 2, y: innerHeight / 2, opacity: 0 });
    addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); if (+cur.style.opacity === 0) G.to(cur, { opacity: 1, duration: .2 }); }, { passive: true });
    document.addEventListener('pointerleave', () => G.to(cur, { opacity: 0, duration: .2 }));
    document.addEventListener('pointerover', e => {
      const el = e.target.closest('[data-cursor], a, button');
      cur.classList.toggle('is-big', !!el);
      const lab = el && el.dataset.cursorLabel;
      cur.classList.toggle('has-label', !!lab);
      if (lab) label.textContent = lab;
      cur.style.setProperty('--cc', (el && el.dataset.cc) || '');
      cur.classList.toggle('on-primary', !!e.target.closest('.menu'));        // 選單底色＝主色，游標改深色＋白框
    });
  }
  function bindMagnets(scope = document) {
    if (!FINE || RM || !hasG) return;
    $$('.magnet', scope).forEach(m => {
      if (m.dataset.mag) return; m.dataset.mag = 1;
      const k = parseFloat(m.dataset.magnet || '.35');
      const xTo = G.quickTo(m, 'x', { duration: .4, ease: 'power3' }), yTo = G.quickTo(m, 'y', { duration: .4, ease: 'power3' });
      m.addEventListener('pointermove', e => { const r = m.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * k); yTo((e.clientY - r.top - r.height / 2) * k); });
      m.addEventListener('pointerleave', () => G.to(m, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1, 0.4)', overwrite: true }));
    });
  }
  function setupDraggables() {
    if (!hasG || !window.Draggable || RM) return;
    const back = function () { G.to(this.target, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1, 0.4)' }); };
    if (FINE) Draggable.create($$('#domains [data-drag]'), { type: 'x,y', bounds: '#about', zIndexBoost: true, onRelease: back });
    else $$('#domains [data-drag]').forEach(c => c.addEventListener('click', () => G.fromTo(c, { scale: .9 }, { scale: 1, duration: .5, ease: 'back.out(3)' })));
  }

  /* =======================================================================
     專長工具泡泡（S1–S5）
     ======================================================================= */
  /* S0 泡泡排版：依容器實際寬高計算大小，再用簡單的互斥迭代把重疊推開（手機改走 CSS 格狀） */
  function layoutBubbles() {
    $$('.cluster').forEach(cl => {
      const box = $('.bubbles', cl), bs = $$('.bubble', cl);
      if (PHONE.matches) { bs.forEach(b => { b.style.left = b.style.top = b.style.width = b.style.margin = ''; }); return; }
      const W = box.clientWidth, H = box.clientHeight;
      if (!W || !H) return;
      let pts = bs.map(b => {
        const s = parseFloat(b.style.getPropertyValue('--s')) / 100 || .22;
        return { b, x: parseFloat(b.style.getPropertyValue('--x')) / 100 * W, y: parseFloat(b.style.getPropertyValue('--y')) / 100 * H, r: clamp(Math.min(W, H * 1.5) * s, 92, 168) / 2 };
      });
      const area = pts.reduce((a, p) => a + Math.PI * p.r * p.r, 0), maxA = W * H * .42;
      if (area > maxA) { const k = Math.sqrt(maxA / area); pts.forEach(p => { p.r *= k; }); }
      const gap = 16;
      for (let it = 0; it < 400; it++) {
        let moved = false;
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], c = pts[j]; let dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || .01;
          const min = a.r + c.r + gap;
          if (d < min) { const push = (min - d) / 2; dx /= d; dy /= d; a.x -= dx * push; a.y -= dy * push; c.x += dx * push; c.y += dy * push; moved = true; }
        }
        pts.forEach(p => { p.x = clamp(p.x, p.r + 4, W - p.r - 4); p.y = clamp(p.y, p.r + 6, H - p.r - 10); });
        if (!moved) break;
      }
      pts.forEach(p => { p.b.style.left = p.x + 'px'; p.b.style.top = p.y + 'px'; p.b.style.width = p.r * 2 + 'px'; p.b.style.margin = `${-p.r}px 0 0 ${-p.r}px`; });
    });
  }
  function setupBubbles() {
    layoutBubbles();
    let rt = null; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layoutBubbles, 120); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutBubbles);
    const bubbles = $$('.bubble');
    if (!hasG || RM) return;
    const floats = bubbles.map(b => G.to($('.fl', b), { x: G.utils.random(-6, 6), y: G.utils.random(-10, 10), duration: G.utils.random(3, 5), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: G.utils.random(0, 2) }));
    G.fromTo($$('.bubble .in'), { y: 60, scale: .6, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .9, ease: 'back.out(2)', stagger: { each: .05, from: 'random' }, scrollTrigger: { trigger: '#skillsGrid', start: 'top 80%', once: true } });
    ST.create({ trigger: '#skills', start: 'top bottom', end: 'bottom top', onToggle: s => floats.forEach(f => s.isActive ? f.resume() : f.pause()) });
    if (!PHONE.matches && window.Draggable && FINE) {
      let dragging = false;
      Draggable.create(bubbles, { type: 'x,y', bounds: '#skills', zIndexBoost: true, onPress() { dragging = true; }, onRelease() { dragging = false; G.to(this.target, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1, 0.4)' }); } });
      $$('.cluster').forEach(cl => {
        const bs = $$('.bubble', cl).map(b => ({ b, xTo: G.quickTo(b, 'x', { duration: .5, ease: 'power3' }), yTo: G.quickTo(b, 'y', { duration: .5, ease: 'power3' }) }));
        cl.addEventListener('pointermove', e => {
          if (dragging) return;
          bs.forEach(({ b, xTo, yTo }) => {
            const r = $('.in', b).getBoundingClientRect(), cx = r.left + r.width / 2 - (G.getProperty(b, 'x') || 0), cy = r.top + r.height / 2 - (G.getProperty(b, 'y') || 0);
            const dx = cx - e.clientX, dy = cy - e.clientY, d = Math.hypot(dx, dy), R = r.width / 2 + 70;
            if (d < R && !b.matches(':hover')) { const f = (R - d) / R * 26; xTo(dx / (d || 1) * f); yTo(dy / (d || 1) * f); } else { xTo(0); yTo(0); }
          });
        });
        cl.addEventListener('pointerleave', () => { if (!dragging) bs.forEach(({ xTo, yTo }) => { xTo(0); yTo(0); }); });
      });
    }
    if (!FINE) $$('.bubble').forEach(b => b.addEventListener('click', () => { b.classList.add('is-on'); setTimeout(() => b.classList.remove('is-on'), 1000); }));
  }

  /* =======================================================================
     捲動動態
     ======================================================================= */
  let aboutTl = null;
  function setupAbout() {
    if (aboutTl) { aboutTl.scrollTrigger && aboutTl.scrollTrigger.kill(); aboutTl.kill(); aboutTl = null; }
    if (!hasG || !ST || RM) return;
    const el = $('#aboutText'), tks = $$('.tk', el);
    aboutTl = G.timeline({ scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 42%', scrub: .5 } });
    aboutTl.to(tks, { opacity: 1, duration: .3, stagger: .1, ease: 'none' }, 0);
    $$('mark', el).forEach(m => {
      const first = $('.tk', m), at = tks.indexOf(first) * .1;
      if (m.classList.contains('long')) aboutTl.fromTo(m, { backgroundSize: '0% 36%' }, { backgroundSize: '100% 36%', duration: 1.2, ease: 'none' }, at);
      else aboutTl.to($('path', m), { strokeDashoffset: 0, duration: .9, ease: 'power2.out' }, at + .2);
    });
  }

  function setupScroll() {
    if (!hasG || !ST) { $$('.tl-item').forEach(i => i.classList.add('is-lit')); return; }

    // G8 導覽列：進度環、隱藏／出現、目前區塊
    const bar = $('.logo .bar'), nav = $('#nav');
    let hidden = false;
    ST.create({
      start: 0, end: 'max',
      onUpdate: s => {
        bar.style.strokeDashoffset = 1 - s.progress;
        if (RM || menuOpen) return;
        const hide = s.direction === 1 && s.scroll() > 240;
        if (hide !== hidden) { hidden = hide; G.to(nav, { yPercent: hide ? -160 : 0, duration: .35, ease: 'power3.out' }); }
      },
    });
    SECTIONS.forEach(([id]) => ST.create({ trigger: '#' + id, start: 'top 45%', end: 'bottom 45%', onToggle: s => s.isActive && setActive(id) }));
    ST.create({ trigger: '#top', start: 'top top', end: 'bottom 45%', onToggle: s => s.isActive && setActive(null) });

    // E1、E2 時間軸
    if (RM) { $$('.tl-item').forEach(i => i.classList.add('is-lit')); }
    else {
      G.fromTo('.tl-line i', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#timeline', start: 'top 62%', end: 'bottom 62%', scrub: .4 } });
      $$('.tl-item').forEach(item => ST.create({
        trigger: $('.tl-node', item), start: 'top 62%',
        onEnter: () => { item.classList.add('is-lit'); G.fromTo($('.tl-node', item), { scale: .6 }, { scale: 1, duration: .5, ease: 'back.out(3)' }); },
        onLeaveBack: () => item.classList.remove('is-lit'),
      }));
    }

    if (RM) return;

    // G4 區塊進場
    const heads = $$('.sec-head, .about-side, .works-head, .contact h2, .contact .sayhi, .contact .email');
    heads.forEach(h => h.setAttribute('data-reveal', ''));
    const rev = $$('[data-reveal]');
    G.set(rev, { y: 40, opacity: 0 });
    ST.batch(rev, { start: 'top 88%', once: true, onEnter: batch => G.to(batch, { y: 0, opacity: 1, duration: .7, ease: 'expo.out', stagger: .07, overwrite: true, clearProps: 'transform,opacity' }) });
    G.set($$('.domains .chip'), { scale: 0 });
    ST.create({ trigger: '#domains', start: 'top 88%', once: true, onEnter: () => G.to($$('.domains .chip'), { scale: 1, duration: .6, ease: 'back.out(2)', stagger: .05 }) });

    // G5 背景裝飾視差
    $$('.deco i[data-speed]').forEach(el => {
      const sp = parseFloat(el.dataset.speed) * (PHONE.matches ? .5 : 1);
      G.fromTo(el, { y: -sp * 160 }, { y: sp * 160, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // W5 作品圖片視差
    $$('#grid .card .im img').forEach(img => G.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('.card'), start: 'top bottom', end: 'bottom top', scrub: true } }));

    // C1 背景大圓
    G.fromTo('.big-circle', { scale: .45 }, { scale: 1.15, ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    // H6 捲動提示淡出
    G.to('.scroll-hint', { opacity: 0, ease: 'none', scrollTrigger: { start: 20, end: 120, scrub: true } });
  }

  // H5 跑馬燈
  function setupMarquee() {
    if (!hasG || RM) return;
    const track = $('#marquee');
    const tw = G.to(track, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
    tw.totalTime(3200);
    let dir = 1;
    if (ST) ST.create({
      trigger: '.hero', start: 'top top', end: 'bottom top',
      onUpdate: s => { dir = s.direction; const v = Math.abs(s.getVelocity()); G.to(tw, { timeScale: dir * clamp(1 + v / 500, 1, 4), duration: .2, overwrite: true, onComplete: () => G.to(tw, { timeScale: dir, duration: .5 }) }); },
      onToggle: s => s.isActive ? tw.resume() : tw.pause(),
    });
  }

  // H3 滑鼠視差
  function setupParallax() {
    if (!FINE || RM || !hasG) return;
    const layers = $$('#orbit .layer').map(l => ({ d: parseFloat(l.dataset.depth), x: G.quickTo(l, 'x', { duration: .6, ease: 'power3' }), y: G.quickTo(l, 'y', { duration: .6, ease: 'power3' }) }));
    addEventListener('pointermove', e => {
      if (scrollY > innerHeight) return;
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      layers.forEach(l => { l.x(nx * 48 * l.d); l.y(ny * 48 * l.d); });
    }, { passive: true });
  }

  // 畫面外暫停 CSS 循環；分頁背景時暫停全部
  function setupPausing() {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-off', !e.isIntersecting)), { rootMargin: '100px' });
      $$('main > section').forEach(s => io.observe(s));
    }
    document.addEventListener('visibilitychange', () => { if (!hasG) return; document.hidden ? G.globalTimeline.pause() : G.globalTimeline.resume(); });
  }

  /* =======================================================================
     開場（G1 → H1）
     ======================================================================= */
  function splitChars(el) {
    $$('.line', el).forEach(line => { line.innerHTML = [...line.textContent].map(ch => `<span class="ch">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join(''); });
    return $$('.ch', el);
  }
  function intro() {
    const loader = $('.loader');
    let seen = false; try { seen = sessionStorage.getItem('bp-intro') === '1'; sessionStorage.setItem('bp-intro', '1'); } catch (e) {}
    if (!hasG || RM) { loader.hidden = true; return Promise.resolve(); }
    const chars = splitChars($('.hero h1'));
    const orbitBits = $$('#orbit .orbit i');
    G.set(chars, { yPercent: 115, rotate: 8 });
    G.set(['.hero .status', '.hero .name', '.hero .tagline', '.hero .cta > *', '.scroll-hint'], { y: 20, opacity: 0 });
    G.set('#orbit .avatar', { scale: 0 }); G.set(orbitBits, { scale: 0 }); G.set('.ring-text', { opacity: 0 });
    G.set('.marquee', { yPercent: 120, opacity: 0 }); G.set('#nav', { yPercent: -160 });
    G.set('.hero .deco i', { scale: 0 });
    const tl = G.timeline({ defaults: { ease: 'expo.out' } });
    let t0 = 0;
    if (!seen) {
      const dots = $$('.loader .dots i'), cover = $('.loader .cover');
      G.set(dots, { scale: 0 });
      tl.to(dots, { scale: 1, duration: .45, ease: 'back.out(2)', stagger: .06 })
        .to(dots, { x: i => (2.5 - i) * 36, duration: .35, ease: 'power3.inOut' }, .45)
        .to(dots, { scale: 0, duration: .2, ease: 'power2.in' }, .72)
        .to(cover, { scale: 1.8, duration: .14, ease: 'power2.out' }, .7)
        .to(cover, { scale: () => Math.hypot(innerWidth, innerHeight) / 20, duration: .5, ease: 'power3.inOut' }, .8)
        .to(loader, { opacity: 0, duration: .3, ease: 'power1.out', onComplete: () => { loader.hidden = true; } }, 1.05);
      t0 = 1;
    } else { loader.hidden = true; }
    tl.to('.hero .deco i', { scale: 1, duration: .9, ease: 'back.out(1.6)', stagger: .08 }, t0)
      .to(chars, { yPercent: 0, rotate: 0, duration: .85, ease: 'back.out(1.7)', stagger: .03 }, t0)
      .to('#orbit .avatar', { scale: 1, duration: .8, ease: 'back.out(1.6)' }, t0 + .1)
      .to(orbitBits, { scale: 1, duration: .5, ease: 'back.out(3)', stagger: .07 }, t0 + .4)
      .to('.ring-text', { opacity: 1, duration: .6 }, t0 + .4)
      .to(['.hero .status', '.hero .name', '.hero .tagline', '.hero .cta > *', '.scroll-hint'], { y: 0, opacity: 1, duration: .6, stagger: .07, clearProps: 'transform' }, t0 + .5)
      .to('#nav', { yPercent: 0, duration: .5, ease: 'back.out(1.4)' }, t0 + .7)
      .to('.marquee', { yPercent: 0, opacity: 1, duration: .7 }, t0 + .8);
    return new Promise(res => tl.eventCallback('onComplete', res));
  }

  /* =======================================================================
     Init
     ======================================================================= */
  renderNav(); renderMarquee(); renderAbout(); renderDomains(); renderTimeline(); renderSkills(); renderExpertise(); renderWorks(); renderContact();
  applyTexts();
  bindTimeline(); bindExpertise(); bindWorks();
  setupCursor(); bindMagnets(); setupDraggables(); setupBubbles(); setupAbout(); setupScroll(); setupMarquee(); setupParallax(); setupPausing();
  addEventListener('resize', () => { moveFilterKnob(true); moveNavPill(activeSection, true); }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { moveFilterKnob(true); moveNavPill(activeSection, true); if (ST) ST.refresh(); });
  window.addEventListener('beforeprint', () => { $$('.tl-body').forEach(b => b.style.height = 'auto'); });

  intro().then(() => {
    if (/^#work\//.test(location.hash)) routeFromHash(false);
    // 首屏完成後預載作品封面（列印／快速捲動時不會空白）
    const warm = () => $$('#grid img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
    'requestIdleCallback' in window ? requestIdleCallback(warm, { timeout: 3000 }) : setTimeout(warm, 1500);
  });
  if (/^#work\//.test(location.hash) && (!hasG || RM)) routeFromHash(false);
})();
