DROP FUNCTION IF EXISTS calculate_total_sales_by_product(integer);

CREATE OR REPLACE FUNCTION calculate_total_sales_by_product(p_product_id INTEGER)
RETURNS NUMERIC AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(quantity * cost), 0) 
        FROM products
        WHERE product_id = p_product_id
    );
END;
$$ LANGUAGE plpgsql;
