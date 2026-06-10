-- Compex ERP Schema
-- Run this in Supabase SQL Editor

-- 1. COMPANIES
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  gst TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read companies" ON companies FOR SELECT USING (auth.role() = 'authenticated');

-- 2. WAREHOUSES
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  location TEXT,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read warehouses" ON warehouses FOR SELECT USING (auth.role() = 'authenticated');

-- 3. ITEMS
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  description TEXT,
  unit TEXT DEFAULT 'pcs',
  rate DECIMAL(12,2) DEFAULT 0,
  hsn TEXT,
  category TEXT,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read items" ON items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert items" ON items FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. STOCK BIN
CREATE TABLE stock_bin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) NOT NULL,
  warehouse_id UUID REFERENCES warehouses(id) NOT NULL,
  quantity DECIMAL(12,2) DEFAULT 0,
  rate DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(item_id, warehouse_id)
);

ALTER TABLE stock_bin ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read stock" ON stock_bin FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert stock" ON stock_bin FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. SUPPLIERS
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  gst TEXT,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read suppliers" ON suppliers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert suppliers" ON suppliers FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6. CUSTOMERS
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  gst TEXT,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read customers" ON customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert customers" ON customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 7. PURCHASE ORDERS
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE,
  supplier_id UUID REFERENCES suppliers(id),
  order_date DATE DEFAULT CURRENT_DATE,
  expected_date DATE,
  status TEXT DEFAULT 'Pending',
  grand_total DECIMAL(14,2) DEFAULT 0,
  notes TEXT,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read purchase_orders" ON purchase_orders FOR SELECT USING (auth.role() = 'authenticated');

CREATE TABLE po_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id),
  quantity DECIMAL(12,2) DEFAULT 0,
  rate DECIMAL(12,2) DEFAULT 0,
  amount DECIMAL(14,2) DEFAULT 0
);

ALTER TABLE po_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read po_items" ON po_items FOR SELECT USING (auth.role() = 'authenticated');

-- 8. SALES INVOICES
CREATE TABLE sales_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE,
  customer_id UUID REFERENCES customers(id),
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT DEFAULT 'Unpaid',
  subtotal DECIMAL(14,2) DEFAULT 0,
  gst_amount DECIMAL(14,2) DEFAULT 0,
  grand_total DECIMAL(14,2) DEFAULT 0,
  notes TEXT,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sales_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read sales_invoices" ON sales_invoices FOR SELECT USING (auth.role() = 'authenticated');

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES sales_invoices(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id),
  description TEXT,
  quantity DECIMAL(12,2) DEFAULT 0,
  rate DECIMAL(12,2) DEFAULT 0,
  amount DECIMAL(14,2) DEFAULT 0,
  gst_rate DECIMAL(5,2) DEFAULT 18
);

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read invoice_items" ON invoice_items FOR SELECT USING (auth.role() = 'authenticated');

-- 9. BOM (Bill of Materials)
CREATE TABLE bom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finished_item_id UUID REFERENCES items(id),
  component_item_id UUID REFERENCES items(id),
  quantity DECIMAL(12,2) DEFAULT 0,
  unit TEXT DEFAULT 'pcs',
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bom ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read bom" ON bom FOR SELECT USING (auth.role() = 'authenticated');

-- 10. GL ENTRIES
CREATE TABLE gl_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE DEFAULT CURRENT_DATE,
  account_name TEXT NOT NULL,
  debit DECIMAL(14,2) DEFAULT 0,
  credit DECIMAL(14,2) DEFAULT 0,
  description TEXT,
  reference_type TEXT,
  reference_id UUID,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE gl_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read gl_entries" ON gl_entries FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_stock_bin_item ON stock_bin(item_id);
CREATE INDEX idx_stock_bin_warehouse ON stock_bin(warehouse_id);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_invoice_customer ON sales_invoices(customer_id);
CREATE INDEX idx_gl_company ON gl_entries(company_id);
CREATE INDEX idx_gl_date ON gl_entries(entry_date);
