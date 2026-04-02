<div align="center">

# TenderVault

**A full-stack B2B Tender Management System for companies, vendors, and admins.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-v25-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Live Demo](https://tender-vault-frontend.vercel.app) · [Report a Bug](https://github.com/Souvik3469/TenderVault/issues) · [Request a Feature](https://github.com/Souvik3469/TenderVault/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [User Roles](#user-roles)
- [User Journeys](#user-journeys)
- [Screenshots](#screenshots)
- [Author](#author)
- [License](#license)

---

## Overview

TenderVault is a production-grade **Tender Management System** built for B2B procurement workflows. Companies publish tenders, vendors discover and bid on them, and admins oversee quality through a review and rating system. The platform covers the full tender lifecycle — from creation and bidding to bid acceptance/rejection, Q&A clarifications, and real-time notifications.

---

## Features

| Area                | Capability                                                                    |
| ------------------- | ----------------------------------------------------------------------------- |
| **Auth**            | JWT-based auth (register / login / logout) with role-based access             |
| **Tenders**         | Create, update, delete, and search/filter tenders by category and price       |
| **Image Upload**    | Attach a cover image via URL paste or direct file upload (Cloudinary)         |
| **Bids**            | Submit, sort, accept, and reject bids; accepted bid marks tender as awarded   |
| **Q&A**             | Vendors ask questions on open tenders; companies / admins post answers        |
| **Notifications**   | Real-time bell with unread badge; per-type icons; mark-read / mark-all-read   |
| **Admin Dashboard** | Platform-wide stats (users, tender statuses, bids), tender table with filters |
| **Tender Review**   | Admin star-rating system; persisted rating reflected immediately in UI        |
| **Profiles**        | Company view (own tenders · awarded) · Vendor view (submitted bids · won tenders) |
| **i18n**            | Multi-language support via i18next                                            |
| **Security**        | Helmet, CORS, express-rate-limit, Zod request validation                      |

---

## Tech Stack

### Backend

| Layer       | Technology                 |
| ----------- | -------------------------- |
| Language    | TypeScript 5 (strict)      |
| Runtime     | Node.js v25                |
| Framework   | Express.js                 |
| Database    | MongoDB via **Prisma ORM** |
| Auth        | JWT — `jose` library       |
| Password    | bcrypt                     |
| Validation  | Zod                        |
| Email       | Nodemailer                 |
| File Upload | Cloudinary + multer        |
| AI          | OpenAI API                 |
| Dev tooling | ts-node + nodemon          |

### Frontend

| Layer        | Technology                 |
| ------------ | -------------------------- |
| Framework    | React 18 + Vite            |
| Language     | TypeScript / JSX           |
| Styling      | Tailwind CSS               |
| State / Data | TanStack React Query v4    |
| Forms        | React Hook Form            |
| HTTP         | Axios                      |
| Routing      | React Router v6            |
| Charts       | Chart.js + react-chartjs-2 |
| Toasts       | react-hot-toast            |
| Icons        | react-icons                |
| i18n         | i18next + react-i18next    |

---

## Project Structure

```
TenderVault/
├── backend/
│   └── src/
│       ├── app.ts                  # Express app + middleware
│       ├── server.ts               # HTTP entrypoint
│       ├── prisma/index.ts         # Singleton PrismaClient
│       └── v1/
│           ├── routes/             # Route definitions only
│           ├── controllers/        # Thin — validate → service → respond
│           ├── services/           # All business logic + DB calls
│           ├── middlewares/        # Auth, validation, error handler
│           ├── dtos/               # Zod schemas for request bodies
│           ├── types/              # Express augmentation (req.user)
│           └── config/env.ts       # Env validation at startup
└── frontend/
    └── src/
        ├── api/                    # Axios client + typed query/mutation hooks
        ├── Components/
        │   ├── admin/              # AdminDashboard
        │   ├── notifications/      # NotificationBell + dropdown
        │   ├── tender/             # TenderCard, TenderDetail, QASection
        │   └── utils/              # StarRating, shared UI
        ├── Pages/                  # Page-level components (routed)
        └── App.jsx                 # Router + route definitions
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 9
- MongoDB instance (local or Atlas)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Souvik3469/TenderVault.git
cd TenderVault

# 2. Backend setup
cd backend
npm install
cp .env.example .env          # fill in your env vars (see below)
npx prisma generate
npx prisma db push
npm run dev                   # starts on PORT (default 3000)

# 3. Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev                   # starts on http://localhost:5173
```

---

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/tendervault
USER_ACCESS_SECRET=<min-32-char-random-secret>
PORT=5000
NODE_ENV=development

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_MAIL=your@email.com
SMTP_PASS=your-app-password

# OpenAI (optional — AI features)
OPENAI_API_KEY=sk-...
```

---

## API Overview

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint                              | Role          | Description                                 |
| ------ | ------------------------------------- | ------------- | ------------------------------------------- |
| POST   | `/auth/register`                      | Public        | Register a new user                         |
| POST   | `/auth/login`                         | Public        | Login and receive JWT                       |
| GET    | `/tenders`                            | Auth          | List all tenders (search, filter, sort)     |
| POST   | `/tenders`                            | Company       | Create a tender                             |
| GET    | `/tenders/mine`                       | Company       | List own tenders (all statuses)             |
| GET    | `/tenders/won`                        | Vendor        | List tenders the vendor won (awarded)       |
| POST   | `/tenders/upload`                     | Auth          | Upload cover image → returns Cloudinary URL |
| PATCH  | `/tenders/:id`                        | Company       | Update own tender                           |
| DELETE | `/tenders/:id`                        | Company       | Delete own tender                           |
| POST   | `/tenders/:id/bids`                   | Vendor        | Submit a bid                                |
| PATCH  | `/tenders/:id/bids/:bidId/accept`     | Company       | Accept a bid                                |
| PATCH  | `/tenders/:id/bids/:bidId/reject`     | Company       | Reject a bid                                |
| POST   | `/tenders/:id/questions`              | Vendor        | Ask a question                              |
| POST   | `/tenders/:id/questions/:qId/answers` | Company/Admin | Answer a question                           |
| POST   | `/tenders/:id/review`                 | Admin         | Submit star rating                          |
| GET    | `/notifications`                      | Auth          | Fetch notifications                         |
| PATCH  | `/notifications/:id/read`             | Auth          | Mark notification as read                   |
| GET    | `/admin/stats`                        | Admin         | Platform-wide stats                         |
| GET    | `/admin/tenders`                      | Admin         | All tenders with filters                    |

---

## User Roles

### Vendor

- Browse and search all open tenders (home — "Open Tenders" tab)
- View tenders they won in the home "Awarded" tab and in their profile
- Submit, view, and delete own bids
- Ask questions on open tenders
- Receive notifications (bid accepted/rejected)

### Company

- Create, update, and delete own tenders
- View and manage all bids on own tenders (sort, accept, reject)
- Answer vendor questions on own tenders
- Receive notifications (bid received, tender reviewed)

### Admin

- Access the admin dashboard with platform-wide analytics
- Review and rate any tender via star rating
- Answer questions on any tender
- Full read access across all users and tenders

---

## User Journeys

### Company — Full Tender Lifecycle

```
Register/Login (role: company)
  └─► Create Tender (draft)
        ├─ Fill title, description, category, reserve price, deadline, cover image
        └─► Publish Tender → status: open
              ├─ Vendors start submitting bids
              ├─ Receive "bid received" notification per bid
              ├─ Answer vendor Q&A questions
              ├─ [Optional] Close Tender manually → status: closed (stops new bids)
              │     OR
              │   Deadline passes → system auto-closes → status: closed
              ├─► Review bids (sort by amount, view vendor details)
              │     ├─ Accept one bid → status: awarded, buyer linked
              │     │     └─ All other pending bids auto-rejected
              │     └─ Reject individual bids
              └─► [Optional] Cancel Tender → status: cancelled (if not awarded)
```

**Edge cases:**

- Updating a tender is blocked once it is `awarded` or `cancelled`
- Deleting a tender is blocked once it is `awarded`
- A tender cannot be re-opened after being `closed`, `awarded`, or `cancelled`

---

### Vendor — Bid Submission Lifecycle

```
Register/Login (role: vendor)
  └─► Browse/Search open tenders
        ├─ Filter by category, search by name
        └─► View Tender Detail
              ├─ Ask a clarification question (open tenders only)
              │     └─ Company/admin answers → vendor gets notified
              └─► Submit Bid
                    ├─ Amount must be ≥ tender's reserve price
                    ├─ One bid per tender per vendor
                    ├─ Can withdraw (pending bids only)
                    └─► Await company decision
                          ├─ Accepted → tender marked awarded, notified ✓
                          │     └─ Won tender appears in vendor's profile (Awarded tab)
                          │           and on home page (Awarded tab)
                          └─ Rejected → notified, tender stays open for others
```

**Edge cases:**

- Bidding blocked if tender status is not `open`
- Bidding blocked if the deadline has already passed (tender auto-closes)
- Vendor cannot see other vendors' bids — only their own
- Withdrawn and deleted bids are permanent; cannot re-submit after withdrawing

---

### Admin — Review & Oversight Lifecycle

```
Login (role: admin)
  └─► Admin Dashboard
        ├─ View platform stats: total users, tender breakdown by status, total bids
        └─► Browse all tenders (filter by status)
              └─► Open Tender Detail
                    ├─ Rate tender (1–5 stars) → company notified
                    └─ Answer any vendor Q&A question
```

---

### Tender Status Flow

```
draft ──[publish]──► open ──[close / deadline passes]──► closed ──[accept bid]──► awarded
  │                    │                                               │
  └──[delete]          └──[cancel]──────────────────────────► cancelled
                                                                       │
                                                              (pending bids auto-rejected,
                                                               vendors notified)
```

---

### Bid Status Flow

```
pending ──[company accepts]──► accepted
        ──[company rejects]──► rejected
        ──[another bid accepted on same tender]──► rejected (auto)
        ──[vendor withdraws]──► withdrawn
```

---

### Notification Triggers

| Event                              | Recipient               | Type                |
| ---------------------------------- | ----------------------- | ------------------- |
| Vendor submits a bid               | Company                 | `bid_received`      |
| Company accepts a bid              | Vendor (winner)         | `bid_accepted`      |
| Company or auto-rejects a bid      | Vendor (loser)          | `bid_rejected`      |
| Admin rates a tender               | Company                 | `tender_reviewed`   |
| Tender closed (manual or deadline) | All pending-bid vendors | `tender_closed`     |
| Tender cancelled                   | All pending-bid vendors | `tender_cancelled`  |
| Vendor asks a question             | Company                 | `question_asked`    |
| Company/admin answers a question   | Vendor (asker)          | `question_answered` |

---

## Screenshots

### Landing Page

![Landing](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/Landing1.png)
![Landing](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/Landing2.png)

### Authentication

| Register                                                                                             | Login                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| ![Register](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/register.png) | ![Login](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/login.png) |

### Tender Management

| Browse Tenders                                                                                  | Create Tender                                                                                          |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| ![Browse](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/Home1.png) | ![Create](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/createtender.png) |

| Update Tender                                                                                          | Delete Tender                                                                                          |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| ![Update](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/updatetender.png) | ![Delete](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/deletetender.png) |

| Sort Tenders                                                                                       | Search Tenders                                                                                   |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ![Sort](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/sorttender.png) | ![Search](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/search.png) |

### Bid Management

| Submit Bid                                                                                        | Sort Bids                                                                                           |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| ![Add Bid](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/addbid.png) | ![Sort Bid](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/sortbid.png) |

| Accept Bid                                                                                               | Reject Bid                                                                                              |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ![Accept Bid](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/acceptbid1.png) | ![Reject Bid](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/rejectbid.png) |

### Admin & Review

| Admin Review                                                                                     | Star Rating                                                                                                 |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| ![Review](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/review.png) | ![Star Rating](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/reviewtender.png) |

### Profile

![User Profile](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/userprofile.png)

### Multi-language Support

![Multilanguage](https://github.com/Souvik3469/TenderVault/blob/main/frontend/public/assets/Multilanguage.png)

### New Features _(screenshots needed)_

> **Notification Bell** — `[Add screenshot: notification bell with unread badge and dropdown]`

> **Q&A / Clarifications** — `[Add screenshot: Q&A section on tender detail page]`

> **Admin Dashboard** — `[Add screenshot: admin dashboard with stats grid and tender table]`

---

## Author

**Souvik Sen** — [@Souvik3469](https://github.com/Souvik3469)

---

## License

[MIT](https://choosealicense.com/licenses/mit/)
