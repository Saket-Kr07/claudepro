# DoubtDrop — Anonymous Lecture Doubt Box

VibeSprint 1.0 · OWASP NIE · Problem Card 20 (Useful & Practical)

Students post anonymous doubts tagged with a topic and upvote the ones they share. A teacher dashboard shows which topics confuse the class most.

## Features (MVP)
- **Anonymous submission with a topic.** The app asks for a topic and 10–280 characters, and it blocks exact duplicates. Successful posts show a confirmation toast.
- **Sort and filter.** Sort by most voted or newest, filter with topic chips, and search the text.
- **Undoable voting.** Each anonymous student gets one vote per doubt, and clicking ▲ again removes it.
- **Teacher dashboard.**
  - Stats tiles.
  - A "most confusing topic" banner.
  - A topic confusion bar chart.
  - The top 5 voted open doubts, each with a **Mark answered** button.
- **No vote inflation.** A doubt's vote count is always `voters.length`, the number of unique anonymous IDs in its voter list, so no separate counter can drift. The dashboard also runs a live integrity check.

## Judge demo path
1. **Post a doubt and filter by topic.** In Student view, pick a topic, type a question and post it. Then click that topic's chip to filter the list.
2. **Vote, then remove the vote.** Click ▲ on any doubt and the count goes up by 1. Click again and it goes back down by 1. Use **Switch student** to vote as another anonymous student.
3. **Check the teacher summary.** Open **Teacher dashboard**. The vote counts match the student view, and the integrity line confirms that each student has at most one vote per doubt.

## Team contributions
| Member | Files | Responsibility |
|---|---|---|
| **Vansh (claudepro)** — lead | `index.html`, `js/store.js`, `js/student.js`, `js/app.js` | App structure, data layer, anonymous IDs, vote/unvote logic and its anti-inflation guarantee, posting with validation, sorting/filtering/search, routing, live sync between tabs |
| **Member 2** | `js/teacher.js` | Teacher dashboard: stats, confusion score per topic, top-voted doubts, mark answered, vote-integrity check |
| **Member 3** | `css/style.css`, `README.md`, demo proof | UI styling and responsive layout, documentation, screenshots and screen recording |

## Project structure
```
index.html        page markup
css/style.css     styles
js/store.js       state, localStorage, votes, validation, helpers
js/student.js     student view
js/teacher.js     teacher dashboard
js/app.js         tabs, render loop, live sync between tabs
```

## Tech
- A single `index.html` file in vanilla HTML, CSS and JS, with no build step.
- It is browser-first and keeps its data in `localStorage`. It uses no external APIs, no login and no `.env` file.
- Fictional sample data is loaded on first run and can be restored with **Reset to sample data**.
- If the dashboard is open in another tab, it updates live through the `storage` event.

## Run / deploy
- **Locally:** open `index.html` in a browser.
- **GitHub Pages:** push the repo, then go to Settings → Pages → Deploy from branch `main` / root.
