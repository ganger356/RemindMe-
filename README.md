# RemindMe! 🔔

A clean, modern bill pay reminder app that helps you track recurring payments and stay on top of due dates.

## Features

- **Dashboard** — overdue, due-soon (7 days), upcoming, and paid bills at a glance
- **Summary stats** — total due, total paid, and overdue count for the current period
- **Bill management** — add, edit, delete bills with name, amount, category, recurrence, and notes
- **Mark paid** — toggle payment per billing cycle; timestamps are stored automatically
- **Bill list** — search by name, filter by category and status
- **Color coding** — red = overdue, amber = due soon, green = paid
- **Persistent** — bills saved to `localStorage`, no backend required

## Tech Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) (build tool)
- [Tailwind CSS v4](https://tailwindcss.com) (styling)

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```
