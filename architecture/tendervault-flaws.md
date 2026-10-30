# TenderVault — Known Flaws

> **UPDATE 2026-09-15 — items 1, 2, 3, 4, 6, 7, 8 and 9 have been FIXED** in commit `8e77025`.
> Each is marked ✅ below with what was done. Items 5, 10, 11 and 12 remain open by choice.
> Compatibility implications are recorded in the repo's `MIGRATION-NOTES.md`.

**Calibration first:** this is the **best-structured backend** of the portfolio projects. Proper
layering (routes → controllers → services → Prisma), DTOs, centralised error handling, a real
`AppError` type, and lifecycle transitions that actually guard their preconditions. The flaws below
are mostly *type-safety and data-modelling* issues, not architectural ones.

---

## 🔴 High

### 1. ✅ FIXED — `onDelete: Cascade` on the evaluator and buyer relations deleted tenders
`backend/prisma/schema.prisma`

```prisma
evaluator   User?  @relation("evaluatedTenders", fields: [evaluatorId], references: [id], onDelete: Cascade)
buyer       User?  @relation("boughtTenders",   fields: [buyerId],      references: [id], onDelete: Cascade)
```

Cascade is correct for `owner` — a company's own tenders go with it. It is **wrong** for these two.
Deleting an admin who happened to *review* a tender, or a vendor who *won* one, deletes the tender
itself — along with every bid, question, and answer beneath it, since those cascade from `Tender`.

An awarded tender is a commercial record. Removing one user should not erase another company's
procurement history.

**Fix:** `onDelete: SetNull` on both — the fields are already nullable, so the schema is one word
away from correct.

### 2. ✅ FIXED — every status was a free-text `String`, with the real values in a comment
```prisma
role   String? @default("vendor")  // vendor | company | admin
status String                      // pending | accepted | rejected | withdrawn
status String? @default("draft")   // draft | open | closed | awarded | cancelled
type   String?                     // bid_received | bid_accepted | ...
```

The lifecycle logic then compares strings: `tender.status !== 'draft'`,
`['open','closed'].includes(...)`, `status: 'awarded'`. Every one of those is a typo away from a
silently-wrong branch, and the compiler cannot help.

Prisma supports enums on MongoDB. Declaring them would make the state machine a *type* rather than a
convention — and it's the single change that would most improve this codebase.

---

## 🟠 Medium

### 3. ✅ FIXED — no indexes at all
`@@index` count: zero. The queries that need them:

| Query | Index |
|---|---|
| Bids for a tender, filtered by status | `Bid @@index([tenderId, status])` |
| Tender listing, filtered by status/category | `Tender @@index([status, category])` |
| A user's unread notifications | `Notification @@index([userId, read])` |
| Deadline expiry sweeps | `Tender @@index([status, deadline])` |

### 4. ✅ FIXED — transition rules were distributed across functions rather than declared once
`publishTender` allows only `draft → open`; `closeTender` only `open → closed`; `cancelTender`
blocks `awarded`; `acceptBid` requires the tender to be `open` or `closed`.

Each guard is individually correct — which is genuinely better than most projects. But the machine
only exists as the union of five scattered `if` statements, so adding a state means finding all of
them, and there is no single place to read the legal transitions.

**Fix:** one transition map, one validator.

### 5. Notifications are fire-and-forget, in a `forEach`
```ts
pending.forEach((b) => notify(b.vendorId, ...));
```
`notify()` is deliberately never awaited (documented in `utils/notify.ts`) and swallows errors to a
`console.error`. So a failed notification is invisible, and the caller returns success regardless.
Fine for a non-critical channel; worth knowing it's best-effort rather than guaranteed.

### 6. ✅ FIXED — `closeTender` and `cancelTender` notified *before* the status update committed
Both fetch pending bids, fire notifications, and *then* call `prisma.tender.update`. If that update
fails, vendors have been told a tender closed when it didn't.

Notably, **`acceptBid` gets this right** — it captures the vendors to notify, runs the transaction,
and only notifies after it commits. The correct pattern exists in the same file; two functions
don't follow it.

### 7. ✅ FIXED — `hasNotification` on `User` duplicated the `Notification` table
A denormalised boolean beside a queryable relation. Nothing keeps it in sync with
`Notification.read`, so it can drift — and the count is derivable.

