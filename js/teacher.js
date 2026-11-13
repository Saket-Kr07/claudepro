/* DoubtDrop - teacher dashboard (Member 2).
   Needs the global DD object from js/store.js (load this file after it). */
(function () {
  'use strict';
  const $ = (s) => DD.$(s);
  const esc = (s) => DD.esc(s);
  const qs = () => DD.state.questions || DD.state.doubts || [];

  // find (or create) a section container inside the teacher view
  function sec(id) {
    let el = $('#' + id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      ($('#teacher') || document.body).appendChild(el);
    }
    return el;
  }

  function renderStats() {
    const all = qs();
    const open = all.filter((q) => !q.answered).length;
    const votes = all.reduce((n, q) => n + DD.votes(q), 0);
    const tile = (n, label) =>
      `<div class="stat"><b>${n}</b><span>${label}</span></div>`;
    sec('tStats').innerHTML =
      tile(all.length, 'Total doubts') + tile(open, 'Open') +
      tile(all.length - open, 'Answered') + tile(votes, 'Total votes');
  }

  // confusion score = votes on open doubts + number of open doubts, per topic
  function topicStats() {
    const topics = (DD.TOPICS || []).map((t) => t.name || t);
    return topics
      .map((topic) => {
        const open = qs().filter((q) => q.topic === topic && !q.answered);
        const votes = open.reduce((n, q) => n + DD.votes(q), 0);
        return { topic, doubts: open.length, votes, score: votes + open.length };
      })
      .sort((a, b) => b.score - a.score);
  }

  function renderTopics() {
    const stats = topicStats();
    const max = Math.max(1, ...stats.map((s) => s.score));
    const best = stats[0];
    const banner = best && best.score > 0
      ? `<div class="banner">Most confusing topic: <b>${esc(best.topic)}</b> (score ${best.score})</div>`
      : `<div class="banner">No open doubts yet.</div>`;
    const bars = stats.map((s) =>
      `<div class="bar-row"><span>${esc(s.topic)}</span>` +
      `<div class="bar"><i style="width:${Math.round((s.score / max) * 100)}%"></i></div>` +
      `<em>${s.score}</em></div>`).join('');
    sec('tTopics').innerHTML = banner + bars;
  }

  function renderTop() {
    const top = qs().filter((q) => !q.answered)
      .sort((a, b) => DD.votes(b) - DD.votes(a)).slice(0, 5);
    sec('tTop').innerHTML = '<h3>Top 5 open doubts</h3>' + (top.length
      ? top.map((q) =>
          `<div class="top-item"><b>${DD.votes(q)}</b> ${esc(q.text)} <small>${esc(q.topic)}</small>` +
          `<button data-answer="${q.id}">Mark answered</button></div>`).join('')
      : '<p>Nothing open. Nice work!</p>');
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-answer]');
    if (!b) return;
    DD.markAnswered(b.dataset.answer);
    DD.toast('Marked as answered');
    DD.render();
  });

  DD.renderTeacher = () => {
    renderStats();
    renderTopics();
    renderTop();
  };
})();
