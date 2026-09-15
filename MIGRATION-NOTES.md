# Migration Notes — schema hardening

Changes to the schema and services, and what each one means for **existing data and existing
clients**. Read this before deploying.

**Compatible unless marked otherwise.** Three items need action; they're marked ⚠️.

---

## ✅ Backward compatible — no action needed

### `onDelete: Cascade` → `SetNull` on `Tender.evaluator` and `Tender.buyer`
Schema-level referential action only. No stored data changes.

**Why:** cascade is correct for `owner` — a company's tenders go with it. It was wrong for these
two: deleting the admin who *reviewed* a tender, or the vendor who *won* one, deleted the tender
and every bid, question and answer beneath it. Both fields were already nullable.

### Statuses and roles are now Prisma enums
`UserRole`, `TenderStatus`, `BidStatus`, `NotificationType`.

**Enum member names are byte-identical to the strings previously stored**, so MongoDB documents
are unchanged and JSON responses serialise exactly as before. Clients comparing `'awarded'` or
`'pending'` keep working.

### Indexes added
```
Bid          @@index([tenderId, status]) @@index([vendorId, status])
Tender       @@index([status, category]) @@index([status, deadline]) @@index([companyId])
Notification @@index([userId, read])
Question     @@index([tenderId])
Answer       @@index([questionId])
```
Purely additive. Created by `prisma db push`.

### Transition table (`src/v1/domain/tender-state.ts`)
The per-function guards were individually correct but scattered. They're now one declared table
with `assertTenderTransition` / `assertBidTransition`.

**Behaviour is the same or stricter, never looser.** One difference worth knowing: error *messages*
changed — they now name the allowed transitions, e.g. *"A tender in "closed" cannot become "open".
Allowed: awarded, cancelled."* Status codes are unchanged (still 400).

### Notifications now fire after the status update commits
`closeTender` and `cancelTender` previously notified *before* their update. If the update failed,
vendors had been told a tender closed when it hadn't. `acceptBid` already did this correctly; the
other two now match.

### `User.hasNotification` removed
Dead field — referenced nowhere in the backend or frontend, and duplicated the `Notification`
table with nothing keeping it in sync. Mongo ignores the leftover attribute on existing documents.

---

## ⚠️ Needs attention

### 1. `Tender.cost` → `Tender.minimumBid`
The name described the field's type, not its meaning — it is the *minimum acceptable bid*.

| Layer | Status |
|---|---|
| **Database** | ✅ Unchanged — `@map("cost")` keeps the stored field named `cost`. |
| **API responses** | ✅ Compatible — `legacyFields` middleware mirrors `minimumBid` back onto `cost`, so both keys are emitted. |
| **API requests** | ✅ Compatible — the DTOs accept `cost` **or** `minimumBid` and normalise to `minimumBid`. |
| **Frontend** | ✅ Unchanged — it reads `tender.budget ?? tender.cost` and sends `cost`. Both still work. |

**Action:** none now. Once no client reads `cost`, delete
`src/v1/middlewares/legacyFields.middleware.ts` and its `app.ts` mount, and drop the `cost` alias
from the DTOs.

### 2. `User.email` and `User.password` are now required ⚠️ **verify before deploying**
Both were `String?`. Every user is created through `registerUser`, which always sets both, and
there is no OAuth path — so this matches reality for anything the app created.

**But Prisma throws when reading a document where a required field is missing or null.** If the
database has rows from seeding, manual insertion, or an earlier schema, reads of those users will
fail.

**Check first:**
```js
// mongosh
db.User.countDocuments({ $or: [
  { email:    { $in: [null, ""] } }, { email:    { $exists: false } },
  { password: { $in: [null, ""] } }, { password: { $exists: false } },
] })
```
Zero → safe. Non-zero → backfill or delete those rows before deploying, or revert these two fields
to optional.

### 3. An unrecognised `?status=` filter now returns an empty page
Before, an unknown status string went to the database and matched nothing. With an enum it can't be
passed at all, so `parseTenderStatus` returns `null` and the service returns an empty result set —
**the same observable outcome**, reached deliberately rather than incidentally.

Affects `getAllTenders` and the admin listing. No error is raised, matching previous behaviour.

---

## Deploying

```bash
cd backend
npx prisma generate
npx prisma db push      # creates the indexes; MongoDB has no migration files
npm run build
```

Run the §2 check **before** `db push`.

## Verified

`npx tsc --noEmit` clean · `npx tsc` build succeeds. The six type errors the enums surfaced were
real latent bugs — untyped status filters flowing into queries, and a stale `cost` in a `select`.

`npm run lint` does not run: there is no ESLint config in `backend/`, pre-existing and unrelated.