### 8. ✅ FIXED — `User.email` and `password` were optional, and `email` a nullable unique
```prisma
email    String? @unique
password String?
```
A user row can exist with neither. `@unique` on a nullable column also permits multiple nulls, so
"unique email" is only true for users who have one. Almost every field on `User` is optional,
which pushes invariants that belong in the schema out into the application.

---

## 🟡 Low

### 9. ✅ FIXED — `Tender.cost` didn't mean cost
The comment says "minimum acceptable bid amount". It's a floor, not a price — `minimumBid` or
`reservePrice` would be self-documenting. A misleading name on a money field is worth a rename.

### 10. `autoExpireTender` runs opportunistically on read
Deadline expiry happens when someone happens to touch the tender, not on a schedule. A tender past
its deadline that nobody views stays `open` indefinitely, and the first reader pays the write.
Works, but expiry is a scheduled job, not a read-path side effect.

### 11. `Docs/` is college coursework
SRS, SPMP, COCOMO spreadsheet, Function Point metrics, Gantt chart, DFDs, test-case workbook — all
academic deliverables that describe an earlier version of the system and don't match the code. They
have historical value; they are not documentation of this repository. The README note added
alongside these docs flags that.

### 12. No tests

---

## What's genuinely strong

- **The layering is textbook and actually followed.** `routes → controllers → services → prisma`,
  with DTOs, a `validate` middleware, a centralised `error.middleware`, and an `AppError` carrying a
  status code. Controllers stay thin; business logic lives in services. None of the other JS
  projects here do this.
- **`acceptBid` is the best single function in the portfolio.** It checks ownership, guards both the
  bid's and the tender's current state, **captures the vendors to notify before the transaction
  mutates their rows**, performs the three-way update atomically (accept one, award the tender,
  auto-reject the rest), and notifies only after commit. The pre-capture detail is the kind of thing
  people get wrong and never notice.
- **Lifecycle operations are named, not generic.** `publishTender`, `closeTender`, `cancelTender`,
  `acceptBid`, `rejectBid`, `withdrawBid` — rather than one `updateStatus(newStatus)`. That is what
  makes the preconditions enforceable at all.
- **`jose` for JWT verification** with a proper claims payload, rather than signing a bare string.
  Better than the approach used in Commune.
- **Auto-reject-on-award is modelled as a business rule**, inside the same transaction as the award.
  Losing bids can't be left dangling.
- **A vendor↔company Q&A thread** (`Question` → `Answer`) — procurement clarifications are a real
  part of the domain, and modelling them at all shows the problem was understood beyond CRUD.


---

## Fix log — 2026-09-15 (commit `8e77025`)

| # | What was done |
|---|---|
| 1 | `SetNull` on `Tender.evaluator` and `Tender.buyer`. Cascade retained on `owner`, where it is correct. |
| 2 | `UserRole`, `TenderStatus`, `BidStatus`, `NotificationType` as Prisma enums. Member names identical to the previously stored strings, so documents and API payloads are unchanged. |
| 3 | Indexes on `Bid(tenderId,status)`, `Bid(vendorId,status)`, `Tender(status,category)`, `Tender(status,deadline)`, `Tender(companyId)`, `Notification(userId,read)`, `Question(tenderId)`, `Answer(questionId)`. |
| 4 | `src/v1/domain/tender-state.ts` — both state machines declared once, with `assertTenderTransition` / `assertBidTransition`. Five scattered guards replaced. |
| 6 | `closeTender` and `cancelTender` now notify after the update commits, matching `acceptBid`. |
| 7 | `hasNotification` removed. It was referenced nowhere. |
| 8 | `email` and `password` now required. Data verified clear 2026-09-15 — every user row has both, no backfill needed. |
| 9 | `cost` → `minimumBid` with `@map("cost")`, plus a `legacyFields` response shim and DTO aliases so existing clients are unaffected. |

**Still open, deliberately:** #5 (fire-and-forget notifications — documented as intentional),
#10 (lazy deadline expiry), #11 (`Docs/` coursework — flagged in the README instead), #12 (no tests).

**What the fix surfaced:** the enums produced six compile errors that had been latent — untyped
status filters flowing into Prisma queries in three places, an untyped notification type, and a
stale `cost` in a `select`. None were visible while the statuses were strings.
