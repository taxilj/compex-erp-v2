-- ================================================================
-- Compex ERP: Selling & Production Flow Tables
-- ================================================================
-- This migration creates the complete selling-to-production pipeline:
--   Quotation → Sales Order → Job Card → Production → Delivery Note
-- ================================================================

-- 0. Enum Types
-- ================================================================

CREATE TYPE selling_status AS ENUM (
  'draft', 'pending_approval', 'approved', 'rejected',
  'converted', 'cancelled'
);

CREATE TYPE order_status AS ENUM (
  'draft', 'pending_approval', 'approved', 'in_progress',
  'partially_delivered', 'delivered', 'cancelled'
);

CREATE TYPE job_card_status AS ENUM (
  'pending', 'in_progress', 'completed', 'cancelled'
);

CREATE TYPE production_order_status AS ENUM (
  'planned', 'in_progress', 'completed', 'cancelled'
);

CREATE TYPE delivery_status AS ENUM (
  'draft', 'packed', 'shipped', 'delivered', 'cancelled'
);

-- 1. Quotations (RFQ / Quote)
-- ================================================================

CREATE TABLE quotations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number  TEXT UNIQUE NOT NULL,
  customer_id   UUID NOT NULL REFERENCES customers(id),
  quote_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until   DATE,
  status        selling_status NOT NULL DEFAULT 'draft',
  subtotal      DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount_pct  DECIMAL(5,2) DEFAULT 0,
  tax_amount    DECIMAL(12,2) NOT NULL DEFAULT 0,
  total         DECIMAL(12,2) NOT NULL DEFAULT 0,
  notes         TEXT,
  created_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quotation_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id  UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id),
  description   TEXT,
  quantity      DECIMAL(12,3) NOT NULL DEFAULT 1,
  unit_price    DECIMAL(12,2) NOT NULL,
  discount_pct  DECIMAL(5,2) DEFAULT 0,
  tax_rate_pct  DECIMAL(5,2) DEFAULT 0,
  line_total    DECIMAL(12,2) NOT NULL DEFAULT 0,
  sort_order    INT DEFAULT 0
);

-- 2. Sales Orders
-- ================================================================

CREATE TABLE sales_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT UNIQUE NOT NULL,
  customer_id     UUID NOT NULL REFERENCES customers(id),
  quotation_id    UUID REFERENCES quotations(id),
  order_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_date   DATE,
  status          order_status NOT NULL DEFAULT 'draft',
  subtotal        DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount_pct    DECIMAL(5,2) DEFAULT 0,
  tax_amount      DECIMAL(12,2) NOT NULL DEFAULT 0,
  total           DECIMAL(12,2) NOT NULL DEFAULT 0,
  notes           TEXT,
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sales_order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_order_id  UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id),
  description     TEXT,
  quantity        DECIMAL(12,3) NOT NULL DEFAULT 1,
  delivered_qty   DECIMAL(12,3) NOT NULL DEFAULT 0,
  unit_price      DECIMAL(12,2) NOT NULL,
  discount_pct    DECIMAL(5,2) DEFAULT 0,
  tax_rate_pct    DECIMAL(5,2) DEFAULT 0,
  line_total      DECIMAL(12,2) NOT NULL DEFAULT 0,
  sort_order      INT DEFAULT 0
);

-- 3. Job Cards (internal work orders from sales)
-- ================================================================

CREATE TABLE job_cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_card_number TEXT UNIQUE NOT NULL,
  sales_order_id  UUID NOT NULL REFERENCES sales_orders(id),
  product_id      UUID NOT NULL REFERENCES products(id),
  quantity        DECIMAL(12,3) NOT NULL,
  status          job_card_status NOT NULL DEFAULT 'pending',
  assigned_to     UUID REFERENCES auth.users(id),
  due_date        DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Production Orders (manufacturing run)
-- ================================================================

CREATE TABLE production_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number       TEXT UNIQUE NOT NULL,
  job_card_id     UUID REFERENCES job_cards(id),
  product_id      UUID NOT NULL REFERENCES products(id),
  planned_qty     DECIMAL(12,3) NOT NULL,
  produced_qty    DECIMAL(12,3) NOT NULL DEFAULT 0,
  start_date      DATE,
  end_date        DATE,
  status          production_order_status NOT NULL DEFAULT 'planned',
  notes           TEXT,
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Delivery Notes (dispatch / challan)
-- ================================================================

CREATE TABLE delivery_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dn_number       TEXT UNIQUE NOT NULL,
  sales_order_id  UUID NOT NULL REFERENCES sales_orders(id),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  delivery_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  status          delivery_status NOT NULL DEFAULT 'draft',
  notes           TEXT,
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE delivery_note_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_note_id  UUID NOT NULL REFERENCES delivery_notes(id) ON DELETE CASCADE,
  product_id        UUID NOT NULL REFERENCES products(id),
  quantity          DECIMAL(12,3) NOT NULL,
  remarks           TEXT,
  sort_order        INT DEFAULT 0
);

-- ================================================================
-- Indexes
-- ================================================================

CREATE INDEX idx_quotations_customer ON quotations(customer_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotation_items_quotation ON quotation_items(quotation_id);
CREATE INDEX idx_sales_orders_customer ON sales_orders(customer_id);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_so_items_order ON sales_order_items(sales_order_id);
CREATE INDEX idx_job_cards_so ON job_cards(sales_order_id);
CREATE INDEX idx_job_cards_status ON job_cards(status);
CREATE INDEX idx_production_orders_job_card ON production_orders(job_card_id);
CREATE INDEX idx_production_orders_status ON production_orders(status);
CREATE INDEX idx_delivery_notes_so ON delivery_notes(sales_order_id);
CREATE INDEX idx_delivery_notes_status ON delivery_notes(status);
CREATE INDEX idx_dn_items_dn ON delivery_note_items(delivery_note_id);

-- ================================================================
-- Row Level Security
-- ================================================================

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_note_items ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read/write selling tables
CREATE POLICY "authenticated_all" ON quotations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON quotation_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON sales_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON sales_order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON job_cards FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON production_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON delivery_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON delivery_note_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ================================================================
-- Grants
-- ================================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
