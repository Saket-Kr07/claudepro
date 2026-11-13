/* DoubtDrop — data layer: state, persistence, anonymous session tokens, debounced vote logic, helpers.
   Owner: Vansh (claudepro) */
window.DD = (() => {
  "use strict";

  const TOPICS = ["Binary Trees", "BST", "Heaps", "Graph Basics", "BFS / DFS", "Shortest Paths", "Complexity"];
  const STORE_KEY = "doubtdrop.v1.state";
  const SESSION_KEY = "doubtdrop.v1.session"; // sessionStorage: one voter token per browser session
  const DEBOUNCE_MS = 600;
  const MIN_LEN = 10, MAX_LEN = 280;

  // ---------- Sample data (fictional) ----------
  function seed() {
    const now = Date.now(), m = 60000;
    const q = (id, topic, text, minsAgo, voters, answered = false) =>
      ({ id, topic, text, createdAt: now - minsAgo * m, voters, answered });
    return {
      questions: [
        q("q1", "Shortest Paths", "Why can't Dijkstra handle negative edge weights?", 42, ["s-a","s-b","s-c","s-d","s-e"]),
        q("q2", "BFS / DFS", "When should I pick BFS over DFS for finding a path?", 38, ["s-a","s-c","s-f","s-g"]),
        q("q3", "Heaps", "How is heapify O(n) and not O(n log n)?", 35, ["s-b","s-d","s-e","s-h","s-i","s-j"]),
        q("q4", "BST", "What happens to the BST when we delete a node with two children?", 30, ["s-a","s-f"]),
        q("q5", "Complexity", "Is the space complexity of recursive DFS O(V) or O(h)?", 25, ["s-c","s-g","s-h"]),
        q("q6", "Shortest Paths", "Difference between Bellman-Ford and Dijkstra in practice?", 20, ["s-b","s-i","s-j"]),
        q("q7", "Binary Trees", "Can a complete binary tree also be a full binary tree?", 15, ["s-a"], true),
        q("q8", "Graph Basics", "Adjacency list vs matrix — which one for the lab assignment?", 8, ["s-e","s-f"]),
      ]
    };
  }

  // ---------- Persistence ----------
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && Array.isArray(s.questions)) {
          // normalise: voters must be a unique array (guards against inflated counts)
          s.questions.forEach(q => { q.voters = [...new Set(q.voters || [])]; });
          return s;
        }
      }
    } catch (e) { /* fall through to seed */ }
    const s = seed(); save(s); return s;
  }
  function save(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s || DD.state)); } catch (e) {} }

  // ---------- Anonymous browser session (TWIST) ----------
  // A random token lives in sessionStorage only: one vote per question per browser session.
  // It is never shown in the UI, and questions never store who posted them.
  function newId() { return "s-" + Math.random().toString(36).slice(2, 10); }
  function newSession() { DD.myId = newId(); sessionStorage.setItem(SESSION_KEY, DD.myId); return DD.myId; }
  function myVoteCount() { return DD.state.questions.filter(q => q.voters.includes(DD.myId)).length; }

  // ---------- Votes ----------
  // Vote count is ALWAYS derived from the set of unique voters — never a separate counter.
  const votes = q => q.voters.length;
  const hasVoted = q => q.voters.includes(DD.myId);
  // Debounced toggle: rapid repeat clicks on the same question are ignored (anti-inflation).
  const lastToggle = {};
  function toggleVote(id) {
    const now = Date.now();
    if (now - (lastToggle[id] || 0) < DEBOUNCE_MS) return "blocked";
    lastToggle[id] = now;
    DD.state = load(); // re-read latest state so another tab can't cause a stale double vote
    const q = DD.state.questions.find(x => x.id === id);
    if (!q) return null;
    const i = q.voters.indexOf(DD.myId);
    if (i === -1) q.voters.push(DD.myId); else q.voters.splice(i, 1);
    q.voters = [...new Set(q.voters)]; // one vote per student, always
    save();
    return i === -1; // true = added, false = removed
  }

  // ---------- Questions ----------
  // Returns an error string, or the new question object on success.
  function addQuestion(rawText, topic) {
    const text = String(rawText).trim().replace(/\s+/g, " ");
    if (!topic) return "Pick a topic so the teacher can group your doubt.";
    if (text.length < MIN_LEN) return `Please write at least ${MIN_LEN} characters.`;
    if (text.length > MAX_LEN) return `Keep it under ${MAX_LEN} characters.`;
    if (DD.state.questions.some(q => q.text.toLowerCase() === text.toLowerCase()))
      return "This exact doubt is already posted — upvote it instead!";
    const q = { id: "q" + Date.now().toString(36), topic, text, createdAt: Date.now(), voters: [], answered: false };
    DD.state.questions.push(q); save();
    return q;
  }
  function markAnswered(id) {
    const q = DD.state.questions.find(x => x.id === id);
    if (q) { q.answered = true; save(); }
  }
  function reset() { DD.state = seed(); save(); }
  function reload() { DD.state = load(); }

  // ---------- UI helpers ----------
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  function ago(t) {
    const d = Math.max(0, Math.round((Date.now() - t) / 60000));
    if (d < 1) return "just now";
    if (d < 60) return d + " min ago";
    return Math.round(d / 60) + " h ago";
  }
  let toastT;
  function toast(msg) {
    const el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 2200);
  }

  const DD = {
    TOPICS, STORE_KEY, MIN_LEN, MAX_LEN, DEBOUNCE_MS,
    state: null, myId: null,
    load, save, reload, reset, seed,
    newId, newSession, myVoteCount,
    votes, hasVoted, toggleVote, addQuestion, markAnswered,
    $, esc, ago, toast,
    render: () => {}, // set by app.js
  };
  DD.state = load();
  DD.myId = sessionStorage.getItem(SESSION_KEY) || newId();
  sessionStorage.setItem(SESSION_KEY, DD.myId);
  return DD;
})();
