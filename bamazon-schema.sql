DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item_id INTEGER AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(60) NOT NULL,
  department_name VARCHAR(60) NOT NULL,
  price DECIMAL(19,4) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Coca Cola", "Beverages", 2.99, 67), 
  ("Kitty Litter", "Pet Supplies", 10.99, 12),
  ("Computer Monitor", "Computers", 149.99, 5),
  ("The Matrix", "Movies", 14.99, 8),
  ("The Lord of the Rings", "Books", 20, 3),
  ("Salt and Vinegar Chips", "Food", 4.99, 13),
  ("LEGO Star Destroyer", "Toys", 199.99, 2),
  ("Ballpoint Pens", "Office Supplies", 3.70, 10),
  ("Large Empty Box", "Misc", 8, 100),
  ("Small Empty Box", "Misc", 4, 100),
  ("Tiny Boxes", "Misc", 100, 0);

SELECT * FROM products;