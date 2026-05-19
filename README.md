# AcePoint — Court Booking System

A mobile-first React web app for booking badminton courts at AcePoint, built from the **Smash & Volley** design system. Pick a date, dial in your start time and duration, choose an available court, review the summary, and walk away with a confirmed receipt — all from your phone.

## Highlights

- Mobile-first layout with a max-width "phone frame" that stays centred on tablet/desktop
- Smash & Volley palette (Deep Court Green primary, Sunset Coral tertiary, Warm Bone surfaces), Lexend headlines, Hanken Grotesk body, Material Symbols icons
- Multi-step booking flow with shared state via `BookingContext`
- Booking history, Pro Shop, Profile, and Notifications modules all wired into the bottom nav

## Screens

| Route | Screen | Purpose |
| --- | --- | --- |
| `/` | Home | Hero CTA, quick actions, upcoming session |
| `/book` | Choose Time | Date strip, time chips, duration picker, live price |
| `/courts` | Select Court | Available / Booked / Maintenance grid with action bar |
| `/summary` | Booking Summary | Final review with pricing breakdown |
| `/receipt` | Receipt | Animated confetti, QR pass, "Back to Home" |
| `/bookings` | Bookings | Upcoming + past booking history |
| `/shop` | Pro Shop | Search, categories, products, sticky cart |
| `/profile` | Profile | Stats, account menu, notification preferences |
| `/notifications` | Notifications | Filterable inbox with per-item CTAs |

## Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v3](https://tailwindcss.com/) with custom tokens from the design system
- [React Router 7](https://reactrouter.com/) for screen routing
- [Material Symbols Outlined](https://fonts.google.com/icons) via Google Fonts

## Getting started

```bash
npm install
npm run dev     # start the dev server on http://localhost:5173
npm run build   # type-check + production build into ./dist
npm run preview # serve the production build
npm run lint    # run ESLint
```

Node 18+ recommended.

## Project structure

```
src/
├── App.tsx                     # Route table
├── main.tsx                    # Bootstrap, BrowserRouter, BookingProvider
├── index.css                   # Tailwind base + custom utilities
├── components/                 # Shared UI (TopAppBar, BottomNav, PriceCard, …)
├── data/courts.ts              # Mock courts, time slots, date + duration helpers
├── pages/                      # One file per screen
└── state/BookingContext.tsx    # Booking flow shared state
```

## Design tokens

All colours, radii, spacing, and typography in `tailwind.config.js` are sourced from `smash_volley/DESIGN.md` (Material Design 3 tokens). The booking progress bar uses the lime accent (`#d6ec00`) called out in the design notes.

## Conventions

- Mobile-first layout, container padding `20px`, gutter `12px`
- Rounded shapes: `0.5rem` base, `1rem` for large cards, `1.5rem` for pill inputs
- Booking state lives in `BookingContext`; screens read/write via the `useBooking()` hook
- Mock data lives in `src/data/`; replace with API calls when integrating a backend
