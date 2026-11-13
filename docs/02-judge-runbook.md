# 02 - Judge Runbook: 60-Second Demo

## Starting State
Open `index.html` in your browser. The default view is the **Student View** loaded with 8 seeded demo questions under the lecture banner *DSA — Lecture 7: Trees & Graphs*.

---

## 60-Second Demonstration Script

### Step 1: Post a Doubt and Filter by Topic (0:00 – 0:25)
1. In the **Drop a doubt (anonymous)** card on the left:
   - Select the topic: **BFS / DFS**.
   - In the question textarea, type: `Why do we check visited nodes before pushing to the queue?`
   - Notice the character counter updates (e.g., `56/280`).
2. Click **Post doubt anonymously**.
   - *Expected output:* A green toast appears saying `✅ Doubt posted anonymously`. The question appears at the top of the list highlighted with a smooth scroll and glow.
3. In the **Class doubts** card, click the **BFS / DFS** topic chip.
   - *Expected output:* The list filters immediately to display only doubts tagged with **BFS / DFS**, including your newly posted question.

### Step 2: Upvote and Remove Vote (0:25 – 0:40)
1. On any doubt (e.g., the top BFS / DFS question), click the **▲** upvote button.
   - *Expected output:* The vote counter increments by 1, the button highlights with class `.on`, and a toast announces `👍 Vote added`.
2. Click the **▲** button again on the same doubt.
   - *Expected output:* The vote counter decrements back by 1, the highlight clears, and a toast announces `↩️ Vote removed`.

### Step 3: Open Teacher Summary & Check Integrity (0:40 – 1:00)
1. In the top navigation header, click **Teacher dashboard**.
   - *Expected output:* The teacher view renders showing summary statistics (Total doubts, Open, Answered, Total votes), a **Most confusing topic** banner, and score progress bars.
2. Scroll to the bottom of the right card under **Top voted doubts**.
3. Inspect the integrity verification line at the bottom.
   - *Expected output:* The green badge displays:
     `Integrity check passed: 9 doubts, no inflated votes` (proves that vote counts strictly equal unique voter set sizes).

---

## Where the Twist Appears
The architectural twist is DoubtDrop's **zero-knowledge anonymous integrity model**:
- Questions never store the author's identity.
- Upvoting uses a random `sessionStorage` token (`s-xxxxxxxx`).
- Vote totals are **never stored as independent integers** that could drift or inflate; they are dynamically computed as `q.voters.length`.
- The Teacher Dashboard actively audits every single question's voter array against a JavaScript `Set` and displays a real-time integrity verification badge.

## Simulated / Mocked Elements
- **Simulated Students:** The pre-seeded questions feature fictional voter tokens (`s-a`, `s-b`, `s-c`, etc.) to illustrate existing class engagement.
- **Client-Side Persistence:** Multi-user networking is simulated using `localStorage` and the browser `storage` event for multi-tab sync.
