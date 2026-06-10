CREATE TABLE IF NOT EXISTS bom_headers (
  id BIGSERIAL PRIMARY KEY,
  finished_item_id BIGINT NOT NULL REFERENCES items(id),
  quantity DECIMAL(12,2) DEFAULT 1,
  notes TEXT,
  company_id BIGINT REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bom_items (
  id BIGSERIAL PRIMARY KEY,
  bom_header_id BIGINT NOT NULL REFERENCES bom_headers(id) ON DELETE CASCADE,
  component_item_id BIGINT NOT NULL REFERENCES items(id),
  component_qty DECIMAL(12,2) NOT NULL DEFAULT 1,
  component_unit TEXT DEFAULT 'pcs',
  scrap_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bom_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bom_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read bom_headers" ON bom_headers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert bom_headers" ON bom_headers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update bom_headers" ON bom_headers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete bom_headers" ON bom_headers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read bom_items" ON bom_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert bom_items" ON bom_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update bom_items" ON bom_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete bom_items" ON bom_items FOR DELETE USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_bom_headers_finished_item ON bom_headers(finished_item_id);
CREATE INDEX IF NOT EXISTS idx_bom_headers_company ON bom_headers(company_id);
CREATE INDEX IF NOT EXISTS idx_bom_items_header ON bom_items(bom_header_id);
CREATE INDEX IF NOT EXISTS idx_bom_items_component ON bom_items(component_item_id);
