# GulPlaze

Mobile-first ecommerce for newborn and kids clothing, toys, and mother care in Pakistan.

Tagline: **Where little ones bloom**

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Prisma (SQLite for local), Better Auth, next-intl (English + Urdu RTL).

## Setup

```bash
npm install
copy .env.example .env
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo accounts

- Store admin: `admin@gulplaze.shop` / `GulplazeAdmin1!` at `/admin`
- Customer: `amina@example.com` / `Password123!`
- First-order coupon: `BLOOM10`

COD checkout prints a development OTP in the UI after you send the code.

## Scripts

- `npm run dev` — storefront + admin
- `npm run build` — production build
- `npm run db:push` — sync schema
- `npm run db:seed` — demo catalog
- `npm run db:reset` — wipe and reseed

## Notes

Payment wallets, courier booking, WhatsApp and pixels use adapters with sandbox/mock fallbacks until API keys are added. Switch `DATABASE_URL` to PostgreSQL for production.
