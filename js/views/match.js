/* Match: clear the board by pairing tiles as fast as you can. */
(function () {
  'use strict';
  const { shuffle, formatTime } = TC.util;
  const { Store, icon } = TC;

  const PAIRS = [
    { value: 'hanzi-pinyin', label: 'Characters ↔ Pinyin', sides: ['hanzi', 'pinyin'] },
    { value: 'hanzi-english', label: 'Characters ↔ Definition', sides: ['hanzi', 'english'] },
    { value: 'pinyin-english', label: 'Pinyin ↔ Definition', sides: ['pinyin', 'english'] },
  ];
  const ROUND_SIZE = 6;

  let root, ctx, pairType, tiles, sel, remaining, start, endTime, penalty, timer, sound, lock;

  const bestKey = () => `matchBest:${ctx.deckKey}|${pairType}`;

  function mount(el, c) {
    root = el;
    ctx = c;
    pairType = Store.get('matchPair', 'hanzi-pinyin');
    sound = Store.get('matchSound', true);
    if (ctx.items.length < 2) {
      root.innerHTML = ctx.deck.length ? TC.emptyState('Need more cards', 'Match needs at least 2 cards in this deck.') : ctx.emptyHtml;
      return;
    }
    renderSetup();
  }

  function unmount() {
    clearInterval(timer);
    root = null;
  }

  function renderSetup(result) {
    clearInterval(timer);
    const best = Store.get(bestKey(), null);
    root.innerHTML = `
      <div class="panel center game-setup">
        ${result || `<h2>${icon('zap')} Match</h2><p class="muted">Pair every tile as fast as you can. Wrong pairs add a 1 second penalty.</p>`}
        <div class="setup-grid">
          <div class="setup-field"><span class="muted">Match</span>${TC.segmented('pair', PAIRS, pairType)}</div>
          <label class="check"><input type="checkbox" id="match-sound" ${sound ? 'checked' : ''}> Say each match out loud</label>
        </div>
        <p class="best">${best ? `Best time: <b>${formatTime(best)}</b>` : 'No best time yet'}</p>
        <button type="button" class="btn primary big-cta" data-act="start">${icon('play')} ${result ? 'Play again' : 'Start'}</button>
      </div>`;
    root.querySelector('.segmented').addEventListener('click', (e) => {
      const b = e.target.closest('[data-value]');
      if (!b) return;
      pairType = b.dataset.value;
      Store.set('matchPair', pairType);
      renderSetup(result);
    });
    root.querySelector('#match-sound').addEventListener('change', (e) => {
      sound = e.target.checked;
      Store.set('matchSound', sound);
    });
    root.querySelector('[data-act="start"]').addEventListener('click', startGame);
  }

  function pickItems(sides) {
    const out = [];
    const seen = [new Set(), new Set()];
    for (const it of shuffle(ctx.items)) {
      const a = String(it[sides[0]] || '').trim();
      const b = String(it[sides[1]] || '').trim();
      if (!a || !b || seen[0].has(a) || seen[1].has(b)) continue;
      seen[0].add(a);
      seen[1].add(b);
      out.push(it);
      if (out.length >= ROUND_SIZE) break;
    }
    return out;
  }

  function startGame() {
    const sides = PAIRS.find((p) => p.value === pairType).sides;
    const items = pickItems(sides);
    if (items.length < 2) {
      TC.toast('Not enough distinct cards for this match type.');
      return;
    }
    tiles = shuffle(items.flatMap((it) => sides.map((s) => ({ item: it, side: s }))));
    remaining = items.length;
    sel = null;
    penalty = 0;
    lock = false;
    root.innerHTML = `
      <div class="match">
        <div class="match-head">
          <span class="timer" aria-live="off">0.0s</span>
          <span class="muted"><span class="left-count">${remaining}</span> pairs left</span>
          <button type="button" class="btn small ghost" data-act="quit">${icon('x')} Quit</button>
        </div>
        <div class="match-grid">
          ${tiles
            .map((t, i) => `<button type="button" class="match-tile side-${t.side}" data-i="${i}">${TC.sideValueHtml(t.item, t.side)}</button>`)
            .join('')}
        </div>
      </div>`;
    root.querySelector('.match-grid').addEventListener('click', (e) => {
      const b = e.target.closest('.match-tile');
      if (b) pick(b);
    });
    root.querySelector('[data-act="quit"]').addEventListener('click', () => renderSetup());
    start = performance.now();
    const tEl = root.querySelector('.timer');
    timer = setInterval(() => {
      tEl.textContent = formatTime(performance.now() - start + penalty);
    }, 100);
  }

  function isPair(a, b) {
    if (a.side === b.side) return false;
    return a.item[b.side] === b.item[b.side] || b.item[a.side] === a.item[a.side];
  }

  function pick(btn) {
    if (lock || btn.classList.contains('gone')) return;
    const t = tiles[+btn.dataset.i];
    if (!sel) {
      sel = btn;
      btn.classList.add('selected');
      return;
    }
    if (sel === btn) {
      btn.classList.remove('selected');
      sel = null;
      return;
    }
    const s = tiles[+sel.dataset.i];
    if (s.side === t.side) {
      sel.classList.remove('selected');
      sel = btn;
      btn.classList.add('selected');
      return;
    }
    const a = sel;
    sel = null;
    a.classList.remove('selected');
    if (isPair(s, t)) {
      a.classList.add('matched');
      btn.classList.add('matched');
      if (sound) TC.speakItem(s.side === 'hanzi' || s.side === 'pinyin' ? s.item : t.item);
      setTimeout(() => { a.classList.add('gone'); btn.classList.add('gone'); }, 260);
      remaining -= 1;
      const lc = root.querySelector('.left-count');
      if (lc) lc.textContent = remaining;
      if (remaining === 0) {
        endTime = performance.now();
        clearInterval(timer);
        setTimeout(finish, 380);
      }
    } else {
      penalty += 1000;
      a.classList.add('wrong');
      btn.classList.add('wrong');
      lock = true;
      setTimeout(() => {
        a.classList.remove('wrong');
        btn.classList.remove('wrong');
        lock = false;
      }, 450);
    }
  }

  function finish() {
    if (!root) return;
    clearInterval(timer);
    const total = endTime - start + penalty;
    const prev = Store.get(bestKey(), null);
    const record = !prev || total < prev;
    if (record) Store.set(bestKey(), Math.round(total));
    renderSetup(`
      <div class="done-glyph small" lang="zh-CN">${record ? '新纪录！' : '完成！'}</div>
      <h2>${formatTime(total)}</h2>
      <p class="muted">${record ? (prev ? `New best! Previous: ${formatTime(prev)}` : 'Your first time on the board!') : `Best: ${formatTime(prev)}`}${penalty ? ` · ${penalty / 1000}s penalty` : ''}</p>`);
  }

  function onKey(e, typing) {
    if (typing || !root) return;
    if (e.key === 'Enter') {
      const b = root.querySelector('[data-act="start"]');
      if (b) { e.preventDefault(); b.click(); }
    }
  }

  TC.views.match = { mount, unmount, onKey };
})();
