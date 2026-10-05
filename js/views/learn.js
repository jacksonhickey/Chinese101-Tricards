/* Flashcards: swipe right (know it) / left (still learning) until every card is mastered. */
(function () {
  'use strict';
  const { shuffle, reducedMotion } = TC.util;
  const { Settings, Progress, Store, icon } = TC;

  let root, ctx, state, history, fc, busy, byId;

  const key = () => 'session:' + ctx.deckKey;

  function fresh() {
    const ids = ctx.deck.map((c) => c.id);
    return { queue: Settings.get('shuffle') ? shuffle(ids) : ids, mastered: [], learning: [], round: 1 };
  }

  function load() {
    const saved = Store.get(key(), null);
    const ids = new Set(ctx.deck.map((c) => c.id));
    if (saved && Array.isArray(saved.queue)) {
      const all = saved.queue.concat(saved.mastered || [], saved.learning || []);
      if (all.length === ids.size && all.every((id) => ids.has(id))) return saved;
    }
    return fresh();
  }

  const save = () => Store.set(key(), state);

  function phase() {
    if (state.queue.length) return 'card';
    if (state.learning.length) return 'round-end';
    return 'done';
  }

  function mount(el, c) {
    root = el;
    ctx = c;
    history = [];
    busy = false;
    fc = null;
    byId = new Map(ctx.deck.map((card) => [card.id, card]));
    if (!ctx.deck.length) {
      root.innerHTML = ctx.emptyHtml;
      return;
    }
    state = load();
    render();
  }

  function unmount() {
    root = null;
    fc = null;
  }

  function render() {
    if (!root) return;
    const total = ctx.deck.length;
    const m = state.mastered.length;
    const p = phase();
    root.innerHTML = `
      <div class="learn">
        <div class="learn-head">
          <div class="progress-wrap">
            <div class="progress-label"><span>Round ${state.round}</span><span><b>${m}</b> / ${total} mastered</span></div>
            ${TC.progressBar(m, total)}
          </div>
          <div class="learn-tools">
            <button type="button" class="icon-btn" data-act="undo" title="Undo (Z)" aria-label="Undo" ${history.length ? '' : 'disabled'}>${icon('undo')}</button>
            <button type="button" class="icon-btn ${Settings.get('shuffle') ? 'active' : ''}" data-act="shuffle" title="Shuffle remaining cards" aria-label="Shuffle">${icon('shuffle')}</button>
            <button type="button" class="icon-btn" data-act="restart" title="Start over" aria-label="Start over">${icon('refresh')}</button>
          </div>
        </div>
        <div class="piles">
          <span class="pile pile-left">${icon('x')} Still learning <b>${state.learning.length}</b></span>
          <span class="pile-mid">${state.queue.length} left this round</span>
          <span class="pile pile-right">Know <b>${m}</b> ${icon('check')}</span>
        </div>
        <div class="stage"></div>
        <div class="learn-actions"></div>
      </div>`;

    const stage = root.querySelector('.stage');
    const actions = root.querySelector('.learn-actions');

    if (p === 'card') {
      const card = byId.get(state.queue[0]);
      fc = new TC.Flashcard(card);
      stage.appendChild(fc.el);
      bindSwipe(fc);
      actions.innerHTML = `
        <button type="button" class="btn big no" data-act="no">${icon('x')}<span>Still learning</span></button>
        <button type="button" class="btn big ghost flip" data-act="flip">${icon('refresh')}<span>Flip</span></button>
        <button type="button" class="btn big yes" data-act="yes">${icon('check')}<span>Know it</span></button>`;
    } else if (p === 'round-end') {
      fc = null;
      stage.innerHTML = `
        <div class="panel center">
          <h2>Round ${state.round} done</h2>
          <p class="big-stat"><span class="good">${state.mastered.length}</span> mastered · <span class="warn">${state.learning.length}</span> still learning</p>
          <p class="muted">Keep going with just the cards you're still learning.</p>
          <div class="row center">
            <button type="button" class="btn primary" data-act="continue">Keep going (${state.learning.length})</button>
            <button type="button" class="btn ghost" data-act="restart">Start over</button>
          </div>
        </div>`;
    } else {
      fc = null;
      stage.innerHTML = `
        <div class="panel center done">
          <div class="burst" aria-hidden="true">${'<i></i>'.repeat(14)}</div>
          <div class="done-glyph" lang="zh-CN">棒！</div>
          <h2>All ${ctx.deck.length} mastered!</h2>
          <p class="muted">Finished in ${state.round} round${state.round === 1 ? '' : 's'}.</p>
          <div class="row center wrap">
            <button type="button" class="btn primary" data-act="restart">Study again</button>
            <button type="button" class="btn ghost" data-go="match">${icon('zap')} Play Match</button>
            <button type="button" class="btn ghost" data-go="quiz">${icon('help')} Take a quiz</button>
            <button type="button" class="btn ghost" data-go="write">${icon('pencil')} Practice writing</button>
          </div>
        </div>`;
    }

    root.querySelector('.learn').addEventListener('click', onClick);
  }

  function onClick(e) {
    const b = e.target.closest('[data-act],[data-go]');
    if (!b) return;
    if (b.dataset.go) return ctx.switchView(b.dataset.go);
    const a = b.dataset.act;
    if (a === 'yes') fling(1);
    else if (a === 'no') fling(-1);
    else if (a === 'flip') fc && fc.flip(1);
    else if (a === 'undo') undo();
    else if (a === 'restart') restart();
    else if (a === 'continue') nextRound();
    else if (a === 'shuffle') {
      Settings.set('shuffle', !Settings.get('shuffle'));
      if (Settings.get('shuffle') && state.queue.length > 1) {
        const [first, ...rest] = state.queue;
        state.queue = [first].concat(shuffle(rest));
        save();
      }
      TC.toast(Settings.get('shuffle') ? 'Shuffle on' : 'Shuffle off');
      render();
    }
  }

  function answer(known) {
    if (phase() !== 'card') return;
    history.push(JSON.stringify(state));
    if (history.length > 200) history.shift();
    const id = state.queue.shift();
    if (known) state.mastered.push(id);
    else state.learning.push(id);
    Progress.record(id, known);
    save();
    render();
  }

  function fling(dir) {
    if (!fc || busy || phase() !== 'card') return;
    busy = true;
    const el = fc.el;
    const finish = () => { busy = false; answer(dir > 0); };
    if (reducedMotion()) return finish();
    el.classList.add(dir > 0 ? 'to-right' : 'to-left');
    el.style.setProperty('--swipe', 1);
    el.style.transition = 'transform .28s ease-in, opacity .28s ease-in';
    el.style.transform = `translateX(${dir * 130}%) rotate(${dir * 16}deg)`;
    el.style.opacity = '0';
    setTimeout(finish, 240);
  }

  function undo() {
    if (!history.length || busy) return;
    state = JSON.parse(history.pop());
    save();
    render();
  }

  function restart() {
    history = [];
    state = fresh();
    save();
    render();
  }

  function nextRound() {
    history.push(JSON.stringify(state));
    state.queue = Settings.get('shuffle') ? shuffle(state.learning) : state.learning.slice();
    state.learning = [];
    state.round += 1;
    save();
    render();
  }

  function bindSwipe(card) {
    const el = card.el;
    let sx = 0, sy = 0, dx = 0, down = false, target = null, moved = false;

    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (busy) return;
      down = true;
      moved = false;
      target = e.target;
      sx = e.clientX;
      sy = e.clientY;
      dx = 0;
      el.style.transition = 'none';
    });

    el.addEventListener('pointermove', (e) => {
      if (!down) return;
      dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (!moved && Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (!moved) {
        moved = true;
        try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
      el.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
      el.style.setProperty('--swipe', Math.min(Math.abs(dx) / 120, 1).toFixed(2));
      el.classList.toggle('to-right', dx > 0);
      el.classList.toggle('to-left', dx < 0);
    });

    const end = (e, cancelled) => {
      if (!down) return;
      down = false;
      if (!cancelled && moved && Math.abs(dx) > 100) return fling(dx > 0 ? 1 : -1);
      el.style.transition = 'transform .22s ease';
      el.style.transform = '';
      el.style.setProperty('--swipe', 0);
      el.classList.remove('to-right', 'to-left');
      if (!cancelled && !moved) card.tap(target);
    };
    el.addEventListener('pointerup', (e) => end(e, false));
    el.addEventListener('pointercancel', (e) => end(e, true));
    // Keyboard-activated clicks on buttons inside the card (detail === 0).
    el.addEventListener('click', (e) => { if (e.detail === 0) card.tap(e.target); });
  }

  function onKey(e, typing) {
    if (typing || !state) return;
    const p = phase();
    const k = e.key;
    if (p === 'card') {
      if (k === ' ' || k === 'Enter' || k === 'ArrowUp' || k === 'ArrowDown') {
        e.preventDefault();
        if (fc) fc.flip(k === 'ArrowUp' ? -1 : 1);
      } else if (k === 'ArrowRight') { e.preventDefault(); fling(1); }
      else if (k === 'ArrowLeft') { e.preventDefault(); fling(-1); }
      else if (k === 's' || k === 'S') { if (fc) TC.speakItem(fc.card); }
      else if (k === 'z' || k === 'Z' || k === 'Backspace') { e.preventDefault(); undo(); }
    } else if (p === 'round-end') {
      if (k === 'Enter' || k === ' ') { e.preventDefault(); nextRound(); }
      else if (k === 'z' || k === 'Z') undo();
    } else if (k === 'z' || k === 'Z') undo();
  }

  TC.views.learn = { mount, unmount, onKey };
})();
