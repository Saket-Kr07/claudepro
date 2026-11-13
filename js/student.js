/* DoubtDrop — Student view: post form, topic chips, sort/search, question list, voting.
   Owner: Vansh (claudepro) */
(() => {
  "use strict";
  const { $, esc, ago, toast, TOPICS, MAX_LEN } = DD;
  const ui = { sort: "votes", topic: "All", search: "" };

  // ---------- Form ----------
  const topicSel = $("#topic");
  const qtext = $("#qtext");
  TOPICS.forEach(t => topicSel.insertAdjacentHTML("beforeend", `<option>${esc(t)}</option>`));
  qtext.addEventListener("input", () => { $("#count").textContent = `${qtext.value.length}/${MAX_LEN}`; $("#err").textContent = ""; });
  topicSel.addEventListener("change", () => $("#err").textContent = "");

  $("#askForm").addEventListener("submit", e => {
    e.preventDefault();
    const res = DD.addQuestion(qtext.value, topicSel.value);
    if (typeof res === "string") { $("#err").textContent = res; return; }
    qtext.value = ""; topicSel.value = ""; $("#count").textContent = `0/${MAX_LEN}`;
    ui.sort = "new"; syncSortButtons();
    DD.render();
    const el = document.querySelector(`[data-id="${res.id}"]`);
    if (el) {
      el.classList.add("flash");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el.classList.remove("flash"), 1500);
    }
    toast("✅ Doubt posted anonymously");
  });

  $("#switchStudent").addEventListener("click", () => {
    const id = DD.switchStudent();
    DD.render(); toast(`Now acting as ${DD.shortId(id)}`);
  });

  // ---------- Sort / search ----------
  document.querySelectorAll(".seg button").forEach(b => b.addEventListener("click", () => {
    ui.sort = b.dataset.sort; syncSortButtons(); renderList();
  }));
  function syncSortButtons() {
    document.querySelectorAll(".seg button").forEach(x => x.classList.toggle("active", x.dataset.sort === ui.sort));
  }
  $("#search").addEventListener("input", e => { ui.search = e.target.value.trim().toLowerCase(); renderList(); });

  // ---------- Topic chips ----------
  function renderChips() {
    const counts = {};
    DD.state.questions.forEach(q => counts[q.topic] = (counts[q.topic] || 0) + 1);
    $("#topicChips").innerHTML = ["All", ...TOPICS].map(t => {
      const n = t === "All" ? DD.state.questions.length : (counts[t] || 0);
      return `<button class="chip ${ui.topic === t ? "active" : ""}" data-topic="${esc(t)}">${esc(t)} (${n})</button>`;
    }).join("");
    $("#topicChips").querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
      ui.topic = c.dataset.topic; renderChips(); renderList();
    }));
  }

  // ---------- Question list ----------
  function renderList() {
    const votes = DD.votes;
    let list = DD.state.questions.slice();
    if (ui.topic !== "All") list = list.filter(q => q.topic === ui.topic);
    if (ui.search) list = list.filter(q => q.text.toLowerCase().includes(ui.search) || q.topic.toLowerCase().includes(ui.search));
    list.sort(ui.sort === "votes"
      ? (a, b) => (a.answered - b.answered) || (votes(b) - votes(a)) || (b.createdAt - a.createdAt)
      : (a, b) => b.createdAt - a.createdAt);

    if (!list.length) {
      $("#list").innerHTML = `<div class="empty">No doubts here yet${ui.topic !== "All" ? ` for <b>${esc(ui.topic)}</b>` : ""}. Be the first to ask!</div>`;
      return;
    }
    $("#list").innerHTML = list.map(q => {
      const on = DD.hasVoted(q);
      return `<div class="q ${q.answered ? "answered" : ""}" data-id="${q.id}">
        <div class="vote">
          <button class="${on ? "on" : ""}" data-vote="${q.id}" aria-pressed="${on}" title="${on ? "Remove my vote" : "I have this doubt too"}">▲</button>
          <div class="n">${votes(q)}</div><div class="l">${on ? "voted" : "votes"}</div>
        </div>
        <div class="body">
          <p class="text">${esc(q.text)}</p>
          <div class="meta"><span class="topic">${esc(q.topic)}</span><span>Anonymous · ${ago(q.createdAt)}</span>${q.answered ? `<span class="badge-ans">Answered</span>` : ""}</div>
        </div>
      </div>`;
    }).join("");
    $("#list").querySelectorAll("[data-vote]").forEach(b => b.addEventListener("click", () => {
      const added = DD.toggleVote(b.dataset.vote);
      toast(added ? "👍 Vote added" : "↩️ Vote removed");
      DD.render();
    }));
  }

  DD.renderStudent = () => { renderChips(); renderList(); };
})();
