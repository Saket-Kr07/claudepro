# 06 - Handoff & Technical Limitations

## Main Files & Architecture
The application is structured into four focused JavaScript modules and minimal markup:

| File | Primary Responsibility |
| :--- | :--- |
| `index.html` | Shell markup: header tabs, student question form, doubt list container, teacher analytics sections. |
| `js/store.js` | Core data layer: seeded sample data, `localStorage` persistence, anonymous session generation (`newId`), debounced vote toggle logic (`toggleVote`), question validation (`addQuestion`), and state reset. |
| `js/student.js` | Student view controller: form submission, input validation handlers, topic chip filtering, sorting by newest/votes, search filter, and upvote button binding. |
| `js/teacher.js` | Teacher view controller: metric card computation, topic confusion score calculation, top-5 open doubt ranking, answer status toggling, and data integrity auditor (`renderIntegrity`). |
| `js/app.js` | Main orchestrator: hash routing (`#student` vs. `#teacher`), global render coordination, and multi-tab sync via the browser `storage` event. |
| `css/style.css` | Minimal, responsive layout styles, CSS variables, and toast notification styling. |

---

## How Demo Data Is Reset
Demo data can be reset to factory defaults at any time:
1. Inside `js/store.js`, the `seed()` function returns the baseline 8 DSA lecture questions with predefined voter distributions.
2. The `DD.reset()` method invokes `seed()` and overwrites `localStorage.getItem("doubtdrop.v1.state")`.
3. In the UI, clicking the **Reset to sample data** button (`#resetDemo`) calls `DD.reset()`, displays a `Sample data restored` toast, and re-renders both views.

---

## What Is Mocked
- **Multi-user Network:** Multi-client classroom collaboration is currently simulated within a single browser instance across tabs using `localStorage` and `sessionStorage`.
- **Lecture Session:** Lecture metadata (*DSA — Lecture 7: Trees & Graphs*) and the 7 available topics are hardcoded constants in `store.js`.
- **Identity Anonymity:** Students are assigned ephemeral random strings (`s-xxxxxxxx`) instead of cryptographically signed zero-knowledge tokens.

---

## Top Three Improvements Needed for Real Deployment
1. **Centralized Real-Time Backend (WebSockets / SSE):**
   Replace `localStorage` with a persistent backend (e.g., Node.js / Go with WebSockets or Server-Sent Events) to enable real-time doubt broadcasting across hundreds of physically distinct student devices in a lecture hall.
2. **Classroom & Lecture Session Management:**
   Allow instructors to dynamically create rooms, set custom lecture topics, start/stop doubt submission windows, and export session transcripts (CSV/JSON) after class ends.
3. **Automated Profanity & Moderation Filters:**
   Integrate client-side or server-side moderation to flag or hide inappropriate submissions automatically before doubts appear on the public class feed.
