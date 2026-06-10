-- Material Requests + GRN tables for Compex ERP

-- 1. MATERIAL REQUESTS
CREATE TABLE material_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mr_number TEXT UNIQUE,
  supplier_id BIGINT REFERENCES suppliers(id),
  request_date DATE DEFAULT CURRENT_DATE,
  expected_date DATE,
  status TEXT DEFAULT 'Draft',
  notes TEXT,
  company_id BIGINT REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE material_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read material_requests" ON material_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert material_requests" ON material_requests FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update material_requests" ON material_requests FOR UPDATE USING (auth.role() = 'authenticated');
GRANT ALL ON material_requests TO service_role;

CREATE TABLE mr_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mr_id UUID REFERENCES material_requests(id) ON DELETE CASCADE,
  item_id BIGINT REFERENCES items(id),
  quantity DECIMAL(12,2) DEFAULT 0,
  remarks TEXT
);

ALTER TABLE mr_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read mr_items" ON mr_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert mr_items" ON mr_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
GRANT ALL ON mr_items TO service_role;

CREATE INDEX idx_mr_supplier ON material_requests(supplier_id);
CREATE INDEX idx_mr_company ON material_requests(company_id);
CREATE INDEX idx_mr_items_mr ON mr_items(mr_id);

-- 2. GOODS RECEIPT NOTES (GRN)
CREATE TABLE grn (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grn_number TEXT UNIQUE,
  po_id BIGINT REFERENCES purchase_orders(id),
  supplier_id BIGINT REFERENCES suppliers(id),
  received_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Draft',
  notes TEXT,
  company_id BIGINT REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE grn ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read grn" ON grn FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert grn" ON grn FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update grn" ON grn FOR UPDATE USING (auth.role() = 'authenticated');
GRANT ALL ON grn TO service_role;

CREATE TABLE grn_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grn_id UUID REFERENCES grn(id) ON DELETE CASCADE,
  item_id BIGINT REFERENCES items(id),
  ordered_qty DECIMAL(12,2) DEFAULT 0,
  received_qty DECIMAL(12,2) DEFAULT 0,
  accepted_qty DECIMAL(12,2) DEFAULT 0,
  rejected_qty DECIMAL(12,2) DEFAULT 0,
  remarks TEXT
);

ALTER TABLE grn_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read grn_items" ON grn_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert grn_items" ON grn_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
GRANT ALL ON grn_items TO service_role;

CREATE INDEX idx_grn_po ON grn(po_id);
CREATE INDEX idx_grn_supplier ON grn(supplier_id);
CREATE INDEX idx_grn_company ON grn(company_id);
CREATE INDEX idx_grn_items_grn ON grn_items(grn_id);
