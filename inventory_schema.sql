-- Create the inventory_items table
CREATE TABLE inventory_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INT NOT NULL CHECK (quantity >= 0),
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    room VARCHAR(255) NOT NULL
);

-- Insert initial data into the inventory_items table
INSERT INTO inventory_items (name, description, quantity, origin, destination, room) VALUES
('Queen Bed', 'A comfortable queen-sized bed', 1, 'Main Bedroom', 'New House', 'mainBedroom'),
('Wardrobe', 'A spacious wardrobe', 1, 'Main Bedroom', 'New House', 'mainBedroom'),
('Twin Bed', 'A twin-sized bed', 2, 'First Bedroom', 'New House', 'firstBedroom'),
('Desk', 'A study desk', 1, 'First Bedroom', 'New House', 'firstBedroom'),
('Full Bed', 'A full-sized bed', 1, 'Second Bedroom', 'New House', 'secondBedroom'),
('Bookshelf', 'A bookshelf for books', 1, 'Second Bedroom', 'New House', 'secondBedroom'),
('Dining Table', 'A dining table', 1, 'Dining Room', 'New House', 'diningRoom'),
('Chairs', 'Dining chairs', 2, 'Dining Room', 'New House', 'diningRoom'),
('Sofa', 'A comfortable sofa', 1, 'Living Room', 'New House', 'livingRoom'),
('Coffee Table', 'A coffee table', 1, 'Living Room', 'New House', 'livingRoom'),
('Microwave', 'A microwave oven', 1, 'Kitchen', 'New House', 'kitchen'),
('Refrigerator', 'A refrigerator', 1, 'Kitchen', 'New House', 'kitchen'),
('Tools', 'Various tools', 1, 'Garage', 'New House', 'garage'),
('Bicycle', 'A bicycle', 1, 'Garage', 'New House', 'garage');