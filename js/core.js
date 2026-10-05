/* Tricards core: utilities, storage, settings, pinyin, speech, card rendering. */
(function () {
  'use strict';
  const TC = (window.TC = window.TC || {});
  TC.views = TC.views || {};

  /* ------------------------------------------------------------------ */
  /* Utilities                                                          */
  /* ------------------------------------------------------------------ */
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]);

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function h(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function formatTime(ms) {
    const s = ms / 1000;
    if (s < 60) return s.toFixed(1) + 's';
    const m = Math.floor(s / 60);
    return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  }

  const reducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  TC.util = { esc, shuffle, h, formatTime, reducedMotion };

  /* ------------------------------------------------------------------ */
  /* Icons (Feather-style, MIT)                                         */
  /* ------------------------------------------------------------------ */
  const ICONS = {
    volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    undo: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
    shuffle: '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
    refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    up: '<polyline points="18 15 12 9 6 15"/>',
    down: '<polyline points="6 9 12 15 18 9"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    left: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
    right: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  };
  function icon(name, filled) {
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
  }
  TC.icon = icon;

  /* ------------------------------------------------------------------ */
  /* Storage                                                            */
  /* ------------------------------------------------------------------ */
  const PREFIX = 'tricards:v1:';
  const Store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(PREFIX + key);
        return v == null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set(key, val) {
      try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); } catch (e) { /* ignore */ }
    },
    remove(key) {
      try { localStorage.removeItem(PREFIX + key); } catch (e) { /* ignore */ }
    },
    clearAll() {
      try {
        Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k));
      } catch (e) { /* ignore */ }
    },
  };
  TC.Store = Store;

  /* ------------------------------------------------------------------ */
  /* Settings                                                           */
  /* ------------------------------------------------------------------ */
  const SIDES = ['hanzi', 'pinyin', 'english'];
  const SIDE_LABEL = { hanzi: 'Characters', pinyin: 'Pinyin', english: 'Definition', audio: 'Audio' };
  TC.SIDES = SIDES;
  TC.SIDE_LABEL = SIDE_LABEL;

  const DEFAULTS = {
    sideOrder: ['hanzi', 'pinyin', 'english'],
    rate: 0.6,
    voiceURI: '',
    audioSource: 'auto',
    autoplay: false,
    toneColors: true,
    toneColorHanzi: false,
    theme: 'auto',
    hanziFont: 'sans',
    shuffle: true,
    units: [],
    type: 'characters',
    filter: 'all',
    view: 'learn',
  };

  const Settings = {
    data: Object.assign({}, DEFAULTS, Store.get('settings', {})),
    listeners: [],
    get(k) { return this.data[k]; },
    set(k, v) {
      this.data[k] = v;
      Store.set('settings', this.data);
      this.listeners.forEach((fn) => fn(k, v));
    },
    on(fn) { this.listeners.push(fn); },
  };
  // Validate side order (must be a permutation of the three sides).
  (function () {
    const o = Settings.data.sideOrder;
    if (!Array.isArray(o) || o.length !== 3 || SIDES.some((s) => !o.includes(s))) {
      Settings.data.sideOrder = DEFAULTS.sideOrder.slice();
    }
  })();
  TC.Settings = Settings;

  /* ------------------------------------------------------------------ */
  /* Progress (stars + per-card stats)                                  */
  /* ------------------------------------------------------------------ */
  const Progress = {
    data: Object.assign({ stars: {}, stats: {} }, Store.get('progress', {})),
    save() { Store.set('progress', this.data); },
    isStarred(id) { return !!this.data.stars[id]; },
    toggleStar(id) {
      if (this.data.stars[id]) delete this.data.stars[id];
      else this.data.stars[id] = 1;
      this.save();
      return this.isStarred(id);
    },
    stat(id) { return this.data.stats[id] || { right: 0, wrong: 0 }; },
    record(id, correct) {
      const s = this.data.stats[id] || { right: 0, wrong: 0 };
      if (correct) s.right++;
      else s.wrong++;
      s.last = Date.now();
      this.data.stats[id] = s;
      this.save();
    },
    needsWork(id) {
      const s = this.stat(id);
      return s.wrong > 0 && s.right < s.wrong * 2;
    },
    reset() {
      this.data = { stars: {}, stats: {} };
      this.save();
    },
  };
  TC.Progress = Progress;

  /* ------------------------------------------------------------------ */
  /* Pinyin helpers                                                     */
  /* ------------------------------------------------------------------ */
  const MARK_FOR = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', 'ü': 'ǖǘǚǜ' };
  const TONE_MARKS = {};
  Object.keys(MARK_FOR).forEach((base) => {
    Array.from(MARK_FOR[base]).forEach((ch, i) => { TONE_MARKS[ch] = [base, i + 1]; });
  });
  const V = 'aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ';
  // A rough pinyin syllable matcher: optional initial, vowel cluster, optional final.
  // A final n/ng/r is only taken if it is not followed by a vowel (so dàngāo → dàn + gāo).
  const SYL_RE = new RegExp(
    `(?:zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?[${V}]+(?:ng(?![${V}])|n(?![${V}])|r(?![${V}]))?[1-5]?`,
    'giu'
  );
  const CJK = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

  function toneOf(syl) {
    const s = syl.normalize('NFC').toLowerCase();
    for (const ch of s) if (TONE_MARKS[ch]) return TONE_MARKS[ch][1];
    const m = s.match(/[1-5]$/);
    return m ? +m[0] : 5;
  }

  function segments(pinyin) {
    const text = String(pinyin || '').normalize('NFC');
    const out = [];
    let last = 0;
    for (const m of text.matchAll(SYL_RE)) {
      if (m.index > last) out.push({ text: text.slice(last, m.index), tone: null });
      out.push({ text: m[0], tone: toneOf(m[0]) });
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push({ text: text.slice(last), tone: null });
    return out;
  }

  function pinyinHtml(pinyin) {
    if (!Settings.get('toneColors')) return esc(pinyin);
    return segments(pinyin)
      .map((s) => (s.tone ? `<span class="t${s.tone}">${esc(s.text)}</span>` : esc(s.text)))
      .join('');
  }

  function hanziHtml(hanzi, pinyin) {
    const str = String(hanzi || '');
    if (!Settings.get('toneColorHanzi')) return esc(str);
    const chars = Array.from(str);
    const tones = segments(pinyin).filter((s) => s.tone).map((s) => s.tone);
    const n = chars.filter((c) => CJK.test(c)).length;
    if (!n || n !== tones.length) return esc(str);
    let i = 0;
    return chars.map((c) => (CJK.test(c) ? `<span class="t${tones[i++]}">${esc(c)}</span>` : esc(c))).join('');
  }

  // Reduce pinyin to {letters, tones} so "nǐ hǎo", "ni3 hao3" and "ni3hao3" all compare equal.
  function strip(p) {
    const s = String(p || '').normalize('NFC').toLowerCase().replace(/u:/g, 'ü').replace(/v/g, 'ü');
    let letters = '';
    let tones = '';
    for (const ch of s) {
      if (TONE_MARKS[ch]) { letters += TONE_MARKS[ch][0]; tones += TONE_MARKS[ch][1]; }
      else if (/[1-4]/.test(ch)) tones += ch;
      else if (/[a-zü]/.test(ch)) letters += ch;
    }
    return { letters, tones };
  }

  function comparePinyin(answer, expected) {
    const a = strip(answer);
    const e = strip(expected);
    if (!a.letters) return 'empty';
    if (a.letters !== e.letters) return 'wrong';
    return a.tones === e.tones ? 'correct' : 'tones';
  }

  // "ni3 hao3" → "nǐ hǎo"
  function numberedToMarks(input) {
    return String(input || '').replace(/([a-zA-ZüÜ:]+)([1-5])/g, (m, syl, tone) => {
      const s = syl.replace(/u:/g, 'ü').replace(/U:/g, 'Ü').replace(/v/g, 'ü').replace(/V/g, 'Ü');
      if (tone === '5') return s;
      const lower = s.toLowerCase();
      let idx = lower.indexOf('a');
      if (idx < 0) idx = lower.indexOf('e');
      if (idx < 0) idx = lower.indexOf('ou');
      if (idx < 0) {
        for (let i = lower.length - 1; i >= 0; i--) {
          if ('iouü'.includes(lower[i])) { idx = i; break; }
        }
      }
      if (idx < 0) return s;
      let mark = MARK_FOR[lower[idx]][+tone - 1];
      if (s[idx] !== lower[idx]) mark = mark.toUpperCase();
      return s.slice(0, idx) + mark + s.slice(idx + 1);
    });
  }

  // Lowercase, strip tone marks, for search.
  function toneless(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  TC.Pinyin = { segments, toneOf, html: pinyinHtml, hanziHtml, strip, compare: comparePinyin, numberedToMarks, toneless, CJK };

  /* ------------------------------------------------------------------ */
  /* Speech                                                             */
  /* ------------------------------------------------------------------ */
  const Speech = {
    supported: typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
    voices: [],
    listeners: [],
    queue: [],
    audio: null,
    init() {
      if (!this.supported) return;
      const load = () => {
        this.voices = window.speechSynthesis.getVoices() || [];
        this.listeners.forEach((fn) => fn());
      };
      load();
      window.speechSynthesis.onvoiceschanged = load;
    },
    onVoices(fn) { this.listeners.push(fn); },
    zhVoices() {
      return this.voices.filter((v) => /^(zh|cmn)/i.test(v.lang));
    },
    pickVoice() {
      const zh = this.zhVoices();
      const pref = Settings.get('voiceURI');
      return (
        zh.find((v) => v.voiceURI === pref) ||
        zh.find((v) => /zh[-_]CN/i.test(v.lang) && /google|xiaoxiao|tingting|yunxi|natural/i.test(v.name)) ||
        zh.find((v) => /zh[-_]CN/i.test(v.lang)) ||
        zh.find((v) => !/HK|yue/i.test(v.lang)) ||
        zh[0] ||
        null
      );
    },
    // Which engine will be used: 'system' (a Chinese voice on this device) or 'online'.
    engine() {
      const src = Settings.get('audioSource');
      if (src === 'online') return 'online';
      if (src === 'system') return 'system';
      return this.supported && this.pickVoice() ? 'system' : 'online';
    },
    statusText() {
      const e = this.engine();
      if (e === 'system') {
        const v = this.pickVoice();
        return v ? `Using ${v.name} (on this device)` : 'Using this device\u2019s default voice (may not sound Chinese)';
      }
      return Settings.get('audioSource') === 'online'
        ? 'Using the online voice (needs internet)'
        : 'No Chinese voice on this device \u2014 using the online voice (needs internet)';
    },
    stop() {
      this.queue = [];
      if (this.audio) {
        const a = this.audio;
        this.audio = null;
        try { a.pause(); a.removeAttribute('src'); a.load(); } catch (e) { /* ignore */ }
      }
      if (this.supported) window.speechSynthesis.cancel();
    },
    speak(text, opts) {
      opts = opts || {};
      const list = (Array.isArray(text) ? text : [text]).map((t) => String(t || '').trim()).filter(Boolean);
      if (!list.length) return;
      const rate = opts.rate != null ? opts.rate : Settings.get('rate');
      this.stop();
      if (this.engine() === 'online') return this.speakOnline(list, rate);
      this.speakSystem(list, rate);
    },
    speakSystem(list, rate) {
      if (!this.supported) {
        TC.toast('Audio isn\u2019t supported in this browser.');
        return;
      }
      const voice = this.pickVoice();
      list.forEach((t) => {
        const u = new SpeechSynthesisUtterance(t);
        u.lang = voice ? voice.lang : 'zh-CN';
        if (voice) u.voice = voice;
        u.rate = rate;
        window.speechSynthesis.speak(u);
      });
    },

    /* Online fallback: Google Translate's (unofficial) text-to-speech audio. */
    onlineUrl(t) {
      return 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=' + encodeURIComponent(t);
    },
    chunks(text) {
      // The endpoint only accepts short text, so split long lines at punctuation.
      const out = [];
      let cur = '';
      for (const piece of text.split(/(?<=[\uff0c\u3002\uff01\uff1f\u3001\uff1b\uff1a,.!?;:\s])/)) {
        if ((cur + piece).length > 150 && cur) { out.push(cur); cur = ''; }
        cur += piece;
        while (cur.length > 150) { out.push(cur.slice(0, 150)); cur = cur.slice(150); }
      }
      if (cur.trim()) out.push(cur);
      return out;
    },
    speakOnline(list, rate) {
      if (typeof Audio === 'undefined') return this.speakSystem(list, rate);
      this.queue = list.flatMap((t) => this.chunks(t));
      const playNext = () => {
        const t = this.queue.shift();
        if (!t) { this.audio = null; return; }
        const a = new Audio();
        this.audio = a;
        a.preload = 'auto';
        a.preservesPitch = true;
        a.mozPreservesPitch = true;
        a.webkitPreservesPitch = true;
        a.src = this.onlineUrl(t);
        // Online audio is normal speed; slow it down with the playback rate (pitch preserved).
        const r = Math.max(0.5, Math.min(rate, 2));
        a.defaultPlaybackRate = r;
        a.playbackRate = r;
        a.onloadedmetadata = () => { a.playbackRate = r; };
        a.onended = () => { if (this.audio === a) playNext(); };
        a.onerror = () => { if (this.audio === a) this.onlineFailed(list, rate); };
        const p = a.play();
        if (p && p.catch) {
          p.catch((err) => {
            if (this.audio !== a) return;
            if (err && err.name === 'NotAllowedError') TC.toast('Tap again to play audio.');
            else this.onlineFailed(list, rate);
          });
        }
      };
      playNext();
    },
    onlineFailed(list, rate) {
      this.queue = [];
      this.audio = null;
      if (this.supported && this.voices.length) {
        TC.toast('Couldn\u2019t load the online voice \u2014 trying this device\u2019s voice.');
        this.speakSystem(list, rate);
      } else {
        TC.toast('Couldn\u2019t load audio. Check your internet connection, or install a Chinese voice (see Settings).');
      }
    },
  };
  TC.Speech = Speech;

  // What should be spoken for a card / item (prefer characters, fall back to pinyin).
  TC.speakItem = function (item) {
    if (!item) return;
    if (item.lines) Speech.speak(item.lines.map((l) => l.hanzi || l.pinyin));
    else Speech.speak(item.hanzi || item.pinyin);
  };

  /* ------------------------------------------------------------------ */
  /* Toast                                                              */
  /* ------------------------------------------------------------------ */
  let toastTimer = null;
  TC.toast = function (msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
  };

  /* ------------------------------------------------------------------ */
  /* Card side rendering                                                */
  /* ------------------------------------------------------------------ */
  function sizeClass(text) {
    const n = Array.from(String(text || '')).length;
    if (n <= 1) return 'size-xl';
    if (n <= 2) return 'size-lg';
    if (n <= 4) return 'size-md';
    if (n <= 8) return 'size-sm';
    return 'size-xs';
  }

  function conversationSide(card, side) {
    const rows = card.lines
      .map((l, i) => {
        const sp = l.speaker ? `<span class="speaker">${esc(l.speaker)}</span>` : '<span class="speaker"></span>';
        let body;
        if (side === 'hanzi') body = `<span class="line-hanzi">${hanziHtml(l.hanzi, l.pinyin)}</span>`;
        else if (side === 'pinyin')
          body = `<button type="button" class="line-pinyin speak-target" data-line="${i}" title="Play this line">${pinyinHtml(l.pinyin)}</button>`;
        else body = `<span class="line-english">${esc(l.english)}</span>`;
        return `<li>${sp}${body}</li>`;
      })
      .join('');
    const title = card.title ? `<div class="conv-title">${esc(card.title)}</div>` : '';
    const playAll =
      side === 'pinyin'
        ? `<button type="button" class="btn small ghost speak-target play-all" data-speak-all="1">${icon('volume')} Play all</button>`
        : '';
    return `<div class="conv-wrap">${title}<ol class="conv">${rows}</ol>${playAll}</div>`;
  }

  // HTML for one side of a card (used by flashcards and browse tiles).
  function renderSide(card, side) {
    if (card.lines) return conversationSide(card, side);
    if (side === 'hanzi') {
      return `<div class="hanzi ${sizeClass(card.hanzi)}" lang="zh-CN">${hanziHtml(card.hanzi, card.pinyin)}</div>`;
    }
    if (side === 'pinyin') {
      return `<button type="button" class="pinyin-big speak-target" title="Click to hear it"><span class="pinyin-text">${pinyinHtml(card.pinyin)}</span><span class="speak-icon">${icon('volume')}</span></button>`;
    }
    return `<div class="english">${esc(card.english)}</div>${card.notes ? `<div class="notes">${esc(card.notes)}</div>` : ''}`;
  }
  TC.renderSide = renderSide;

  // Handle a click on any `.speak-target` inside a rendered card.
  TC.speakFromTarget = function (target, card) {
    if (!target || !card) return;
    if (target.dataset.speakAll) return TC.speakItem(card);
    if (target.dataset.line != null && card.lines) {
      const l = card.lines[+target.dataset.line];
      if (l) Speech.speak(l.hanzi || l.pinyin);
      return;
    }
    TC.speakItem(card);
  };

  /* ------------------------------------------------------------------ */
  /* Flashcard component (3 sides, animated flip)                       */
  /* ------------------------------------------------------------------ */
  class Flashcard {
    constructor(card) {
      this.card = card;
      this.order = Settings.get('sideOrder').slice();
      this.index = 0;
      this.flipping = false;
      this.el = h(`
        <div class="flashcard ${card.lines ? 'is-conv' : ''}">
          <div class="fc-inner">
            <div class="fc-top">
              <span class="fc-label"></span>
              <span class="fc-dots"></span>
              <button type="button" class="icon-btn star-btn" data-action="star" aria-label="Star this card"></button>
            </div>
            <div class="fc-body"></div>
            <div class="fc-foot"><span class="fc-unit">${esc(card.unitName || '')}</span><span class="fc-hint"></span></div>
          </div>
          <div class="swipe-tag left">${icon('x')} Still learning</div>
          <div class="swipe-tag right">${icon('check')} Know it</div>
        </div>`);
      this.inner = this.el.querySelector('.fc-inner');
      this.render();
    }

    get side() { return this.order[this.index]; }

    render() {
      const side = this.side;
      this.el.dataset.side = side;
      this.el.querySelector('.fc-label').textContent = SIDE_LABEL[side];
      this.el.querySelector('.fc-dots').innerHTML = this.order
        .map((s, i) => `<i class="${i === this.index ? 'on' : ''}" title="${SIDE_LABEL[s]}"></i>`)
        .join('');
      this.el.querySelector('.fc-body').innerHTML = renderSide(this.card, side);
      const next = this.order[(this.index + 1) % 3];
      this.el.querySelector('.fc-hint').textContent = `Tap for ${SIDE_LABEL[next].toLowerCase()}`;
      this.renderStar();
    }

    renderStar() {
      const on = Progress.isStarred(this.card.id);
      const b = this.el.querySelector('.star-btn');
      b.classList.toggle('on', on);
      b.innerHTML = icon('star', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    flip(dir) {
      dir = dir || 1;
      if (this.flipping) return;
      const done = () => {
        if (this.side === 'pinyin' && Settings.get('autoplay')) TC.speakItem(this.card);
      };
      if (reducedMotion()) {
        this.index = (this.index + dir + 3) % 3;
        this.render();
        done();
        return;
      }
      this.flipping = true;
      const inner = this.inner;
      inner.style.transition = 'transform .13s ease-in';
      inner.style.transform = `rotateY(${dir * 90}deg)`;
      setTimeout(() => {
        this.index = (this.index + dir + 3) % 3;
        this.render();
        inner.style.transition = 'none';
        inner.style.transform = `rotateY(${-dir * 90}deg)`;
        void inner.offsetWidth;
        inner.style.transition = 'transform .16s ease-out';
        inner.style.transform = 'rotateY(0deg)';
        setTimeout(() => { this.flipping = false; }, 170);
        done();
      }, 130);
    }

    // A tap on the card: star button, a speak target, or anywhere else (flip).
    tap(target) {
      const t = target && target.closest ? target : null;
      if (t && t.closest('[data-action="star"]')) {
        Progress.toggleStar(this.card.id);
        this.renderStar();
        return;
      }
      const sp = t && t.closest('.speak-target');
      if (sp) {
        TC.speakFromTarget(sp, this.card);
        return;
      }
      this.flip(1);
    }
  }
  TC.Flashcard = Flashcard;

  /* ------------------------------------------------------------------ */
  /* Shared view helpers                                                */
  /* ------------------------------------------------------------------ */
  TC.emptyState = function (title, body) {
    return `<div class="empty"><div class="empty-glyph" lang="zh-CN">空</div><h2>${esc(title)}</h2><p>${body}</p></div>`;
  };

  TC.progressBar = function (value, total) {
    const pct = total ? Math.round((value / total) * 100) : 0;
    return `<div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:${pct}%"></div></div>`;
  };

  // Render a short summary of an item (used in feedback / results).
  TC.itemSummary = function (item) {
    return `<span class="sum-hanzi" lang="zh-CN">${esc(item.hanzi)}</span><span class="sum-pinyin">${pinyinHtml(item.pinyin)}</span><span class="sum-english">${esc(item.english)}</span>`;
  };

  // Render a value of an item for a given side, compact (games / quiz options).
  TC.sideValueHtml = function (item, side) {
    if (side === 'hanzi') return `<span class="v-hanzi" lang="zh-CN">${hanziHtml(item.hanzi, item.pinyin)}</span>`;
    if (side === 'pinyin') return `<span class="v-pinyin">${pinyinHtml(item.pinyin)}</span>`;
    return `<span class="v-english">${esc(item.english)}</span>`;
  };

  // Simple segmented control HTML.
  TC.segmented = function (name, options, value) {
    return `<div class="segmented" data-name="${esc(name)}">${options
      .map((o) => `<button type="button" data-value="${esc(o.value)}" class="${o.value === value ? 'on' : ''}" ${o.disabled ? 'disabled' : ''}>${esc(o.label)}</button>`)
      .join('')}</div>`;
  };
})();
