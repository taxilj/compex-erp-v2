-- Compex ERP Seed Data

-- Company
INSERT INTO companies (id, name, address, city, state, gst, phone, email)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Compex Solution',
  'GIDC Phase 2, Gandhinagar',
  'Gandhinagar',
  'Gujarat',
  '24ABCDE1234F1Z5',
  '+91-79-23250000',
  'info@compex.in'
);

-- Warehouses
INSERT INTO warehouses (id, name, code, location, company_id) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Main Store', 'MAIN', 'Ground Floor', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000002', 'Raw Material', 'RAW', 'Section A', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000003', 'Work In Progress', 'WIP', 'Production Floor', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000004', 'Finished Goods', 'FG', 'Section B', 'a0000000-0000-0000-0000-000000000001');

-- Items
INSERT INTO items (id, name, sku, description, unit, rate, hsn, category, company_id) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Resistor 10K', 'RES-10K', 'Carbon Film Resistor 10K Ohm 1/4W', 'pcs', 2.00, '853321', 'Components', 'a0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000002', 'Capacitor 100uF', 'CAP-100U', 'Electrolytic Capacitor 100uF 25V', 'pcs', 8.00, '853222', 'Components', 'a0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000003', 'PCB Board 2-Layer', 'PCB-2L', 'Double Layer PCB Board 100x80mm', 'pcs', 150.00, '853400', 'PCB', 'a0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000004', 'Assembled Controller Board', 'ASM-CTRL-01', 'Fully Assembled Controller Board with Components', 'pcs', 2500.00, '854231', 'Assemblies', 'a0000000-0000-0000-0000-000000000001');

-- Stock
INSERT INTO stock_bin (item_id, warehouse_id, quantity, rate) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 10000, 2.00),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 5000, 8.00),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 500, 150.00),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 100, 2500.00);

-- Suppliers
INSERT INTO suppliers (id, name, contact_person, phone, email, city, state, gst, company_id) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Gandhinagar Components Pvt Ltd', 'Rakesh Shah', '+91-79-12345678', 'rakesh@gandhinagarcomp.in', 'Gandhinagar', 'Gujarat', '24FGHI1234J1K5', 'a0000000-0000-0000-0000-000000000001'),
  ('d0000000-0000-0000-0000-000000000002', 'Surat Electronics Supply', 'Mitesh Patel', '+91-261-87654321', 'mitesh@suratelec.in', 'Surat', 'Gujarat', '24JKLM5678N1P5', 'a0000000-0000-0000-0000-000000000001');

-- Customers
INSERT INTO customers (id, name, contact_person, phone, email, city, state, gst, company_id) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Rajkot Automation Ltd', 'Dinesh Kothari', '+91-281-1111111', 'dinesh@rajkotauto.in', 'Rajkot', 'Gujarat', '24PQRS9012T1U5', 'a0000000-0000-0000-0000-000000000001'),
  ('e0000000-0000-0000-0000-000000000002', 'Vadodara Devices Pvt Ltd', 'Priya Mehta', '+91-265-2222222', 'priya@vadodaradevices.in', 'Vadodara', 'Gujarat', '24VWXY3456Z1A7', 'a0000000-0000-0000-0000-000000000001');

-- Sales Invoice
INSERT INTO sales_invoices (id, invoice_number, customer_id, invoice_date, due_date, status, subtotal, gst_amount, grand_total, notes, company_id)
VALUES (
  'f0000000-0000-0000-0000-000000000001',
  'INV-2026-001',
  'e0000000-0000-0000-0000-000000000001',
  '2026-06-01',
  '2026-06-30',
  'Unpaid',
  42372.88,
  7627.12,
  50000.00,
  'Assembled Controller Boards - 20 units',
  'a0000000-0000-0000-0000-000000000001'
);

INSERT INTO invoice_items (invoice_id, item_id, description, quantity, rate, amount, gst_rate)
VALUES (
  'f0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000004',
  'Assembled Controller Board',
  20, 2500.00, 50000.00, 18
);

-- GL Entry for the invoice
INSERT INTO gl_entries (entry_date, account_name, debit, credit, description, reference_type, reference_id, company_id)
VALUES
  ('2026-06-01', 'Accounts Receivable', 50000.00, 0, 'Invoice INV-2026-001 - Rajkot Automation Ltd', 'SalesInvoice', 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001'),
  ('2026-06-01', 'Sales Revenue', 0, 42372.88, 'Invoice INV-2026-001 - Revenue', 'SalesInvoice', 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001'),
  ('2026-06-01', 'GST Output', 0, 7627.12, 'Invoice INV-2026-001 - GST 18%', 'SalesInvoice', 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001');
