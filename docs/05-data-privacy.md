# 05 - Data Privacy & Anonymity Architecture

## Fields Stored by the Application
DoubtDrop stores question data in standard JSON format:
- `id` *(string)*: Unique identifier generated locally (e.g., `"q1"` or `"q" + timestamp`).
- `topic` *(string)*: Selected lecture topic name (e.g., `"BFS / DFS"`).
- `text` *(string)*: Normalized question text (whitespace trimmed, 10–280 characters).
- `createdAt` *(number)*: Epoch millisecond timestamp of question creation.
- `voters` *(array of strings)*: List of anonymous session tokens that upvoted the question (e.g., `["s-a", "s-3k9j2a1x"]`).
- `answered` *(boolean)*: Status flag indicating whether the instructor has marked the doubt as answered (`true`/`false`).

Notably: **Questions do not store an author field, user ID, IP address, or device fingerprint.** There is zero link between the author of a question and the stored question object.

---

## Local Browser Storage Usage
- **`localStorage` (Key: `doubtdrop.v1.state`):** Stores the questions array. This persists across page reloads and browser restarts so classroom state is preserved.
- **`sessionStorage` (Key: `doubtdrop.v1.session`):** Stores a single randomly generated session token (`"s-" + Math.random().toString(36).slice(2, 10)`). This token exists strictly in memory for the life of the tab session to prevent a single student from voting multiple times on the same doubt.

---

## Demo & Fictional Data
All pre-seeded doubts and voter tokens are completely synthetic:
- Topics match standard Data Structures & Algorithms concepts (*Trees, Heaps, Graphs, Complexity*).
- Initial voter identifiers (`s-a`, `s-b`, `s-c`, etc.) are mock strings used purely to demonstrate non-zero vote counts and distribution.
- No real student or instructor names exist anywhere in the application code.

---

## What Is Never Sent Anywhere (Network Privacy)
- **Zero Outbound Requests:** DoubtDrop executes 100% client-side in the browser. It makes zero `fetch`, `XMLHttpRequest`, beacon, or WebSocket calls.
- **No Third-Party Trackers:** No external CDNs, analytics scripts (Google Analytics, Mixpanel, etc.), telemetry trackers, or third-party cookies are embedded.
- **Cross-Tab Sync:** Synchronisation occurs entirely through the browser's internal `window.addEventListener("storage", ...)` loop, without touching any network interface.

---

## Confirmation of No Real Secrets
- **No API Keys:** DoubtDrop requires no third-party APIs, database credentials, or secret keys.
- **No Passwords or Tokens:** No hardcoded private keys, JWT secrets, passwords, or authentication credentials exist in any repository file.
