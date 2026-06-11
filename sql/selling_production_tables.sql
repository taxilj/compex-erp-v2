-- Selling + Production tables for Compex ERP

-- 1. QUOTATIONS
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT UNIQUE,
  customer_id BIGINT REFERENCES customers(id),
  quote_date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  status TEXT DEFAULT 'Draft',
  subtotal DECIMAL(12,2) DEFAULT 0,
  gst_amount DECIMAL(12,2) DEFAULT 0,
  grand_total DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  company_id BIGINT REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read quotations" ON quotations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert quotations" ON quotations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update quotations" ON quotations FOR UPDATE USING (auth.role() = 'authenticated');
GRANT ALL ON quotations TO service_role;

CREATE TABLE quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  item_id BIGINT REFERENCES items(id),
  description TEXT,
  quantity DECIMAL(12,2) DEFAULT 1,
  rate DECIMAL(12,2) DEFAULT 0,
  amount DECIMAL(12,2) GENERATED ALWAYS AS (quantity * rate) STORED
);

ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read quotation_items" ON quotation_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert quotation_items" ON quotation_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
GRANT ALL ON quotation_items TO service_role;

CREATE INDEX idx_quotations_customer ON quotations(customer_id);
CREATE INDEX idx_quotations_company ON quotations(company_id);
CREATE INDEX idx_quotation_items_quote ON quotation_items(quotation_id);

-- 2. SALES ORDERS
CREATE TABLE sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  so_number TEXT UNIQUE,
  quotation_id UUID REFERENCES quotations(id),
  customer_id BIGINT REFERENCES customers(id),
  order_date DATE DEFAULT CURRENT_DATE,
  delivery_date DATE,
  status TEXT DEFAULT 'Draft',
  subtotal DECIMAL(12,2) DEFAULT 0,
  gst_amount DECIMAL(12,2) DEFAULT 0,
  grand_total DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  company_id BIGINT REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read sales_orders" ON sales_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert sales_orders" ON sales_orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update sales_orders" ON sales_orders FOR UPDATE USING (auth.role() = 'authenticated');
GRANT ALL ON sales_orders TO service_role;

CREATE TABLE so_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  so_id UUID REFERENCES sales_orders(id) ON DELETE CASCADE,
  item_id BIGINT REFERENCES items(id),
  description TEXT,
  quantity DECIMAL(12,2) DEFAULT 1,
  rate DECIMAL(12,2) DEFAULT 0,
  amount DECIMAL(12,2) GENERATED ALWAYS AS (quantity * rate) STORED
);

ALTER TABLE so_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read so_items" ON so_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert so_items" ON so_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
GRANT ALL ON so_items TO service_role;

CREATE INDEX idx_so_customer ON sales_orders(customer_id);
CREATE INDEX idx_so_quotation ON sales_orders(quotation_id);
CREATE INDEX idx_so_company ON sales_orders(company_id);
CREATE INDEX idx_so_items_so ON so_items(so_id);

-- 3. DELIVERY NOTES
CREATE TABLE delivery_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dn_number TEXT UNIQUE,
  so_id UUID REFERENCES sales_orders(id),
  customer_id BIGINT REFERENCES customers(id),
  delivery_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Draft',
  notes TEXT,
  company_id BIGINT REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE delivery_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read delivery_notes" ON delivery_notes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert delivery_notes" ON delivery_notes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update delivery_notes" ON delivery_notes FOR UPDATE USING (auth.role() = 'authenticated');
GRANT ALL ON delivery_notes TO service_role;

CREATE TABLE dn_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dn_id UUID REFERENCES delivery_notes(id) ON DELETE CASCADE,
  so_item_id UUID REFERENCES so_items(id),
  item_id BIGINT REFERENCES items(id),
  quantity DECIMAL(12,2) DEFAULT 0,
  remarks TEXT
);

ALTER TABLE dn_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read dn_items" ON dn_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert dn_items" ON dn_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
GRANT ALL ON dn_items TO service_role;

CREATE INDEX idx_dn_so ON delivery_notes(so_id);
CREATE INDEX idx_dn_customer ON delivery_notes(customer_id);
CREATE INDEX idx_dn_company ON delivery_notes(company_id);
CREATE INDEX idx_dn_items_dn ON dn_items(dn_id);

-- 4. PRODUCTION ORDERS
CREATE TABLE production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE,
  bom_header_id BIGINT REFERENCES bom_headers(id),
  item_id BIGINT REFERENCES items(id),
  planned_qty DECIMAL(12,2) DEFAULT 0,
  produced_qty DECIMAL(12,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'Planned',
  notes TEXT,
  company_id BIGINT REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read production_orders" ON production_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert production_orders" ON production_orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update production_orders" ON production_orders FOR UPDATE USING (auth.role() = 'authenticated');
GRANT ALL ON production_orders TO service_role;

CREATE INDEX idx_po_bom ON production_orders(bom_header_id);
CREATE INDEX idx_po_item ON production_orders(item_id);
CREATE INDEX idx_po_company ON production_orders(company_id);
