CREATE TABLE vendor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Source tracking
    source TEXT NOT NULL CHECK (source IN ('tradeindia', 'indiamart', 'justdial', 'manual', 'import', 'api')),
    source_url TEXT,
    external_id TEXT,
    scraped_at TIMESTAMPTZ,

    -- Company identity
    company_name TEXT NOT NULL,
    trade_name TEXT,
    legal_name TEXT,
    gstin TEXT,
    pan TEXT,
    registration_type TEXT CHECK (registration_type IN ('regular', 'composition', 'unregistered', 'unknown')),
    msme_registered BOOLEAN DEFAULT false,
    msme_number TEXT,
    year_of_establishment INTEGER,

    -- Contact
    contact_person TEXT,
    designation TEXT,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    website TEXT,

    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    district TEXT,
    state TEXT,
    pincode TEXT,
    country TEXT DEFAULT 'India',

    -- Business info
    business_type TEXT,
    product_categories TEXT[],
    keywords TEXT[],
    employee_count INTEGER,
    annual_turnover DECIMAL(14,2),

    -- Classification
    tags TEXT[],
    category TEXT CHECK (category IN ('products', 'services', 'both')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'blacklisted', 'duplicate')),

    -- Validation & enrichment
    validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'rejected', 'enriched')),
    validation_errors JSONB DEFAULT '[]',
    validation_score INTEGER DEFAULT 0,
    enrichment_data JSONB,
    matched_supplier_id BIGINT REFERENCES suppliers(id),

    -- Raw data
    raw_data JSONB,
    raw_data_hash TEXT,

    -- Audit
    notes TEXT,
    company_id BIGINT REFERENCES companies(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,

    -- Full-text search vector (maintained by trigger)
    search_vector tsvector
);

-- Status & filter indexes
CREATE INDEX idx_vendor_profiles_status ON vendor_profiles(status);
CREATE INDEX idx_vendor_profiles_validation_status ON vendor_profiles(validation_status);
CREATE INDEX idx_vendor_profiles_source ON vendor_profiles(source);
CREATE INDEX idx_vendor_profiles_city ON vendor_profiles(city);
CREATE INDEX idx_vendor_profiles_state ON vendor_profiles(state);
CREATE INDEX idx_vendor_profiles_created_at ON vendor_profiles(created_at DESC);
CREATE INDEX idx_vendor_profiles_company ON vendor_profiles(company_id);

-- Lookup indexes
CREATE INDEX idx_vendor_profiles_gstin ON vendor_profiles(gstin) WHERE gstin IS NOT NULL;
CREATE INDEX idx_vendor_profiles_pan ON vendor_profiles(pan) WHERE pan IS NOT NULL;
CREATE INDEX idx_vendor_profiles_matched_supplier ON vendor_profiles(matched_supplier_id) WHERE matched_supplier_id IS NOT NULL;
CREATE UNIQUE INDEX idx_vendor_profiles_raw_hash ON vendor_profiles(raw_data_hash) WHERE raw_data_hash IS NOT NULL;

-- Full-text search index
CREATE INDEX idx_vendor_profiles_search ON vendor_profiles USING GIN(search_vector);

-- Array indexes for filtering
CREATE INDEX idx_vendor_profiles_product_categories ON vendor_profiles USING GIN(product_categories);
CREATE INDEX idx_vendor_profiles_tags ON vendor_profiles USING GIN(tags);
CREATE INDEX idx_vendor_profiles_keywords ON vendor_profiles USING GIN(keywords);

-- Row Level Security
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated can read vendor_profiles"
    ON vendor_profiles FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated can insert vendor_profiles"
    ON vendor_profiles FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated can update vendor_profiles"
    ON vendor_profiles FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated can delete vendor_profiles"
    ON vendor_profiles FOR DELETE
    USING (auth.role() = 'authenticated');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vendor_profiles_updated_at
    BEFORE UPDATE ON vendor_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Search vector refresh on insert/update
CREATE OR REPLACE FUNCTION refresh_vendor_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector = to_tsvector('english',
        coalesce(NEW.company_name, '') || ' ' ||
        coalesce(NEW.trade_name, '') || ' ' ||
        coalesce(NEW.legal_name, '') || ' ' ||
        coalesce(NEW.gstin, '') || ' ' ||
        coalesce(NEW.city, '') || ' ' ||
        coalesce(NEW.state, '') || ' ' ||
        coalesce(NEW.contact_person, '') || ' ' ||
        coalesce(NEW.designation, '') || ' ' ||
        coalesce(NEW.email, '') || ' ' ||
        coalesce(NEW.phone, '') || ' ' ||
        coalesce(NEW.mobile, '') || ' ' ||
        coalesce(array_to_string(NEW.product_categories, ' '), '') || ' ' ||
        coalesce(array_to_string(NEW.keywords, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_vendor_search_vector_trigger
    BEFORE INSERT OR UPDATE OF company_name, trade_name, legal_name, gstin, city, state, contact_person, designation, email, phone, mobile, product_categories, keywords
    ON vendor_profiles
    FOR EACH ROW
    EXECUTE FUNCTION refresh_vendor_search_vector();

-- Full-text search function
CREATE OR REPLACE FUNCTION search_vendors(search_query TEXT, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
    id UUID,
    company_name TEXT,
    gstin TEXT,
    city TEXT,
    state TEXT,
    product_categories TEXT[],
    status TEXT,
    validation_status TEXT,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        vp.id,
        vp.company_name,
        vp.gstin,
        vp.city,
        vp.state,
        vp.product_categories,
        vp.status,
        vp.validation_status,
        ts_rank(vp.search_vector, websearch_to_tsquery('english', search_query))::REAL AS relevance
    FROM vendor_profiles vp
    WHERE vp.search_vector @@ websearch_to_tsquery('english', search_query)
        AND vp.is_deleted = false
        AND vp.status != 'duplicate'
    ORDER BY relevance DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant access
GRANT ALL ON vendor_profiles TO authenticated;
GRANT ALL ON vendor_profiles TO service_role;
GRANT EXECUTE ON FUNCTION search_vendors TO authenticated;
GRANT EXECUTE ON FUNCTION search_vendors TO service_role;
