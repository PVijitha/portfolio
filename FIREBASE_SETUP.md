# Firebase Setup

This portfolio now reads and writes data directly with Firebase.

## What Changed

- `projects` are loaded from Firestore
- `experience` is loaded from Firestore
- `messages` are written to Firestore from the contact form
- admin login uses Firebase Authentication
- project media uploads use Firebase Storage

## Required Firebase Services

1. Create a Firebase project.
2. Enable Email/Password authentication.
3. Create a Firestore database.
4. Create a Firebase Storage bucket.
5. Create at least one admin user in Firebase Authentication.

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
```

For the one-time migration script, add one of these too:

```bash
FIREBASE_SERVICE_ACCOUNT_PATH=""
# or
FIREBASE_SERVICE_ACCOUNT_JSON=""
```

To bootstrap your one admin account, also add:

```bash
ADMIN_EMAIL=""
ADMIN_PASSWORD=""
ADMIN_DISPLAY_NAME="Portfolio Admin"
```

## Firestore Collections

Create these collections:

- `projects`
- `experience`
- `messages`

For the smoothest migration, store Firebase Storage download URLs in:

- `projects.imageUrl`
- `projects.caseStudy.gallery`

For custom ordering, you can also set these optional project fields:

- `projects.pinned: true` to keep a project above non-pinned projects
- `projects.pinOrder: 1, 2, 3...` to control the order among pinned projects

The UI still understands the old JSON image paths as a fallback while you migrate.

## Security Rules

Apply [`firestore.rules`](/c:/Profile/portfolio/firestore.rules) and [`storage.rules`](/c:/Profile/portfolio/storage.rules) in your Firebase project.

## Bootstrap Admin

Run this once after adding the admin values above:

```bash
npm run admin:bootstrap
```

That script creates or updates your Firebase Authentication user and assigns the custom claim `{ admin: true }`.

## Local Run

```bash
npm install
npm run dev
```
