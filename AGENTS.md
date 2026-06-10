# Compex ERP

## Stack
- **Framework:** Next.js 16.2.9 (App Router, Turbopack), React 19
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL project `nlqpretaqtvblaheywtc`)
- **Auth:** NextAuth v5 beta (credentials provider, JWT)
- **Keys:** Service role & anon key in `.env.local`

## Current State (Jun 2026)

### Database — 18 tables created, seeded
| Table | Rows | Notes |
|---|---|---|
| `companies` | 1 | Compex Solution (GSTIN: `24AAACС1234F1Z5`) |
| `warehouses` | 4 | Warehouse A–D, all in Rajkot |
| `items` | 8 | Steel Pipe, Brass Valve, PVC Pipe, Copper Wire, +4 electronic (IDs 1–12, 17–20) |
| `suppliers` | 2 | Rajkot Hardware Co., Gujarat Steel Traders |
| `customers` | 2 | Rajkot Automation Pvt Ltd, Surat Engineering Works |
| `sales_invoices` | 1 | INV-001, ₹50,000, Unpaid |
| `invoice_items` | 4 | 1 per item, qty 10 × ₹1,000 |
| `purchase_orders` | 1 | PO-001, ₹35,400, Pending |
| `po_items` | 4 | 1 per item, qty 5 × ₹1,500 |
| `stock_bin` | 16 | 4 items × 4 warehouses (50–249 qty each) |
| `gl_entries` | 2 | Sales Revenue (cr 50,000), Accounts Receivable (dr 50,000) |
| `inventory_transactions` | 0 | Empty |
| `bom_headers` | 1 | Assembled Controller Board (qty 1) |
| `bom_items` | 3 | Resistor 10K x10, Capacitor 100uF x5, PCB Board 2-Layer x1 |
| `material_requests` | 0 | MR workflow (supplier_id BIGINT → suppliers) |
| `mr_items` | 0 | MR line items (mr_id UUID → material_requests CASCADE) |
| `grn` | 0 | GRN workflow (po_id BIGINT → purchase_orders) |
| `grn_items` | 0 | GRN line items (grn_id UUID → grn CASCADE) |

### Auth
- Login at `/login` with credentials set in `.env.local` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- Protected routes via `middleware.ts` — redirects to `/login` if unauthenticated

### Build
- `npm run build` passes with **0 errors** — all 18 routes compile
- Middleware deprecated in favor of proxy config; `npm run dev` works

## Seeded Data Details
- All seed data inserted via `scripts/seed.mjs` using service-role key
- RLS enabled on all tables; `anon` role has full access (simple setup)
- PostgREST schema cache refreshed after seeding

## Key Fixes Applied
1. Dashboard chart: `any` type on Tooltip formatter
2. Receivables: `suppliers.name` cast to `string`
3. Payables: `customers.name` cast to `string`
4. Invoice detail: `item` param typed as `any`
5. PO detail: `item` param typed as `any`
6. BOM: two-table design (`bom_headers` + `bom_items`), DDL via CLI, seed via service-role key, added `GRANT` for new tables

## Pages
- `/admin` — Dashboard (stats cards + chart)
- `/admin/items` — Item list
- `/admin/stock` — Stock bin
- `/admin/bom` — BOM list
- `/admin/bom/[id]` — BOM detail with component table + CSV export
- `/admin/suppliers` — Supplier list
- `/admin/customers` — Customer list
- `/admin/invoices` — Sales invoices list
- `/admin/invoices/[id]` — Invoice detail
- `/admin/purchase-orders` — Purchase orders list
- `/admin/purchase-orders/[id]` — PO detail
- `/admin/erp-audit` — GL entries with totals
- `/admin/finance/receivables` — Receivables summary
- `/admin/finance/payables` — Payables summary
- `/admin/finance/profit-loss` — P&L summary
- `/admin/material-requests` — Material requests list
- `/admin/material-requests/[id]` — MR detail
- `/admin/grn` — GRN list
- `/admin/grn/[id]` — GRN detail
