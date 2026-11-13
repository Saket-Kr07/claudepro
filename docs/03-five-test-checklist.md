# 03 - Five Test Checklist

## Test 1: Invalid Input (Validation Check)
- **Goal:** Verify that invalid or incomplete submissions are prevented with appropriate validation messages.
- **Steps:**
  1. Open the **Student view**.
  2. Leave the topic dropdown on `— choose a topic —` and enter `Short text` in the question field. Click **Post doubt anonymously**.
  3. Change the topic dropdown to **BST**, enter only `Why?` (less than 10 characters), and click **Post doubt anonymously**.
  4. Enter the exact text of an existing question: `Why can't Dijkstra handle negative edge weights?` and select **Shortest Paths**. Click **Post doubt anonymously**.
- **Expected Results:**
  - In step 2: The red error label displays: `Pick a topic so the teacher can group your doubt.`
  - In step 3: The error updates to: `Please write at least 10 characters.`
  - In step 4: The error shows: `This exact doubt is already posted — upvote it instead!` No invalid doubts are added.

---

## Test 2: Happy Path (Doubt Submission & Upvoting)
- **Goal:** Confirm the standard lifecycle of submitting an anonymous doubt and voting.
- **Steps:**
  1. Select topic **Complexity**.
  2. Enter question: `What is the worst-case recursion stack space for skewed trees?` (length 63).
  3. Click **Post doubt anonymously**.
  4. Locate the newly posted question and click the **▲** upvote button.
- **Expected Results:**
  - Form clears and resets count to `0/280`.
  - A toast notifies `✅ Doubt posted anonymously`.
  - The doubt appears in the list with `0 votes` initially.
  - After clicking **▲**, count increments to `1 vote`, the button turns active, and toast `👍 Vote added` appears.

---

## Test 3: Twist Check (Anti-Inflation & Voter Integrity Audit)
- **Goal:** Prove that repeated votes cannot inflate totals and the Teacher audit verifies integrity.
- **Steps:**
  1. Click the **▲** upvote button rapidly multiple times (< 600ms apart) on any question.
  2. Navigate to the **Teacher dashboard**.
  3. Inspect the `#tIntegrity` line at the bottom of the top doubts section.
- **Expected Results:**
  - Rapid repeated clicks trigger debounce protection; toast displays: `⏳ Too fast. One vote per question per session.`
  - Vote count does not artificially inflate.
  - On the Teacher dashboard, the integrity audit displays:
    `Integrity check passed: X doubts, no inflated votes` with CSS class `.integrity.ok`.

---

## Test 4: Reset / Refresh Check (Persistence & State Restoration)
- **Goal:** Verify that local persistence survives reloads and sample data reset works cleanly.
- **Steps:**
  1. From the Student view, post a custom question and cast a vote on another question.
  2. Refresh the browser page (`F5` or `Cmd+R`).
  3. Navigate to **Teacher dashboard** and click **Reset to sample data**.
- **Expected Results:**
  - After refresh in step 2: Your custom question remains in the list, and your cast vote is still active (persisted in `localStorage`).
  - After clicking reset in step 3: A toast appears (`Sample data restored`), questions revert to the original 8 seed questions, and totals reflect original values.

---

## Test 5: Boundary Case (Character Limit & Single-Vote Retraction)
- **Goal:** Verify strict boundary adherence on 280 characters and single-voter toggle boundaries.
- **Steps:**
  1. Paste exactly 280 characters into the question textarea.
  2. Attempt to type an additional character.
  3. Submit the question with a valid topic.
  4. Click the upvote button once to vote, then click it once more.
- **Expected Results:**
  - Counter reflects `280/280`. Further typing is blocked by `maxlength="280"`.
  - Submission succeeds without error.
  - Upvote toggles from `0 votes` to `1 vote`, and the second click toggles it cleanly back from `1 vote` to `0 votes`.
