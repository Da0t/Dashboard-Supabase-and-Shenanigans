# Mila Expense Dashboard

A real-time expense tracking dashboard for Mila Boutique, a women's fashion store in La Jolla, CA.

## What it does

Pulls live receipt data from Supabase and surfaces spending patterns across two views:

**Dashboard tab**
- KPI cards — total spend, avg transaction, this week, week-over-week change
- Monthly spend flow (Sankey) — money flow from each month to payment method
- Spend over time — area chart with day / week / month toggle
- Receipt volume by week
- Spend by month — bar chart
- Spend by day of week — radar chart
- Payment method split — donut chart
- Top 10 largest transactions — table

**Summary tab**
- Overview stats (total, count, avg, week-over-week)
- Highlights (busiest day, top month, preferred payment method)
- Monthly breakdown table
- Day of week breakdown table
- Payment method breakdown table

## Tech stack

- React + Vite
- Supabase (real-time subscriptions via `postgres_changes`)
- Recharts (area, bar, radar, donut charts)
- Nivo (Sankey chart)

## Receipts table schema

```sql
id               uuid
transaction_ref  text
date             date
time             time
subtotal         numeric
tax_rate         numeric
tax_amount       numeric
total            numeric
payment_method   text  -- CARD | CASH | CONTACTLESS
source           text
created_at       timestamptz
```

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. `npm install`
4. `npm run dev`

## Environment variables

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_KEY=your-service-role-key
```

> The service role key bypasses Row Level Security for the dashboard read. Keep it out of version control and never expose it in a public-facing deployment.
