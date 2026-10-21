/* =========================================================
   Case File: NURA — game logic
   ========================================================= */
(() => {
  'use strict';

  const W = 1512, H = 892;
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const stage = $('#stage');

  // ---------- State ----------
  let S;
  function freshState() {
    return {
      phase: 'before',      // 'before' -> after the wrapper is found -> 'after'
      flags: {},
      scene: null,
      visited: {},
      asked: {},            // "char:topic:option" or "...:f" for follow-ups
      talkLog: {},          // conversation history per character
      seenGreeting: {},
    };
  }
  const has = (f) => !!S.flags[f];
  const setFlag = (f) => { if (!f) return; [].concat(f).forEach((x) => (S.flags[x] = true)); };

  // ---------- Fit stage to screen ----------
  function fit() {
    const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const s = Math.min(vw / W, vh / H);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
    const portrait = vh > vw * 1.05;
    $('#rotate').classList.toggle('hidden', !portrait || rotateDismissed);
  }
  let rotateDismissed = false;
  $('#rotate-dismiss').addEventListener('click', () => { rotateDismissed = true; fit(); });
  window.addEventListener('resize', fit);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
  window.addEventListener('orientationchange', () => setTimeout(fit, 200));

  // ---------- Preload ----------
  function collectAssets() {
    const list = new Set();
    Object.values(SCENES).forEach((s) => list.add(s.img));
    Object.values(ITEMS).forEach((i) => i.imgs.forEach((m) => list.add(m.src)));
    Object.values(CHARACTERS).forEach((c) => { if (c.sprite) list.add(c.sprite); if (c.sceneOverride) list.add(c.sceneOverride); });
    ['book_first.webp', 'book_mid.webp', 'book_last.webp', 'panel_light.png', 'panel_dark.png',
     'btn_default.png', 'btn_pressed.png', 'btn_asked.png', 'hint_light.png', 'hint_dark.png', 'close_light.png', 'close_dark.png',
     'arrow_r_light.png', 'arrow_r_dark.png', 'arrow_l_light.png', 'arrow_l_dark.png', 'tick_dim.png', 'tick_dark.png']
      .forEach((f) => list.add('assets/ui/' + f));
    return [...list];
  }
  function preload() {
    const items = collectAssets();
    let done = 0;
    const pct = $('#load-pct');
    const fontReady = document.fonts ? document.fonts.load('32px "Jersey 10"').catch(() => {}) : Promise.resolve();
    const imgs = items.map((src) => new Promise((res) => {
      const im = new Image();
      im.onload = im.onerror = () => { done++; pct.textContent = Math.round((done / items.length) * 100) + '%'; res(); };
      im.src = src;
    }));
    return Promise.all([fontReady, ...imgs]);
  }

  // ---------- Scene routing ----------
  // 'john' and 'living' resolve to a version depending on story progress.
  function resolveScene(to) {
    if (to === 'john') return S.phase === 'before' ? 'john_before' : 'john_after';
    if (to === 'living') return (S.phase === 'after' && S.visited.john_after) ? 'living_grandma' : 'living_empty';
    return to;
  }

  function goTo(to) {
    // story gates
    if (to === 'parents') {
      if (S.phase === 'before') return note("The door's shut. I should take a proper look around first.");
      if (!S.visited.john_after) return note('I should check on John first.');
    }
    const id = resolveScene(to);
    S.scene = id;
    const firstVisit = !S.visited[id];
    S.visited[id] = true;
    renderScene();
    if (firstVisit) setTimeout(() => flashHotspots(1800), 350);
    if (id === 'john_after' && firstVisit) setTimeout(() => note("John's home. And his room... looks completely different."), 500);
    if (id === 'living_grandma' && firstVisit) setTimeout(() => note('Grandma is back from picking John up.'), 500);
    if (id === 'parents' && firstVisit) setTimeout(() => note('Dad is home, but on a call. He waves me in without looking up.'), 500);
  }

  function placeImg(img, rect) {
    const [x, y, w, h] = rect;
    Object.assign(img.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
  }

  function renderScene() {
    const sc = SCENES[S.scene];
    const bg = $('#scene-bg');
    bg.src = sc.img; placeImg(bg, sc.bg);
    document.getElementById('backdrop').style.backgroundImage = `url(${sc.img})`;

    const month = S.phase === 'before' ? 'April' : 'June';
    $('#loc-tag').textContent = `${sc.label} · ${month}`;

    const wrap = $('#hotspots');
    wrap.innerHTML = '';
    sc.hotspots.forEach((h) => {
      const b = el('button', 'hotspot' + (h.hidden ? ' secret' : ''));
      const [x, y, w, hh] = h.rect;
      Object.assign(b.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px' });
      b.setAttribute('aria-label', h.name);
      b.appendChild(el('span', 'hs-label', esc(h.name)));
      if (h.hidden && has('BOX_HINT')) b.classList.add('hinted', 'sparkle');
      if (h.action.type === 'talk') b.classList.add('person');
      b.addEventListener('click', () => doAction(h.action));
      wrap.appendChild(b);
    });

    const ex = $('#exits');
    ex.innerHTML = '';
    (sc.exits || []).forEach((e) => {
      const b = el('button', 'tag ' + e.side);
      b.innerHTML = e.side === 'left'
        ? `<span class="ico ico-arrow-l"></span><span>${esc(e.label)}</span>`
        : `<span>${esc(e.label)}</span><span class="ico ico-arrow-r"></span>`;
      b.addEventListener('click', () => goTo(e.to));
      ex.appendChild(b);
    });
  }

  let flashTimer;
  function flashHotspots(ms = 2400) {
    const wrap = $('#hotspots');
    wrap.classList.add('reveal');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => wrap.classList.remove('reveal'), ms);
  }
  $('#hint-btn').addEventListener('click', () => flashHotspots());

  function doAction(a) {
    hideToast();
    switch (a.type) {
      case 'go': return goTo(a.to);
      case 'note': return note(a.text);
      case 'popup': return openPopup(a.id);
      case 'diary': return openDiary(a.id);
      case 'talk': return openTalk(a.id);
    }
  }

  // ---------- Toast ----------
  let toastTimer;
  function note(text) {
    const t = $('#toast');
    t.textContent = text;
    t.classList.remove('hidden');
    t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, Math.max(3200, text.length * 55));
  }
  function hideToast() { clearTimeout(toastTimer); $('#toast').classList.add('hidden'); }
  $('#toast').addEventListener('click', hideToast);

  // ---------- Item popup ----------
  let popupClose = null;
  function openPopup(id) {
    const it = ITEMS[id];
    const p = $('#popup');
    $('.popup-title', p).textContent = it.title;
    $('.popup-body', p).textContent = it.body;
    const box = $('.popup-imgs', p);
    box.innerHTML = '';
    it.imgs.forEach((m) => {
      const im = el('img');
      im.src = m.src; im.alt = '';
      im.style.width = m.w + 'px';
      im.style.transform = `translate(calc(-50% + ${m.x || 0}px), calc(-50% + ${m.y || 0}px)) rotate(${m.rot || 0}deg)`;
      box.appendChild(im);
    });
    setFlag(it.flag);
    p.classList.remove('hidden');
    popupClose = () => {
      p.classList.add('hidden');
      // Finding the wrapper for the first time moves the story forward.
      if (id === 'wrapper' && S.phase === 'before') timeSkip();
      else if (id === 'nura_box') {
        renderScene();
        setTimeout(() => note('I should ask the family about this.'), 250);
      }
    };
  }
  $('#popup').addEventListener('click', () => popupClose && popupClose());

  // ---------- Diary ----------
  let diary = null;
  function openDiary(id) {
    diary = { pages: DIARIES[id], i: 0 };
    $('#diary').classList.remove('hidden');
    renderDiary();
  }
  function renderDiary() {
    const d = $('#diary');
    const n = diary.pages.length, i = diary.i;
    const book = n === 1 ? 'book_mid' : i === 0 ? 'book_first' : i === n - 1 ? 'book_last' : 'book_mid';
    $('.book', d).src = `assets/ui/${book}.webp`;
    const [L, R] = diary.pages[i];
    const fill = (node, lines) => {
      node.innerHTML = (lines || []).map((t) => t.startsWith('# ')
        ? `<p class="date">${esc(t.slice(2))}</p>` : `<p>${esc(t)}</p>`).join('');
    };
    fill($('.page.left', d), L);
    fill($('.page.right', d), R);
    $('.pg', d).textContent = `${i + 1} / ${n}   ·   tap a page to turn`;
  }
  $('#diary .page-tap.right').addEventListener('click', () => {
    if (diary.i < diary.pages.length - 1) { diary.i++; renderDiary(); } else closeDiary();
  });
  $('#diary .page-tap.left').addEventListener('click', () => {
    if (diary.i > 0) { diary.i--; renderDiary(); }
  });
  $('#diary .diary-close').addEventListener('click', closeDiary);
  $('#diary .dim').addEventListener('click', closeDiary);
  function closeDiary() { $('#diary').classList.add('hidden'); diary = null; }

  // ---------- Conversation ----------
  let T = null; // current talk session
  const talkEl = $('#talk');
  const logEl = $('.log-inner', talkEl);
  const choicesEl = $('.talk-choices', talkEl);

  function openTalk(id) {
    const c = CHARACTERS[id];
    T = { id, c, topic: null, queue: [], typing: null, after: null };
    const sc = SCENES[S.scene];
    const bg = $('.talk-bg', talkEl);
    bg.src = c.sceneOverride || sc.img;
    placeImg(bg, c.sceneOverride ? SCENES.living_empty.bg : sc.bg);
    const sp = $('.talk-sprite', talkEl);
    if (c.sprite) { sp.src = c.sprite; sp.classList.remove('hidden'); } else sp.classList.add('hidden');

    talkEl.classList.remove('hidden');
    logEl.innerHTML = '';
    (S.talkLog[id] || []).forEach((l) => addLine(l.kind, l.text, false));
    logEl.scrollTop = logEl.scrollHeight;

    if (!S.seenGreeting[id]) {
      S.seenGreeting[id] = true;
      say(c.greet, showTopics);
    } else {
      showTopics();
    }
  }

  function closeTalk() {
    // Talking to someone unlocks "Ask about their comments" on the other adult.
    if (T.id === 'grandma') setFlag('TALKED_GRANDMA');
    if (T.id === 'dad') setFlag('TALKED_DAD');
    talkEl.classList.add('hidden');
    T = null;
    renderScene();
  }

  function lineKind(t) { return /^\(.*\)$/.test(t.trim()) ? 'act' : 'a'; }
  function fmt(kind, t) { return /act|sys/.test(kind) ? t : `“${t}”`; }

  function addLine(kind, text, remember = true) {
    const p = el('p', 'log-line ' + kind);
    p.textContent = fmt(kind, text);
    logEl.appendChild(p);
    if (remember && T) (S.talkLog[T.id] = S.talkLog[T.id] || []).push({ kind, text });
    logEl.scrollTop = logEl.scrollHeight;
    return p;
  }

  // Player question, shown right-aligned.
  function ask(q) {
    const m = q.match(/^(\([^)]*\))\s*(.*)$/);
    if (m) { addLine('q act', m[1]); addLine('q', m[2]); } else addLine('q', q);
  }

  // Character lines, typed out one by one. Tap the box to skip.
  function say(lines, then) {
    choicesEl.innerHTML = '';
    T.queue = lines.slice();
    T.after = then;
    nextLine();
  }
  function nextLine() {
    if (!T) return;
    if (!T.queue.length) { $('.talk-log', talkEl).classList.remove('typing'); const f = T.after; T.after = null; if (f) f(); return; }
    const raw = T.queue.shift();
    const kind = lineKind(raw);
    const p = addLine(kind, raw);
    const full = p.textContent;
    p.textContent = '';
    $('.talk-log', talkEl).classList.add('typing');
    let i = 0;
    const speed = kind === 'act' ? 14 : 22; // ms per character
    T.typing = { p, full, timer: setInterval(() => {
      i += 1;
      p.textContent = full.slice(0, i);
      logEl.scrollTop = logEl.scrollHeight;
      if (i >= full.length) finishTyping(true);
    }, speed) };
  }
  function finishTyping(auto) {
    if (!T || !T.typing) return;
    clearInterval(T.typing.timer);
    T.typing.p.textContent = T.typing.full;
    T.typing = null;
    logEl.scrollTop = logEl.scrollHeight;
    setTimeout(nextLine, auto ? 260 : 60);
  }
  $('.talk-log', talkEl).addEventListener('click', () => { if (T && T.typing) finishTyping(false); });

  function choiceBtn(label, { asked = false, icon = 'arrow-r', cls = '' } = {}, onClick) {
    const b = el('button', 'choice ' + cls + (asked ? ' asked' : ''));
    const ico = asked ? 'tick' : icon;
    b.innerHTML = icon === 'arrow-l'
      ? `<span class="ico ico-arrow-l"></span><span class="lbl">${esc(label)}</span>`
      : `<span class="lbl">${esc(label)}</span><span class="ico ico-${ico}"></span>`;
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      b.classList.add('pressed');
      setTimeout(onClick, 90);
    });
    return b;
  }

  const visibleTopics = () => T.c.topics.filter((t) => !t.req || has(t.req));
  const visibleOptions = (topic) => topic.options.filter((o) => !o.req || has(o.req));
  const key = (topic, o, f) => `${T.id}:${topic.id}:${o.id}${f ? ':f' : ''}`;
  const optionDone = (topic, o) => S.asked[key(topic, o)] && (!o.follow || S.asked[key(topic, o, true)]);
  const topicDone = (topic) => visibleOptions(topic).every((o) => optionDone(topic, o));

  function showTopics() {
    T.topic = null;
    choicesEl.className = 'talk-choices';
    choicesEl.innerHTML = '';
    visibleTopics().forEach((t) => {
      choicesEl.appendChild(choiceBtn(t.label, { asked: topicDone(t) }, () => showOptions(t)));
    });
    const n = visibleTopics().length;
    choicesEl.appendChild(choiceBtn('Leave', { icon: 'arrow-l', cls: n % 2 === 0 ? 'wide' : '' }, closeTalk));
  }

  function showOptions(topic, pendingFollow) {
    T.topic = topic;
    choicesEl.className = 'talk-choices questions';
    choicesEl.innerHTML = '';
    if (pendingFollow) {
      const { o } = pendingFollow;
      choicesEl.appendChild(choiceBtn(o.follow.q, { asked: S.asked[key(topic, o, true)] }, () => askFollow(topic, o)));
    }
    visibleOptions(topic).forEach((o) => {
      if (pendingFollow && pendingFollow.o === o) return;
      const done = S.asked[key(topic, o)];
      // Re-asking an answered question offers its follow-up instead, if not yet asked.
      choicesEl.appendChild(choiceBtn(o.q, { asked: optionDone(topic, o) }, () => {
        if (done && o.follow && !S.asked[key(topic, o, true)]) return askFollow(topic, o);
        askOption(topic, o);
      }));
    });
    choicesEl.appendChild(choiceBtn('Back', { icon: 'arrow-l' }, showTopics));
  }

  function askOption(topic, o) {
    S.asked[key(topic, o)] = true;
    setFlag(o.flag);
    ask(o.q);
    say(o.a, () => {
      if (o.follow && !S.asked[key(topic, o, true)]) showOptions(topic, { o });
      else showOptions(topic);
    });
  }

  function askFollow(topic, o) {
    S.asked[key(topic, o, true)] = true;
    setFlag(o.follow.flag);
    ask(o.follow.q);
    if (o.follow.confess) {
      setFlag('CONFESSED');
      say(CONFESSION, () => {
        choicesEl.className = 'talk-choices single';
        choicesEl.innerHTML = '';
        choicesEl.appendChild(choiceBtn('Close the case', { cls: 'primary' }, () => { closeTalk(); ending(); }));
      });
      return;
    }
    say(o.follow.a, () => showOptions(topic));
  }

  // ---------- Cards ----------
  const card = $('#card');
  function showCard(html, onTap) {
    card.innerHTML = html;
    card.classList.remove('hidden');
    card.onclick = onTap || null;
  }
  function hideCard() { card.classList.add('hidden'); card.onclick = null; card.innerHTML = ''; }

  function titleCard() {
    showCard(`
      <img class="card-bg" src="assets/scenes/john_before.webp" alt="">
      <div class="file dark-panel">
        <div class="caseno">CHILD PROTECTION · CASE NO. 24346957</div>
        <h1>Case File: NURA</h1>
        <dl class="meta">
          <dt>Subject</dt><dd>John, aged 6</dd>
          <dt>Referred by</dt><dd>Grandmother, Preschool</dd>
          <dt>Opened</dt><dd>13 April 2066</dd>
        </dl>
        <p>John's grandmother says he has changed. He doesn't remember her games, and he talks about days out that never happened. Visit the home, look around, and find out who is responsible.</p>
        <button class="choice primary" id="start-btn"><span class="lbl" style="flex:none">Open the case</span><span class="ico ico-arrow-r"></span></button>
      </div>`);
    $('#start-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      hideCard();
      goTo('john');
      setTimeout(() => note('Tap things in the room to look closer. The magnifier shows what you can tap.'), 2300);
    });
  }

  function timeSkip() {
    S.phase = 'after';
    showCard(`
      <div class="skip">
        <div class="big">Six weeks later</div>
        <div class="small">JUNE 2066 · FOLLOW-UP VISIT</div>
        <div class="tap">Tap to continue</div>
      </div>`, () => {
      hideCard();
      S.scene = null;
      goTo('living');
      setTimeout(() => note('Something about this house feels different now.'), 400);
    });
  }

  function ending() {
    const items = FINDINGS.map((f) => `<li class="${has(f.flag) ? 'found' : 'missed'}"><span class="box"></span><span>${esc(f.text)}</span></li>`).join('');
    const found = FINDINGS.filter((f) => has(f.flag)).length;
    showCard(`
      <img class="card-bg" src="assets/scenes/john_after.webp" alt="">
      <div class="file end dark-panel">
        <div class="caseno">CASE NO. 24346957 \u00b7 CASE OUTCOME</div>
        <h2>Findings ${found} / ${FINDINGS.length}</h2>
        <ul class="findings">${items}</ul>
        <div>
          <div class="stamp">INCONCLUSIVE \u2014 MONITORING RECOMMENDED</div>
          <p>NURA use is confirmed, but there is no way to prove which of John's memories are real. The case stays open, with a review in 12 weeks.</p>
          <p class="epilogue">\u201cDaddy said we're going to the park this weekend! For real this time.\u201d \u2014 John</p>
          <button class="choice primary" id="again-btn"><span class="lbl" style="flex:none">Play again</span><span class="ico ico-arrow-r"></span></button>
        </div>
      </div>`);
    $('#again-btn').addEventListener('click', (e) => { e.stopPropagation(); start(); });
  }

  // ---------- Boot ----------
  function start() {
    S = freshState();
    hideToast();
    ['#popup', '#diary', '#talk'].forEach((s) => $(s).classList.add('hidden'));
    titleCard();
  }

  fit();
  preload().then(() => {
    $('#loading').classList.add('hidden');
    start();
  });

  // Debug helper for testing: window.NURA.go('parents') etc.
  window.NURA = { go: goTo, flags: () => S.flags, set: setFlag, state: () => S, talk: openTalk, end: ending };
})();
