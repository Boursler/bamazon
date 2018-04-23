-- item_id (unique id for each product)
-- product_name (Name of product)
-- department_name
-- price (cost to customer)
-- stock_quantity (how much of the product is available in stores)
USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('sandals', 'footwear', 5.00, 50),
('It', 'publications', 12.00, 100),
('Snowshoes', 'footwear', 30.00, 4),
('Cosmopolitan', 'publications', 3.50, 10),
('Cake', 'grocery', 10.00, 50),
('Cabbage', 'grocery', 0.49, 500),
('Avocado', 'grocery', 1.00, 2),
('Frankenstein', 'publications', 10.00, 20),
('Dreamcatcher', 'publications', 11.00, 5),
('water', 'grocery', 0.97, 25),
('Halo', 'pets', 15.00, 15),
('Puppies', 'pets', 350.00, 10),
('Kittens', 'pets', 200.00, 15),
('collars', 'pets', 8.00, 12)
