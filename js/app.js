/* DoubtDrop — app shell: tab routing, global render, cross-tab live sync.
   Owner: Vansh (claudepro) */
(() => {
  "use strict";
  const { $ } = DD;

  DD.render = () => {
    const n = DD.myVoteCount();
    $("#myVotes").textContent = `${n} doubt${n !== 1 ? "s" : ""}`;
    if (DD.renderStudent) DD.renderStudent();
    if (DD.renderTeacher) DD.renderTeacher();
  };

  function show(view) {
    $("#studentView").classList.toggle("hidden", view !== "student");
    $("#teacherView").classList.toggle("hidden", view !== "teacher");
    $("#tabStudent").classList.toggle("active", view === "student");
    $("#tabTeacher").classList.toggle("active", view === "teacher");
    location.hash = view;
    DD.render();
  }
  $("#tabStudent").addEventListener("click", () => show("student"));
  $("#tabTeacher").addEventListener("click", () => show("teacher"));

  // Live sync: teacher dashboard open in another tab updates instantly
  window.addEventListener("storage", e => { if (e.key === DD.STORE_KEY) { DD.reload(); DD.render(); } });

  show(location.hash === "#teacher" ? "teacher" : "student");
})();
