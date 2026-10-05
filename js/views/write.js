/* Write: type the answer (pinyin with tone numbers or marks, characters, or English). */
(function () {
  'use strict';
  const { esc, shuffle } = TC.util;
  const { Store, Progress, Pinyin, icon } = TC;

  const PROMPTS = [
    { value: 'hanzi', label: 'Characters' },
    { value: 'english', label: 'Definition' },
    { value: 'audio', label: 'Audio' },
  ];
  const ANSWERS = [
    { value: 'pinyin', label: 'Pinyin' },
    { value: 'hanzi', label: 'Characters' },
    { value: 'english', label: 'Definition' },
  ];

  let root, ctx, opts, queue, total, missedIds, missedItems, doneCount, current, phase, advanceTimer, lastWrongCopy;

  function mount(el, c) {
    root = el;
    ctx = c;
    opts = Object.assign({ prompt: 'hanzi', answer: 'pinyin' }, Store.get('writeOpts', {}));
    if (opts.prompt === opts.answer) opts.answer = 'pinyin';
    if (!ctx.items.length) {
      root.innerHTML = ctx.emptyHtml;
      return;
    }
    renderSetup();
  }

  function unmount() {
    clearTimeout(advanceTimer);
    root = null;
  }

  function renderSetup() {
    phase = 'setup';
    const answers = ANSWERS.map((a) => Object.assign({}, a, { disabled: a.value === opts.prompt }));
    root.innerHTML = `
      <div class="panel center game-setup">
        <h2>${icon('pencil')} Write</h2>
        <p class="muted">Type the answer. Missed cards come back at the end until you get them all.</p>
        <div class="setup-grid">
          <div class="setup-field"><span class="muted">Show me</span>${TC.segmented('prompt', PROMPTS, opts.prompt)}</div>
          <div class="setup-field"><span class="muted">I type</span>${TC.segmented('answer', answers, opts.answer)}</div>
        </div>
        <p class="muted small">${hintFor(opts.answer)}</p>
        <button type="button" class="btn primary big-cta" data-act="start">${icon('play')} Start</button>
      </div>`;
    root.querySelectorAll('.segmented').forEach((seg) =>
      seg.addEventListener('click', (e) => {
        const b = e.target.closest('[data-value]');
        if (!b || b.disabled) return;
        opts[seg.dataset.name] = b.dataset.value;
        if (opts.prompt === opts.answer) opts.answer = ANSWERS.find((a) => a.value !== opts.prompt).value;
        Store.set('writeOpts', opts);
        renderSetup();
      })
    );
    root.querySelector('[data-act="start"]').addEventListener('click', () => start());
  }

  function hintFor(side) {
    if (side === 'pinyin') return 'Type pinyin with tone numbers (ni3 hao3) or tone marks (nǐ hǎo). Spaces don’t matter.';
    if (side === 'hanzi') return 'Use a Chinese keyboard / IME to type characters. Punctuation doesn’t matter.';
    return 'Any one meaning is fine (e.g. “you” for “you (singular)”). You can always override a grade.';
  }

  function start(onlyItems) {
    const valid = (it) => String(it[opts.answer] || '').trim() && (opts.prompt === 'audio' ? it.hanzi || it.pinyin : String(it[opts.prompt] || '').trim());
    const list = shuffle((onlyItems || ctx.items).filter(valid));
    if (!list.length) {
      TC.toast('No cards have both of those sides filled in.');
      return;
    }
    queue = list;
    total = list.length;
    missedIds = new Set();
    missedItems = [];
    doneCount = 0;
    renderQuestion();
  }

  function promptHtml(item) {
    if (opts.prompt === 'audio') return `<button type="button" class="audio-prompt" data-act="speak" aria-label="Play audio">${icon('volume')}<span>Play again</span></button>`;
    if (opts.prompt === 'hanzi') return `<div class="hanzi quiz-hanzi" lang="zh-CN">${Pinyin.hanziHtml(item.hanzi, item.pinyin)}</div>`;
    return `<div class="english quiz-english">${esc(item.english)}</div>`;
  }

  function renderQuestion() {
    clearTimeout(advanceTimer);
    if (!queue.length) return renderResults();
    phase = 'asking';
    current = queue[0];
    const placeholder = opts.answer === 'pinyin' ? 'Type pinyin…' : opts.answer === 'hanzi' ? '输入汉字…' : 'Type the meaning…';
    root.innerHTML = `
      <div class="write">
        <div class="progress-wrap">
          <div class="progress-label"><span>${doneCount} / ${total} done</span><span>${queue.length} to go</span></div>
          ${TC.progressBar(doneCount, total)}
        </div>
        <div class="quiz-prompt"><span class="fc-label">${TC.SIDE_LABEL[opts.prompt]}</span>${promptHtml(current)}</div>
        <form class="write-form" autocomplete="off">
          <label class="fc-label" for="write-input">${TC.SIDE_LABEL[opts.answer]}</label>
          <input id="write-input" class="write-input ${opts.answer === 'hanzi' ? 'is-hanzi' : ''}" type="text" placeholder="${placeholder}" spellcheck="false" autocapitalize="off" autocorrect="off" ${opts.answer === 'hanzi' ? 'lang="zh-CN"' : ''}>
          <div class="write-preview" aria-live="polite"></div>
          <div class="row center">
            <button type="button" class="btn ghost" data-act="dunno">Don’t know</button>
            <button type="submit" class="btn primary">Check <kbd>Enter</kbd></button>
          </div>
        </form>
        <div class="quiz-feedback" aria-live="polite"></div>
        <div class="row center"><button type="button" class="btn ghost small" data-act="quit">${icon('x')} End</button></div>
      </div>`;
    const input = root.querySelector('#write-input');
    const preview = root.querySelector('.write-preview');
    input.focus();
    input.addEventListener('input', () => {
      if (opts.answer !== 'pinyin') return;
      const v = input.value;
      preview.innerHTML = /[1-5]/.test(v) ? Pinyin.html(Pinyin.numberedToMarks(v)) : '';
    });
    root.querySelector('.write-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (phase === 'asking') grade(input.value);
      else next();
    });
    root.querySelector('.write').addEventListener('click', (e) => {
      const a = e.target.closest('[data-act]');
      if (!a) return;
      const act = a.dataset.act;
      if (act === 'speak') TC.speakItem(current);
      else if (act === 'dunno' && phase === 'asking') grade('');
      else if (act === 'override') override();
      else if (act === 'next') next();
      else if (act === 'quit') renderResults();
    });
    if (opts.prompt === 'audio') setTimeout(() => TC.speakItem(current), 150);
  }

  const normHanzi = (s) => String(s || '').replace(/[\s\p{P}\p{S}]/gu, '');
  function normEn(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/\(.*?\)/g, ' ')
      .replace(/[^\p{L}\p{N}\s']/gu, ' ')
      .replace(/^\s*(to|a|an|the)\s+/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function check(answer, item) {
    if (!String(answer).trim()) return 'empty';
    if (opts.answer === 'pinyin') return Pinyin.compare(answer, item.pinyin);
    if (opts.answer === 'hanzi') return normHanzi(answer) === normHanzi(item.hanzi) ? 'correct' : 'wrong';
    const a = normEn(answer);
    const full = normEn(item.english);
    const parts = String(item.english).split(/[;,/]|\bor\b/).map(normEn).filter(Boolean);
    const fullNoParens = normEn(String(item.english).replace(/\(.*?\)/g, ''));
    return a === full || a === fullNoParens || parts.includes(a) ? 'correct' : 'wrong';
  }

  function grade(answer) {
    const res = check(answer, current);
    const ok = res === 'correct';
    phase = 'feedback';
    Progress.record(current.id, ok);
    const input = root.querySelector('#write-input');
    input.readOnly = true;
    input.classList.add(ok ? 'is-correct' : 'is-wrong');
    root.querySelector('[data-act="dunno"]').hidden = true;
    const fb = root.querySelector('.quiz-feedback');
    queue.shift();
    lastWrongCopy = null;
    if (ok) {
      doneCount += 1;
      fb.innerHTML = `<div class="fb good">${icon('check')} Correct! <span class="fb-sum">${TC.itemSummary(current)}</span></div>`;
      TC.speakItem(current);
      advanceTimer = setTimeout(next, 1200);
      return;
    }
    if (!missedIds.has(current.id)) {
      missedIds.add(current.id);
      missedItems.push(current);
    }
    // Missed cards come back at the end of the queue.
    lastWrongCopy = current;
    queue.push(current);
    const msg =
      res === 'tones' ? 'Almost — check your tones.' : res === 'empty' ? 'Here’s the answer.' : 'Not quite.';
    fb.innerHTML = `
      <div class="fb ${res === 'tones' ? 'warn' : 'bad'}">${icon(res === 'tones' ? 'help' : 'x')} ${msg}
        <span class="fb-sum">${TC.itemSummary(current)}</span>
        <button type="button" class="icon-btn" data-act="speak" aria-label="Play">${icon('volume')}</button>
      </div>
      <div class="row center">
        ${res !== 'empty' ? '<button type="button" class="btn ghost" data-act="override">I was right</button>' : ''}
        <button type="button" class="btn primary" data-act="next">Continue <kbd>Enter</kbd></button>
      </div>`;
  }

  function override() {
    if (phase !== 'feedback' || !lastWrongCopy) return;
    const i = queue.lastIndexOf(lastWrongCopy);
    if (i >= 0) queue.splice(i, 1);
    missedIds.delete(lastWrongCopy.id);
    missedItems = missedItems.filter((m) => m !== lastWrongCopy);
    Progress.record(lastWrongCopy.id, true);
    lastWrongCopy = null;
    doneCount += 1;
    next();
  }

  function next() {
    clearTimeout(advanceTimer);
    if (!root) return;
    renderQuestion();
  }

  function renderResults() {
    clearTimeout(advanceTimer);
    phase = 'results';
    const firstTry = total - missedIds.size;
    const finished = queue.length === 0;
    root.innerHTML = `
      <div class="panel center">
        <div class="done-glyph small" lang="zh-CN">${finished ? (missedIds.size ? '完成！' : '满分！') : '休息一下'}</div>
        <h2>${finished ? `${firstTry} / ${total} on the first try` : `${doneCount} / ${total} done`}</h2>
        ${missedItems.length ? `<h3 class="left">Practice these</h3><ul class="review-list">${missedItems.map((m) => `<li>${TC.itemSummary(m)}</li>`).join('')}</ul>` : ''}
        <div class="row center wrap">
          ${missedItems.length ? `<button type="button" class="btn primary" data-act="retry">Practice missed (${missedItems.length})</button>` : ''}
          <button type="button" class="btn ${missedItems.length ? 'ghost' : 'primary'}" data-act="again">Start over</button>
          <button type="button" class="btn ghost" data-act="setup">Change settings</button>
        </div>
      </div>`;
    const retry = missedItems.slice();
    root.querySelector('.panel').addEventListener('click', (e) => {
      const a = e.target.closest('[data-act]');
      if (!a) return;
      if (a.dataset.act === 'retry') start(retry);
      else if (a.dataset.act === 'again') start();
      else if (a.dataset.act === 'setup') renderSetup();
    });
  }

  function onKey(e, typing) {
    if (!root) return;
    if (phase === 'feedback' && e.key === 'Enter' && !typing) {
      e.preventDefault();
      next();
    } else if ((phase === 'setup' || phase === 'results') && e.key === 'Enter' && !typing) {
      const b = root.querySelector('[data-act="start"],[data-act="retry"],[data-act="again"]');
      if (b) { e.preventDefault(); b.click(); }
    }
  }

  TC.views.write = { mount, unmount, onKey };
})();
