/* View all: every card at once, with search and hide-a-side self testing. */
(function () {
  'use strict';
  const { esc } = TC.util;
  const { Settings, Progress, Pinyin, icon } = TC;

  let root, ctx, query = '', hidden = new Set();

  function haystack(c) {
    const p = Pinyin.toneless(c.pinyin);
    return [c.hanzi, c.english, c.notes, c.title || '', p, p.replace(/\s+/g, '')].join(' ').toLowerCase();
  }

  function matches(c, q) {
    if (!q) return true;
    const hs = c._hs || (c._hs = haystack(c));
    const qq = Pinyin.toneless(q).replace(/[1-5]/g, '').trim();
    return hs.includes(qq) || hs.includes(qq.replace(/\s+/g, ''));
  }

  function tileHtml(c) {
    const order = Settings.get('sideOrder');
    const starred = Progress.isStarred(c.id);
    const st = Progress.stat(c.id);
    const sides = order
      .map((s) => `<div class="tile-side tile-${s} ${hidden.has(s) ? 'is-hidden' : ''}" data-side="${s}">${TC.renderSide(c, s)}</div>`)
      .join('');
    const stats = st.right || st.wrong ? `<span class="tile-stats"><span class="good">${icon('check')}${st.right}</span><span class="warn">${icon('x')}${st.wrong}</span></span>` : '';
    return `
      <article class="tile ${c.lines ? 'tile-conv' : ''}" data-id="${esc(c.id)}">
        <button type="button" class="icon-btn star-btn ${starred ? 'on' : ''}" data-action="star" aria-label="Star" aria-pressed="${starred}">${icon('star', starred)}</button>
        ${sides}
        <div class="tile-meta"><span>${esc(c.unitName)}</span>${stats}</div>
      </article>`;
  }

  function renderGrid() {
    const list = ctx.deck.filter((c) => matches(c, query));
    const grid = root.querySelector('.browse-grid');
    grid.innerHTML = list.length
      ? list.map(tileHtml).join('')
      : `<p class="muted center pad">No cards match “${esc(query)}”.</p>`;
    root.querySelector('.browse-count').textContent = `${list.length} of ${ctx.deck.length}`;
  }

  function mount(el, c) {
    root = el;
    ctx = c;
    if (!ctx.deck.length) {
      root.innerHTML = ctx.emptyHtml;
      return;
    }
    root.innerHTML = `
      <div class="browse">
        <div class="browse-tools">
          <label class="search">${icon('search')}<input type="search" id="browse-search" placeholder="Search characters, pinyin (ni hao), or English" value="${esc(query)}" autocomplete="off"></label>
          <div class="hide-toggles" role="group" aria-label="Hide a side to test yourself">
            <span class="muted">Hide:</span>
            ${TC.SIDES.map((s) => `<button type="button" class="chip small ${hidden.has(s) ? 'on' : ''}" data-hide="${s}">${TC.SIDE_LABEL[s]}</button>`).join('')}
          </div>
          <span class="browse-count muted"></span>
        </div>
        <p class="browse-hint muted">Click pinyin to hear it. Hidden sides are blurred — click one to peek.</p>
        <div class="browse-grid"></div>
      </div>`;
    renderGrid();

    root.querySelector('#browse-search').addEventListener('input', (e) => {
      query = e.target.value;
      renderGrid();
    });

    root.querySelector('.browse').addEventListener('click', (e) => {
      const hide = e.target.closest('[data-hide]');
      if (hide) {
        const s = hide.dataset.hide;
        if (hidden.has(s)) hidden.delete(s);
        else hidden.add(s);
        if (hidden.size === 3) hidden.delete(s === 'hanzi' ? 'pinyin' : 'hanzi');
        root.querySelectorAll('[data-hide]').forEach((b) => b.classList.toggle('on', hidden.has(b.dataset.hide)));
        renderGrid();
        return;
      }
      const tile = e.target.closest('.tile');
      if (!tile) return;
      const card = ctx.deck.find((c) => c.id === tile.dataset.id);
      if (!card) return;
      if (e.target.closest('[data-action="star"]')) {
        const on = Progress.toggleStar(card.id);
        const b = tile.querySelector('.star-btn');
        b.classList.toggle('on', on);
        b.innerHTML = icon('star', on);
        return;
      }
      const side = e.target.closest('.tile-side');
      if (side && side.classList.contains('is-hidden') && !side.classList.contains('peek')) {
        side.classList.add('peek');
        return;
      }
      const sp = e.target.closest('.speak-target');
      if (sp) TC.speakFromTarget(sp, card);
    });
  }

  function unmount() { root = null; }

  function onKey(e, typing) {
    if (!root) return;
    if (e.key === '/' && !typing) {
      e.preventDefault();
      const s = root.querySelector('#browse-search');
      if (s) s.focus();
    }
  }

  TC.views.browse = { mount, unmount, onKey };
})();
