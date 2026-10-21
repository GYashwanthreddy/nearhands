# NearHands

A directory of trusted local workers (plumbers, electricians, tutors and more). Workers sign up in **English or Telugu**, and customers browse in either language, see the rating and expected hourly rate, and **call or WhatsApp the worker directly**.

Built with **MongoDB, Express, React and Node.js**. Gemini translates worker profiles, and Cloudinary stores profile photos.

## Features
- JWT authentication with three roles: customer, worker and admin
- English / Telugu interface switch, plus worker profiles stored in both languages (Gemini translates when the worker saves)
- Search by city and work type, sort by rating, rate or experience, with pagination
- Worker cards with photo, rating, expected rate per hour, city and contact
- Phone numbers are never in search results. They are fetched only for logged-in users and the endpoint is rate-limited
- Admin approves workers before they appear in search
- One review per customer per worker (enforced by a unique index), ratings kept up to date with a MongoDB aggregation
- Photo upload to Cloudinary (optional)

## Setup
1. **Backend:** `cd backend && npm install`, copy `.env.example` to `.env`, fill in your values, then `npm run dev`
2. **Sample data:** in `backend`, run `npm run seed` once to create 10 sample workers, 3 customers and an admin
3. **Frontend:** `cd frontend && npm install`, copy `.env.example` to `.env`, then `npm run dev`
4. Open http://localhost:5173

Requires Node 18+ (Node 20 recommended).

## Demo logins (created by `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Admin | admin@nearhands.demo | Admin@1234 |
| Customer | priya@nearhands.demo | Demo@1234 |
| Worker | aarav@nearhands.demo | Demo@1234 |

The sample workers are Aarav, Vihaan, Rohan, Aditya, Kabir, Arjun, Reyansh, Devansh, Pranav and Ishaan, in Hyderabad, Bangalore and Mumbai. Their phone numbers are made-up demo numbers, so they have no Call or WhatsApp buttons. Everything is labelled "Sample" in the app.

**Security:** these passwords are public, because they are in this README. If you deploy the app online, run `npm run seed:clear` in `backend` when your demo is over, so nobody can log in as the demo admin. That command removes every `@nearhands.demo` account along with its profiles and reviews.

## Project structure
```
backend/   Express API (routes, models, services for Gemini and Cloudinary, seed script)
frontend/  React app built with Vite (pages, components, language and auth context)
```

## Notes
- Real users sign up as a customer or worker. Admin accounts can only come from the seed script.
- Without a Gemini key the app still works, but profiles are saved in only the language they were written in.
- Without Cloudinary keys everything works except photo upload.
- Free hosting such as Render sleeps when idle, so the first request after a break can take about 30 seconds.
