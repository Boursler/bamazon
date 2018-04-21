CREATE DATABASE bamazon;
USE bamazon;
-- item_id (unique id for each product)
-- product_name (Name of product)
-- department_name
-- price (cost to customer)
-- stock_quantity (how much of the product is available in stores)
CREATE TABLE products (
item_id INTEGER (10) NOT NULL auto_increment,
PRIMARY KEY (item_id),
product_name VARCHAR (255) NULL,
department_name VARCHAR (255) NULL,
price DECIMAL (10,2) NULL,
stock_quantity INTEGER (10) NULL
);



SELECT * FROM products;