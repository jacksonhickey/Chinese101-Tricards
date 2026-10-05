/* Tricards app shell: deck building, navigation, settings, keyboard. */
(function () {
  'use strict';
  const { esc } = TC.util;
  const { Settings, Progress, Speech, icon } = TC;

  const TYPES = [
    { key: 'characters', label: 'Characters', single: 'character' },
    { key: 'phrases', label: 'Phrases', single: 'phrase' },
    { key: 'conversations', label: 'Conversations', single: 'conversation' },
  ];
  const VIEWS = [
    { key: 'learn', label: 'Flashcards', icon: 'layers' },
    { key: 'browse', label: 'View all', icon: 'grid' },
    { key: 'match', label: 'Match', icon: 'zap' },
    { key: 'quiz', label: 'Quiz', icon: 'help' },
    { key: 'write', label: 'Write', icon: 'pencil' },
  ];

  /* ------------------------------------------------------------------ */
  /* Data normalization                                                 */
  /* ------------------------------------------------------------------ */
  function normalizeUnits() {
    const raw = Array.isArray(window.TRICARDS_UNITS) ? window.TRICARDS_UNITS : [];
    return raw.map((u, i) => ({
      id: String(u.id || 'unit-' + (i + 1)),
      name: u.name || 'Unit ' + (i + 1),
      description: u.description || '',
      characters: Array.isArray(u.characters) ? u.characters : [],
      phrases: Array.isArray(u.phrases) ? u.phrases : [],
      conversations: Array.isArray(u.conversations) ? u.conversations : [],
    }));
  }

  function toEntry(item) {
    if (Array.isArray(item)) return { hanzi: item[0], pinyin: item[1], english: item[2], notes: item[3] };
    return item || {};
  }

  function makeCard(item, unit, typeKey, index) {
    if (typeKey === 'conversations') {
      const lines = (item.lines || []).map((l) => {
        if (Array.isArray(l)) return { speaker: l[0] || '', hanzi: l[1] || '', pinyin: l[2] || '', english: l[3] || '' };
        return { speaker: l.speaker || '', hanzi: l.hanzi || '', pinyin: l.pinyin || '', english: l.english || '' };
      });
      const key = item.id || item.title || lines.map((l) => l.hanzi).join('') || 'conv-' + index;
      return {
        id: `${unit.id}/conv/${key}`,
        type: 'conversation',
        unitId: unit.id,
        unitName: unit.name,
        title: item.title || '',
        notes: item.notes || '',
        lines,
        hanzi: lines.map((l) => l.hanzi).join(' '),
        pinyin: lines.map((l) => l.pinyin).join(' '),
        english: lines.map((l) => l.english).join(' '),
      };
    }
    const e = toEntry(item);
    const short = typeKey === 'characters' ? 'char' : 'phrase';
    return {
      id: `${unit.id}/${short}/${e.id || e.hanzi || index}`,
      type: short === 'char' ? 'character' : 'phrase',
      unitId: unit.id,
      unitName: unit.name,
      hanzi: String(e.hanzi || ''),
      pinyin: String(e.pinyin || ''),
      english: String(e.english || ''),
      notes: e.notes ? String(e.notes) : '',
    };
  }

  // Flatten conversations into individual lines (for games); others pass through.
  function toItems(deck) {
    const out = [];
    deck.forEach((c) => {
      if (!c.lines) return out.push(c);
      c.lines.forEach((l, i) => {
        if (!l.hanzi && !l.pinyin) return;
        out.push({
          id: `${c.id}#${i}`,
          type: 'line',
          unitId: c.unitId,
          unitName: c.unitName,
          hanzi: l.hanzi,
          pinyin: l.pinyin,
          english: l.english,
          notes: c.title ? `From “${c.title}”` : '',
        });
      });
    });
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */
  const units = normalizeUnits();
  let currentView = null;
  let ctx = null;

  function selectedUnits() {
    const sel = (Settings.get('units') || []).filter((id) => units.some((u) => u.id === id));
    return sel.length ? units.filter((u) => sel.includes(u.id)) : units;
  }

  function rawDeck(typeKey) {
    const cards = [];
    selectedUnits().forEach((u) => u[typeKey].forEach((item, i) => cards.push(makeCard(item, u, typeKey, i))));
    // De-duplicate ids (e.g. the same character listed twice in one unit).
    const seen = new Set();
    return cards.filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)));
  }

  function applyFilter(cards) {
    const f = Settings.get('filter');
    if (f === 'starred') {
      return cards.filter((c) => Progress.isStarred(c.id) || (c.lines && c.lines.some((_, i) => Progress.isStarred(`${c.id}#${i}`))));
    }
    if (f === 'needs') {
      return cards.filter((c) => Progress.needsWork(c.id) || (c.lines && c.lines.some((_, i) => Progress.needsWork(`${c.id}#${i}`))));
    }
    return cards;
  }

  function buildContext() {
    const typeKey = Settings.get('type');
    const all = rawDeck(typeKey);
    const deck = applyFilter(all);
    const type = TYPES.find((t) => t.key === typeKey) || TYPES[0];
    const sel = Settings.get('units') || [];
    return {
      deck,
      items: toItems(deck),
      allCount: all.length,
      type,
      units: selectedUnits(),
      filter: Settings.get('filter'),
      deckKey: `${typeKey}|${sel.slice().sort().join(',') || 'all'}|${Settings.get('filter')}`,
      emptyHtml: emptyHtml(all.length, type),
      switchView,
      refresh: remount,
    };
  }

  function emptyHtml(allCount, type) {
    const f = Settings.get('filter');
    if (!units.length) {
      return TC.emptyState('No units yet', 'Add units to <code>js/data.js</code> to get started.');
    }
    if (allCount && f === 'starred') {
      return TC.emptyState('No starred cards', `Tap the ${icon('star')} on a card to star it, then come back here to study just those.`);
    }
    if (allCount && f === 'needs') {
      return TC.emptyState('Nothing needs work', 'Cards you miss in flashcards, quizzes, and writing show up here. Nice job!');
    }
    const su = selectedUnits();
    const who = su.length === units.length && units.length > 1
      ? 'None of the units have'
      : su.length === 1 ? `${esc(su[0].name)} doesn't have` : `${su.map((u) => esc(u.name)).join(', ')} don't have`;
    return TC.emptyState(
      `No ${type.label.toLowerCase()} yet`,
      `${who} any ${type.label.toLowerCase()} yet. They'll show up here once they're added to <code>js/data.js</code>.`
    );
  }

  /* ------------------------------------------------------------------ */
  /* Rendering: deck bar + tabs                                         */
  /* ------------------------------------------------------------------ */
  function countFor(unitList, typeKey) {
    return unitList.reduce((n, u) => n + u[typeKey].length, 0);
  }

  function renderDeckBar() {
    const sel = Settings.get('units') || [];
    const typeKey = Settings.get('type');
    const chips = document.getElementById('unit-chips');
    chips.innerHTML =
      `<button type="button" class="chip ${sel.length ? '' : 'on'}" data-unit="">All units</button>` +
      units
        .map((u) => {
          const n = u[typeKey].length;
          return `<button type="button" class="chip ${sel.includes(u.id) ? 'on' : ''}" data-unit="${esc(u.id)}" title="${esc(u.description || u.name)}">${esc(u.name)}<span class="chip-count">${n}</span></button>`;
        })
        .join('');

    const tabs = document.getElementById('type-tabs');
    const su = selectedUnits();
    tabs.innerHTML = TYPES.map(
      (t) => `<button type="button" role="tab" data-type="${t.key}" class="${t.key === typeKey ? 'on' : ''}" aria-selected="${t.key === typeKey}">${t.label}<span class="tab-count">${countFor(su, t.key)}</span></button>`
    ).join('');

    document.getElementById('filter-select').value = Settings.get('filter');
    const c = ctx || buildContext();
    const n = c.deck.length;
    document.getElementById('deck-count').textContent = `${n} ${n === 1 ? c.type.single : c.type.single + 's'}`;
  }

  function renderViewTabs() {
    const nav = document.getElementById('activity-tabs');
    const cur = Settings.get('view');
    nav.innerHTML = VIEWS.map(
      (v) => `<button type="button" data-view="${v.key}" class="${v.key === cur ? 'on' : ''}">${icon(v.icon)}<span>${v.label}</span></button>`
    ).join('');
  }

  function remount() {
    if (currentView && currentView.unmount) currentView.unmount();
    Speech.stop();
    ctx = buildContext();
    renderDeckBar();
    renderViewTabs();
    const key = VIEWS.some((v) => v.key === Settings.get('view')) ? Settings.get('view') : 'learn';
    currentView = TC.views[key];
    const root = document.getElementById('view');
    root.innerHTML = '';
    root.className = 'view view-' + key;
    if (currentView) currentView.mount(root, ctx);
  }

  function switchView(key) {
    Settings.set('view', key);
    remount();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ------------------------------------------------------------------ */
  /* Theme + font                                                       */
  /* ------------------------------------------------------------------ */
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function effectiveTheme() {
    const t = Settings.get('theme');
    if (t === 'light' || t === 'dark') return t;
    return mq && mq.matches ? 'dark' : 'light';
  }
  function applyAppearance() {
    const root = document.documentElement;
    const theme = effectiveTheme();
    root.dataset.theme = theme;
    root.dataset.font = Settings.get('hanziFont');
    const btn = document.getElementById('theme-btn');
    if (btn) {
      btn.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
      btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }
  if (mq && mq.addEventListener) mq.addEventListener('change', applyAppearance);

  /* ------------------------------------------------------------------ */
  /* Settings modal                                                     */
  /* ------------------------------------------------------------------ */
  let settingsDirty = false;

  function sideOrderHtml() {
    const order = Settings.get('sideOrder');
    return order
      .map(
        (s, i) => `
        <li>
          <span class="order-num">${i === 0 ? 'Front' : i === 1 ? '2nd' : '3rd'}</span>
          <span class="order-name">${TC.SIDE_LABEL[s]}</span>
          <span class="order-btns">
            <button type="button" class="icon-btn" data-move="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${icon('up')}</button>
            <button type="button" class="icon-btn" data-move="${i}" data-dir="1" ${i === 2 ? 'disabled' : ''} aria-label="Move down">${icon('down')}</button>
          </span>
        </li>`
      )
      .join('');
  }

  function voiceOptionsHtml() {
    const zh = Speech.zhVoices();
    if (!Speech.supported) return '<option value="">Audio not supported in this browser</option>';
    if (!zh.length) return '<option value="">Default Chinese voice</option>';
    const cur = Speech.pickVoice();
    return zh
      .map((v) => `<option value="${esc(v.voiceURI)}" ${cur && cur.voiceURI === v.voiceURI ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`)
      .join('');
  }

  function renderSettings() {
    const body = document.getElementById('settings-body');
    const s = Settings.data;
    body.innerHTML = `
      <section class="set-section">
        <h3>Card order</h3>
        <p class="muted">Which side you see first, and the order you flip through.</p>
        <ol class="order-list" id="order-list">${sideOrderHtml()}</ol>
        <div class="preset-row">
          <span class="muted">Quick:</span>
          <button type="button" class="btn small ghost" data-preset="hanzi,pinyin,english">Characters first</button>
          <button type="button" class="btn small ghost" data-preset="pinyin,hanzi,english">Pinyin first</button>
          <button type="button" class="btn small ghost" data-preset="english,hanzi,pinyin">Definition first</button>
        </div>
      </section>

      <section class="set-section">
        <h3>Pronunciation</h3>
        <label class="field">
          <span>Speed <b id="rate-val">${s.rate.toFixed(2)}×</b></span>
          <input type="range" id="rate" min="0.3" max="1.2" step="0.05" value="${s.rate}">
        </label>
        <label class="field">
          <span>Audio source</span>
          <select id="source-select">
            <option value="auto" ${s.audioSource === 'auto' ? 'selected' : ''}>Automatic</option>
            <option value="system" ${s.audioSource === 'system' ? 'selected' : ''}>This device’s voice</option>
            <option value="online" ${s.audioSource === 'online' ? 'selected' : ''}>Online voice</option>
          </select>
        </label>
        <label class="field" id="voice-field">
          <span>Device voice</span>
          <select id="voice-select">${voiceOptionsHtml()}</select>
        </label>
        <p class="muted small" id="audio-status">${esc(Speech.statusText())}</p>
        <div class="row">
          <button type="button" class="btn small" id="test-voice">${icon('volume')} Test: 你好，我是学生。</button>
        </div>
        <label class="check"><input type="checkbox" id="autoplay" ${s.autoplay ? 'checked' : ''}> Auto-play audio when the pinyin side appears</label>
      </section>

      <section class="set-section">
        <h3>Display</h3>
        <label class="field">
          <span>Theme</span>
          <select id="theme-select">
            <option value="auto" ${s.theme === 'auto' ? 'selected' : ''}>Match system</option>
            <option value="light" ${s.theme === 'light' ? 'selected' : ''}>Light</option>
            <option value="dark" ${s.theme === 'dark' ? 'selected' : ''}>Dark</option>
          </select>
        </label>
        <label class="field">
          <span>Character style</span>
          <select id="font-select">
            <option value="sans" ${s.hanziFont === 'sans' ? 'selected' : ''}>Sans (黑体)</option>
            <option value="serif" ${s.hanziFont === 'serif' ? 'selected' : ''}>Serif (宋体)</option>
            <option value="kai" ${s.hanziFont === 'kai' ? 'selected' : ''}>Handwritten (楷体)</option>
          </select>
        </label>
        <label class="check"><input type="checkbox" id="tone-colors" ${s.toneColors ? 'checked' : ''}> Color pinyin by tone</label>
        <label class="check"><input type="checkbox" id="tone-hanzi" ${s.toneColorHanzi ? 'checked' : ''}> Color characters by tone too</label>
        <div class="tone-legend">
          <span class="t1">1 mā</span><span class="t2">2 má</span><span class="t3">3 mǎ</span><span class="t4">4 mà</span><span class="t5">neutral ma</span>
        </div>
      </section>

      <section class="set-section">
        <h3>Studying</h3>
        <label class="check"><input type="checkbox" id="shuffle" ${s.shuffle ? 'checked' : ''}> Shuffle flashcards</label>
        <div class="row">
          <button type="button" class="btn small danger" id="reset-progress">Reset all progress &amp; stars</button>
        </div>
      </section>

      <section class="set-section">
        <h3>Keyboard shortcuts</h3>
        <table class="keys">
          <tr><td><kbd>Space</kbd></td><td>Flip card</td></tr>
          <tr><td><kbd>→</kbd> / <kbd>←</kbd></td><td>Know it / Still learning</td></tr>
          <tr><td><kbd>Z</kbd></td><td>Undo last card</td></tr>
          <tr><td><kbd>S</kbd></td><td>Play pronunciation</td></tr>
          <tr><td><kbd>1</kbd>–<kbd>4</kbd></td><td>Choose a quiz answer</td></tr>
          <tr><td><kbd>Enter</kbd></td><td>Submit / next</td></tr>
        </table>
      </section>`;
  }

  function openSettings() {
    settingsDirty = false;
    renderSettings();
    updateAudioStatus();
    const m = document.getElementById('settings-modal');
    m.hidden = false;
    document.body.classList.add('modal-open');
    m.querySelector('.modal-close').focus();
  }

  function closeSettings() {
    const m = document.getElementById('settings-modal');
    if (m.hidden) return;
    m.hidden = true;
    document.body.classList.remove('modal-open');
    if (settingsDirty) remount();
  }

  function bindSettings() {
    const m = document.getElementById('settings-modal');
    m.addEventListener('click', (e) => {
      if (e.target === m || e.target.closest('.modal-close')) return closeSettings();
      const mv = e.target.closest('[data-move]');
      if (mv) {
        const i = +mv.dataset.move;
        const j = i + +mv.dataset.dir;
        const order = Settings.get('sideOrder').slice();
        if (j < 0 || j > 2) return;
        [order[i], order[j]] = [order[j], order[i]];
        Settings.set('sideOrder', order);
        settingsDirty = true;
        document.getElementById('order-list').innerHTML = sideOrderHtml();
        return;
      }
      const pr = e.target.closest('[data-preset]');
      if (pr) {
        Settings.set('sideOrder', pr.dataset.preset.split(','));
        settingsDirty = true;
        document.getElementById('order-list').innerHTML = sideOrderHtml();
        return;
      }
      if (e.target.closest('#test-voice')) return Speech.speak('你好，我是学生。');
      if (e.target.closest('#reset-progress')) {
        if (window.confirm('Reset all progress, stats, stars, and best times? This can’t be undone.')) {
          const keep = Object.assign({}, Settings.data);
          TC.Store.clearAll();
          TC.Store.set('settings', keep);
          Progress.reset();
          settingsDirty = true;
          TC.toast('Progress reset.');
        }
      }
    });
    m.addEventListener('input', (e) => {
      if (e.target.id === 'rate') {
        Settings.set('rate', +e.target.value);
        document.getElementById('rate-val').textContent = (+e.target.value).toFixed(2) + '×';
      }
    });
    m.addEventListener('change', (e) => {
      const t = e.target;
      if (t.id === 'voice-select' || t.id === 'source-select') {
        Settings.set(t.id === 'voice-select' ? 'voiceURI' : 'audioSource', t.value);
        updateAudioStatus();
      }
      else if (t.id === 'autoplay') Settings.set('autoplay', t.checked);
      else if (t.id === 'theme-select') { Settings.set('theme', t.value); applyAppearance(); }
      else if (t.id === 'font-select') { Settings.set('hanziFont', t.value); applyAppearance(); }
      else if (t.id === 'tone-colors') { Settings.set('toneColors', t.checked); settingsDirty = true; }
      else if (t.id === 'tone-hanzi') { Settings.set('toneColorHanzi', t.checked); settingsDirty = true; }
      else if (t.id === 'shuffle') { Settings.set('shuffle', t.checked); }
    });
    Speech.onVoices(() => {
      const sel = document.getElementById('voice-select');
      if (sel) sel.innerHTML = voiceOptionsHtml();
      updateAudioStatus();
    });
  }

  function updateAudioStatus() {
    const st = document.getElementById('audio-status');
    if (st) st.textContent = Speech.statusText();
    const vf = document.getElementById('voice-field');
    if (vf) vf.hidden = Settings.get('audioSource') === 'online' || !Speech.zhVoices().length;
  }

  /* ------------------------------------------------------------------ */
  /* Events                                                             */
  /* ------------------------------------------------------------------ */
  function bindShell() {
    document.getElementById('unit-chips').addEventListener('click', (e) => {
      const chip = e.target.closest('[data-unit]');
      if (!chip) return;
      const id = chip.dataset.unit;
      let sel = (Settings.get('units') || []).slice();
      if (!id) sel = [];
      else if (sel.includes(id)) sel = sel.filter((x) => x !== id);
      else sel.push(id);
      if (sel.length === units.length) sel = [];
      Settings.set('units', sel);
      remount();
    });
    document.getElementById('type-tabs').addEventListener('click', (e) => {
      const b = e.target.closest('[data-type]');
      if (!b) return;
      Settings.set('type', b.dataset.type);
      remount();
    });
    document.getElementById('filter-select').addEventListener('change', (e) => {
      Settings.set('filter', e.target.value);
      remount();
    });
    document.getElementById('activity-tabs').addEventListener('click', (e) => {
      const b = e.target.closest('[data-view]');
      if (b) switchView(b.dataset.view);
    });
    document.getElementById('settings-btn').addEventListener('click', openSettings);
    document.getElementById('theme-btn').addEventListener('click', () => {
      Settings.set('theme', effectiveTheme() === 'dark' ? 'light' : 'dark');
      applyAppearance();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') return closeSettings();
      if (!document.getElementById('settings-modal').hidden) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
      if (currentView && currentView.onKey) currentView.onKey(e, typing);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                               */
  /* ------------------------------------------------------------------ */
  function boot() {
    applyAppearance();
    Speech.init();
    bindShell();
    bindSettings();
    remount();
  }

  TC.app = { switchView, remount, toItems, buildContext };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
