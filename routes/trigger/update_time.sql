-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS set_added_time ON products;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS update_added_time;

-- Create the function with the correct time zone
CREATE OR REPLACE FUNCTION update_added_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.added_date = (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') AT TIME ZONE 'Africa/Nairobi';  -- Convert to Nairobi time
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger with the new function
CREATE TRIGGER set_added_time
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_added_time();
