/* Quiz: multiple choice, including a listening mode (hear it → pick it). */
(function () {
  'use strict';
  const { esc, shuffle } = TC.util;
  const { Store, Progress, Pinyin, icon } = TC;

  const PROMPTS = [
    { value: 'hanzi', label: 'Characters' },
    { value: 'pinyin', label: 'Pinyin' },
    { value: 'english', label: 'Definition' },
    { value: 'audio', label: 'Audio' },
  ];
  const ANSWERS = [
    { value: 'hanzi', label: 'Characters' },
    { value: 'pinyin', label: 'Pinyin' },
    { value: 'english', label: 'Definition' },
  ];
  const COUNTS = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: 'all', label: 'All' },
  ];

  let root, ctx, opts, qs, idx, score, missed, answered, advanceTimer;

  function mount(el, c) {
    root = el;
    ctx = c;
    opts = Object.assign({ prompt: 'hanzi', answer: 'english', count: '10' }, Store.get('quizOpts', {}));
    if (opts.prompt === opts.answer) opts.answer = opts.prompt === 'english' ? 'hanzi' : 'english';
    if (ctx.items.length < 2) {
      root.innerHTML = ctx.deck.length ? TC.emptyState('Need more cards', 'A quiz needs at least 2 cards in this deck.') : ctx.emptyHtml;
      return;
    }
    renderSetup();
  }

  function unmount() {
    clearTimeout(advanceTimer);
    root = null;
  }

  function renderSetup() {
    const answers = ANSWERS.map((a) => Object.assign({}, a, { disabled: a.value === opts.prompt }));
    root.innerHTML = `
      <div class="panel center game-setup">
        <h2>${icon('help')} Quiz</h2>
        <p class="muted">Multiple choice. Pick <b>Audio</b> to practice listening.</p>
        <div class="setup-grid">
          <div class="setup-field"><span class="muted">Show me</span>${TC.segmented('prompt', PROMPTS, opts.prompt)}</div>
          <div class="setup-field"><span class="muted">I answer with</span>${TC.segmented('answer', answers, opts.answer)}</div>
          <div class="setup-field"><span class="muted">Questions</span>${TC.segmented('count', COUNTS, opts.count)}</div>
        </div>
        <button type="button" class="btn primary big-cta" data-act="start">${icon('play')} Start quiz</button>
      </div>`;
    root.querySelectorAll('.segmented').forEach((seg) =>
      seg.addEventListener('click', (e) => {
        const b = e.target.closest('[data-value]');
        if (!b || b.disabled) return;
        opts[seg.dataset.name] = b.dataset.value;
        if (opts.prompt === opts.answer) opts.answer = ANSWERS.find((a) => a.value !== opts.prompt).value;
        Store.set('quizOpts', opts);
        renderSetup();
      })
    );
    root.querySelector('[data-act="start"]').addEventListener('click', () => start());
  }

  function buildQuestion(item, pool) {
    const side = opts.answer;
    const correct = String(item[side] || '').trim();
    const seen = new Set([correct]);
    const distractors = [];
    for (const it of shuffle(pool)) {
      const v = String(it[side] || '').trim();
      if (!v || seen.has(v)) continue;
      seen.add(v);
      distractors.push(it);
      if (distractors.length >= 3) break;
    }
    return { item, options: shuffle([item].concat(distractors)) };
  }

  function start(onlyItems) {
    const valid = (it) => String(it[opts.answer] || '').trim() && (opts.prompt === 'audio' ? it.hanzi || it.pinyin : String(it[opts.prompt] || '').trim());
    let list = shuffle((onlyItems || ctx.items).filter(valid));
    if (!onlyItems && opts.count !== 'all') list = list.slice(0, +opts.count);
    if (!list.length) {
      TC.toast('No cards have both of those sides filled in.');
      return;
    }
    qs = list.map((it) => buildQuestion(it, ctx.items));
    idx = 0;
    score = 0;
    missed = [];
    renderQuestion();
  }

  function promptHtml(item) {
    if (opts.prompt === 'audio') {
      return `<button type="button" class="audio-prompt speak-target" data-act="speak" aria-label="Play audio">${icon('volume')}<span>Play again</span></button>`;
    }
    if (opts.prompt === 'pinyin') {
      return `<button type="button" class="pinyin-big speak-target" data-act="speak"><span class="pinyin-text">${Pinyin.html(item.pinyin)}</span><span class="speak-icon">${icon('volume')}</span></button>`;
    }
    if (opts.prompt === 'hanzi') return `<div class="hanzi quiz-hanzi" lang="zh-CN">${Pinyin.hanziHtml(item.hanzi, item.pinyin)}</div>`;
    return `<div class="english quiz-english">${esc(item.english)}</div>`;
  }

  function renderQuestion() {
    clearTimeout(advanceTimer);
    answered = false;
    const q = qs[idx];
    root.innerHTML = `
      <div class="quiz">
        <div class="progress-wrap">
          <div class="progress-label"><span>Question ${idx + 1} / ${qs.length}</span><span>Score <b>${score}</b></span></div>
          ${TC.progressBar(idx, qs.length)}
        </div>
        <div class="quiz-prompt"><span class="fc-label">${TC.SIDE_LABEL[opts.prompt]}</span>${promptHtml(q.item)}</div>
        <div class="quiz-options opts-${opts.answer}">
          ${q.options
            .map((o, i) => `<button type="button" class="quiz-opt" data-i="${i}"><kbd>${i + 1}</kbd>${TC.sideValueHtml(o, opts.answer)}</button>`)
            .join('')}
        </div>
        <div class="quiz-feedback" aria-live="polite"></div>
        <div class="row center"><button type="button" class="btn ghost small" data-act="quit">${icon('x')} End quiz</button></div>
      </div>`;
    const quiz = root.querySelector('.quiz');
    quiz.addEventListener('click', (e) => {
      const o = e.target.closest('.quiz-opt');
      if (o) return choose(+o.dataset.i);
      const a = e.target.closest('[data-act]');
      if (!a) return;
      if (a.dataset.act === 'speak') TC.speakItem(q.item);
      else if (a.dataset.act === 'next') next();
      else if (a.dataset.act === 'quit') renderResults();
    });
    if (opts.prompt === 'audio') setTimeout(() => TC.speakItem(q.item), 150);
  }

  function choose(i) {
    if (answered) return;
    answered = true;
    const q = qs[idx];
    const picked = q.options[i];
    const ok = String(picked[opts.answer]).trim() === String(q.item[opts.answer]).trim();
    Progress.record(q.item.id, ok);
    const btns = root.querySelectorAll('.quiz-opt');
    btns.forEach((b, j) => {
      b.disabled = true;
      const o = q.options[j];
      if (String(o[opts.answer]).trim() === String(q.item[opts.answer]).trim()) b.classList.add('correct');
      else if (j === i) b.classList.add('wrong');
    });
    const fb = root.querySelector('.quiz-feedback');
    if (ok) {
      score += 1;
      fb.innerHTML = `<div class="fb good">${icon('check')} Correct! <span class="fb-sum">${TC.itemSummary(q.item)}</span></div>`;
      advanceTimer = setTimeout(next, 1100);
    } else {
      missed.push(q.item);
      fb.innerHTML = `
        <div class="fb bad">${icon('x')} Not quite. <span class="fb-sum">${TC.itemSummary(q.item)}</span>
          <button type="button" class="icon-btn" data-act="speak" aria-label="Play">${icon('volume')}</button>
        </div>
        <button type="button" class="btn primary" data-act="next">Next <kbd>Enter</kbd></button>`;
    }
    const lbl = root.querySelector('.progress-label b');
    if (lbl) lbl.textContent = score;
  }

  function next() {
    clearTimeout(advanceTimer);
    if (!root) return;
    idx += 1;
    if (idx >= qs.length) renderResults();
    else renderQuestion();
  }

  function renderResults() {
    clearTimeout(advanceTimer);
    const answeredCount = Math.min(idx + (answered ? 1 : 0), qs.length);
    const pct = answeredCount ? Math.round((score / answeredCount) * 100) : 0;
    const glyph = pct === 100 ? '满分！' : pct >= 80 ? '很好！' : pct >= 50 ? '加油！' : '再试试';
    root.innerHTML = `
      <div class="panel center">
        <div class="done-glyph small" lang="zh-CN">${glyph}</div>
        <h2>${score} / ${answeredCount} correct</h2>
        <p class="muted">${pct}%</p>
        ${missed.length ? `<h3 class="left">Review these</h3><ul class="review-list">${missed.map((m) => `<li>${TC.itemSummary(m)}</li>`).join('')}</ul>` : ''}
        <div class="row center wrap">
          ${missed.length ? `<button type="button" class="btn primary" data-act="retry">Retry missed (${missed.length})</button>` : ''}
          <button type="button" class="btn ${missed.length ? 'ghost' : 'primary'}" data-act="again">New quiz</button>
          <button type="button" class="btn ghost" data-act="setup">Change settings</button>
        </div>
      </div>`;
    const retryItems = missed.slice();
    root.querySelector('.panel').addEventListener('click', (e) => {
      const a = e.target.closest('[data-act]');
      if (!a) return;
      if (a.dataset.act === 'retry') start(retryItems);
      else if (a.dataset.act === 'again') start();
      else if (a.dataset.act === 'setup') renderSetup();
    });
    qs = null;
  }

  function onKey(e, typing) {
    if (typing || !root) return;
    if (!qs) {
      if (e.key === 'Enter') {
        const b = root.querySelector('[data-act="start"],[data-act="retry"],[data-act="again"]');
        if (b) { e.preventDefault(); b.click(); }
      }
      return;
    }
    if (/^[1-4]$/.test(e.key)) {
      const i = +e.key - 1;
      if (qs[idx] && i < qs[idx].options.length) choose(i);
    } else if (e.key === 'Enter' && answered) {
      e.preventDefault();
      next();
    } else if (e.key === 's' || e.key === 'S') {
      TC.speakItem(qs[idx].item);
    }
  }

  TC.views.quiz = { mount, unmount, onKey };
})();
