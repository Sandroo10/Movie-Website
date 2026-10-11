<div align="center">

# KINO · Movie Website

**Discover films. Find your session. Book your seats.**

A cinema booking application built for the Redberry Bootcamp XII assignment.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/Styles-SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)

[Design reference](https://www.figma.com/design/GJ7irMqbX98guEIT4FRau3/Redberry-Bootcamp-XII--Copy-) · [API documentation](https://api.kinoxii.redberryinternship.ge/docs)

</div>

---

## Overview

KINO connects movie discovery with an API-backed booking flow. Visitors can browse films and sessions; authenticated users can complete their profile, choose seats, purchase tickets, and manage their bookings.

The interface is in English and follows the supplied Figma design, with a **1920 × 1080 content target**.

## Features

| Area               | What it includes                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **Home**           | Animated featured-film carousel, now playing, coming soon, and recently viewed films for guests and signed-in users             |
| **Search**         | Movie search in the shared header                                                                                               |
| **Sessions**       | Venue, date, format, language, and time filters; sorting and pagination; URL state for sharing, refresh, and browser navigation |
| **Movie details**  | Backdrop, poster, description, genres, cast, age rating, and sessions grouped by venue                                          |
| **Authentication** | Login and registration modals, avatar preview, field validation, and continuation after protected actions                       |
| **Profile**        | Personal information, profile completion during booking, and upcoming/past tickets                                              |
| **Booking**        | API-generated seat map, ticket types, live pricing, seat holds, countdown, checkout, and order confirmation                     |
| **Feedback**       | Skeleton loading, background refresh indicators, empty states, field errors, and retry actions                                  |

## Getting started

Use **Node.js 22.12 or newer** and npm.

### 1. Get the project

```bash
git clone https://github.com/Sandroo10/Movie-Website.git
cd Movie-Website
npm install
```

### 2. Configure the API

Create a `.env` file in the project root:

```dotenv
VITE_API_BASE_URL=https://api.kinoxii.redberryinternship.ge/api
```

This variable is required: the API client has no hardcoded fallback. The URL is a public endpoint, not a secret. Vite exposes `VITE_` variables to the browser, so they must not contain private credentials. Local environment files are ignored by Git.

### 3. Start the app

```bash
npm run dev
```

Open the local URL printed by Vite. Restart the development server after changing environment variables.

## Commands

| Command                | Purpose                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `npm run dev`          | Start the development server                                |
| `npm run build`        | Check TypeScript and create the production build in `dist/` |
| `npm run preview`      | Preview the production build locally                        |
| `npm run lint`         | Run ESLint                                                  |
| `npm run format`       | Format the project with Prettier                            |
| `npm run format:check` | Check formatting without changing files                     |

## Architecture

The project is organized by feature. Pages assemble the interface, components render it, hooks manage its behavior, and API modules handle server requests.

```text
src/
├── app/                 # Routing and application providers
├── api/                 # Shared request client and API errors
├── components/
│   ├── layout/          # Site header and footer
│   └── ui/              # Shared modals, skeletons, icons, and feedback
├── features/
│   ├── auth/            # Account session, login, and registration
│   ├── booking/         # Seats, holds, checkout, and confirmation
│   ├── home/            # Homepage sections and carousel
│   ├── movies/          # Movie details and viewing history
│   ├── profile/         # Personal information and tickets
│   ├── search/          # Header movie search
│   ├── sessions/        # Filters, session lists, and selection
│   └── venues/          # Shared venue and filter options
├── pages/               # Home, sessions, movie, and profile pages
└── styles/              # Shared design tokens
```

### Key choices

- **React Router** maps URLs to pages. Sessions use query parameters as their filter, sort, and pagination state.
- **TanStack Query** handles server data, caching, refetching, and invalidation after mutations.
- **React Hook Form + Zod** manage forms and validation.
- **SCSS Modules** keep component styles scoped; shared tokens keep colors and spacing consistent.
- **Embla Carousel** powers the homepage carousel.
- **Context providers** coordinate authentication, profile completion, and the persistent booking modal.

Shared booking eligibility rules live in `features/booking/model/booking-eligibility.ts`. Seat validation/pricing and API error interpretation have their own small helpers, leaving `useBookingFlow` responsible for coordinating the flow.

## Booking flow

```text
Choose session
    ↓
Log in if needed → Complete profile if needed → Check age and session eligibility
    ↓
Seats → Hold selected seats → Checkout → Order confirmation
```

- The hall map comes from the API rather than hardcoded rows and seats.
- Selection is limited to three seats, with Adult, Child, and Student ticket pricing.
- Successful holds use the server's expiry time for the countdown.
- Seat conflicts remove the affected selections, preserve the others, and refresh the map.
- Hold expiry clears the selection and returns to the seats step.
- Request buttons are disabled during submission, with an additional guard against rapid repeated clicks.
- The booking provider keeps a pending request alive if its modal is dismissed, so a successful payment can still show its confirmation.
- Expired authentication opens login; interrupted booking requests resume only for the account that started them.

## Routes

| URL                                   | Page                             |
| ------------------------------------- | -------------------------------- |
| `/`                                   | Home                             |
| `/sessions`                           | Filterable sessions              |
| `/movies/:movieId`                    | Movie details                    |
| `/movies/:movieId?session=:sessionId` | Movie details with booking entry |
| `/profile`                            | Personal information             |
| `/profile?tab=tickets`                | My Tickets                       |

## Deployment

Build the project with `npm run build` and publish **`dist/`**. Set `VITE_API_BASE_URL` in the hosting project's environment settings before building.

Because Vite embeds environment values during the build, adding or changing the variable requires a new deployment. Configure the host to serve `index.html` for application routes so direct links and refreshes work with React Router.

## Current scope

Foyer food/drink ordering and pickup slots are not implemented. The API contract inspected for this project did not expose the endpoints needed for that workflow. No automated test suite is included.
