/* DoubtDrop — Teacher dashboard: stats, most-confusing topics, top doubts, vote-integrity check.
   Owner: Member 2 (Shailie S Sinha). Fixed to render into the dashboard elements in index.html. */
(() => {
  "use strict";
  const { $, esc, toast, TOPICS } = DD;

  // Confusion score per topic = open doubts + votes on open doubts
  function topicStats() {
    return TOPICS.map(t => {
      const qs = DD.state.questions.filter(q => q.topic === t);
      const open = qs.filter(q => !q.answered);
      const v = open.reduce((s, q) => s + DD.votes(q), 0);
      return { topic: t, count: qs.length, votes: v, score: open.length + v };
    }).sort((a, b) => b.score - a.score || b.votes - a.votes);
  }

  function renderStats() {
    const qs = DD.state.questions;
    $("#sQ").textContent = qs.length;
    $("#sV").textContent = qs.reduce((s, q) => s + DD.votes(q), 0);
    $("#sS").textContent = new Set(qs.flatMap(q => q.voters)).size;
    $("#sO").textContent = qs.filter(q => !q.answered).length;
  }

  function renderTopics() {
    const ts = topicStats();
    const max = Math.max(1, ...ts.map(t => t.score));
    const hot = ts[0];
    $("#hotBanner").innerHTML = hot && hot.score > 0
      ? `🔥 <b>${esc(hot.topic)}</b> is the most confusing topic right now — ${hot.count} doubt${hot.count !== 1 ? "s" : ""}, ${hot.votes} vote${hot.votes !== 1 ? "s" : ""} on open doubts. Consider revisiting it next lecture.`
      : `No open doubts yet. 🎉`;
    $("#topicBars").innerHTML = ts.map((t, i) => `
      <div class="bar-row ${i === 0 && t.score > 0 ? "hot" : ""}">
        <span>${esc(t.topic)}</span>
        <div class="bar"><div style="width:${(t.score / max) * 100}%"></div></div>
        <span class="num">${t.count} doubt${t.count !== 1 ? "s" : ""} · ${t.votes} vote${t.votes !== 1 ? "s" : ""}</span>
      </div>`).join("");
  }

  function renderTop() {
    const top = DD.state.questions.filter(q => !q.answered)
      .sort((a, b) => DD.votes(b) - DD.votes(a) || a.createdAt - b.createdAt).slice(0, 5);
    $("#topTable").innerHTML = top.length ? top.map((q, i) => `
      <tr><td class="rank">${i + 1}</td>
      <td>${esc(q.text)}<div class="meta" style="margin-top:4px"><span class="topic">${esc(q.topic)}</span></div></td>
      <td><b>${DD.votes(q)}</b></td>
      <td><button class="btn ghost" data-ans="${q.id}">Mark answered</button></td></tr>`).join("")
      : `<tr><td colspan="4" class="empty">All doubts answered 🎉</td></tr>`;
    $("#topTable").querySelectorAll("[data-ans]").forEach(b => b.addEventListener("click", () => {
      DD.markAnswered(b.dataset.ans); DD.render(); toast("Marked as answered");
    }));
  }

  // Integrity check: every vote count equals its number of unique voters
  function renderIntegrity() {
    const qs = DD.state.questions;
    const total = qs.reduce((s, q) => s + DD.votes(q), 0);
    const uniq = new Set(qs.flatMap(q => q.voters)).size;
    const dupes = qs.filter(q => new Set(q.voters).size !== q.voters.length).length;
    const el = $("#integrity");
    el.className = "integrity " + (dupes ? "bad" : "ok");
    el.textContent = dupes
      ? `⚠️ ${dupes} doubt(s) have duplicate votes`
      : `✔ Vote integrity: ${total} votes from ${uniq} unique anonymous students, max 1 vote per student per doubt. Counts are taken from the voter list, so they can't inflate.`;
  }

  $("#resetDemo").addEventListener("click", () => { DD.reset(); DD.render(); toast("Sample data restored"); });

  DD.renderTeacher = () => { renderStats(); renderTopics(); renderTop(); renderIntegrity(); };
})();
