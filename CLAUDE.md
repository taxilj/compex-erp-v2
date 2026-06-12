\# Compex ERP - Agent Rules



\## Stack

Next.js 14, Supabase, TypeScript, Tailwind, dark UI theme



\## Critical Rules

1\. Always use createAdminClient() from lib/supabase/admin.ts

2\. Never use createServerSupabaseClient()

3\. git commit after EVERY file — no exceptions

4\. Read existing similar page before writing new one

5\. customers table uses `gst` and `address` columns (NOT gst\_number/billing\_address)



\## Current Branch

phase-2c-sales-cycle-fix



\## Working Patterns (copy these)

\- Server action: lib/actions/quotations.ts

\- Form component: app/admin/quotations/new/form.tsx

\- Page wrapper: app/admin/quotations/new/page.tsx



\## Schema Quick Reference

customers: id, name, email, phone, gst, address

invoices: see sql/selling\_production\_tables.sql

