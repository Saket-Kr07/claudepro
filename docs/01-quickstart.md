# 01 - Quickstart: DoubtDrop

## Project Purpose
**DoubtDrop** is an anonymous lecture doubt box web application tailored for classroom environments (demo topic: *DSA — Lecture 7: Trees & Graphs*). It enables students to ask questions and upvote peer doubts without fear of exposure, while giving instructors real-time analytics on lecture friction points.

## Core Features
- **Anonymous Doubt Submission:** Submit questions grouped under predefined lecture topics (10–280 character limit). No student name, login, or identity is captured or attached.
- **Vote & Retract:** Single-click upvoting on doubts with toggle capability to remove votes.
- **Vote Integrity & Anti-Inflation:** Debounced clicks (600ms threshold) and voter ID deduplication ensure one vote per session per doubt. Vote counts are strictly derived from unique voter arrays.
- **Class Doubts Feed:** Filter doubts by topic chips, perform real-time text search, and sort by *Most voted* or *Newest*.
- **Teacher Dashboard:** Real-time metrics (Total Doubts, Open, Answered, Total Votes), a highlight banner for the most confusing topic, confusion score bar charts, top 5 open doubts with "Mark answered" actions, and an automated data integrity auditor.
- **Cross-Tab Synchronization:** Instant updates across multiple open browser tabs via browser `storage` events.

## No-Secret Setup Steps
No build tools, package managers, backend servers, or API keys/secrets are required.
1. Open the project folder on your machine.
2. Open `index.html` directly in any modern web browser (or run a static file server: `npx serve .` / `python3 -m http.server 8000`).
3. The app is immediately functional.

## Demo Data
On initial launch, DoubtDrop seeds 8 fictional DSA lecture doubts across topics including *Shortest Paths*, *BFS / DFS*, *Heaps*, *BST*, and *Complexity*, pre-populated with simulated voter IDs (`s-a` through `s-j`) and one answered question.

## Screenshot Placeholders
```
+-----------------------------------------------------------------------+
|  [Screenshot: Student View - Ask Doubt Form & Filterable Doubt List]  |
+-----------------------------------------------------------------------+
|  [Screenshot: Teacher Dashboard - Confusion Scores & Top 5 Doubts]    |
+-----------------------------------------------------------------------+
```

## Known Limitations
- **Local Storage Only:** Data persists strictly in browser `localStorage`. Doubts are not shared across separate physical devices without a shared backend.
- **Session Identity:** Voter anonymity is bound to a random `sessionStorage` token. Clearing browser session storage assigns a new voter identity.
- **Hardcoded Topics:** Lecture topics are predefined for DSA Lecture 7 inside `js/store.js`.
