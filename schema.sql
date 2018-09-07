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

