
// vars 

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "chertanovo421",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected as id: " + connection.threadId);
  manager();
});

// functions

function manager() {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "Manager Inventory System",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.menu) {
      case "View Products for Sale":
        showInventory();
        break;

      case "View Low Inventory":
        lowInventory();
        break;
      
      case "Add to Inventory":
        stockRequest();
        break;

      case "Add New Product":
        newProduct();
        break;
      }
    });
};

function showInventory() {
  console.log("Retrieving full inventory...");
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      var priceVal = parseFloat(res[i].price).toFixed(2);
      console.log(`ID: ${res[i].item_id} | ${res[i].product_name} | ${res[i].department_name} | ${priceVal} | ${res[i].stock_quantity}`);
    }
    console.log("----------------------------------\n");
    manager();
  });
}

function lowInventory() {
  console.log("Retrieving inventory of items with less than 5 in stock...");
  var query = "SELECT * FROM products WHERE stock_quantity < 5";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      var priceVal = parseFloat(res[i].price).toFixed(2);
      console.log(`ID: ${res[i].item_id} | ${res[i].product_name} | ${res[i].department_name} | ${priceVal} | ${res[i].stock_quantity}`);
    }
    console.log("----------------------------------\n");
    manager();
  });
}

function stockRequest() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      var priceVal = parseFloat(res[i].price).toFixed(2);
      console.log(`ID: ${res[i].item_id} | ${res[i].product_name} | ${res[i].department_name} | ${priceVal} | ${res[i].stock_quantity}`);
    }
    console.log("----------------------------------\n");
    restock();
  });
}

function restock() {
  inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "Enter the ID of the product you would like to restock."
      },
      {
        name: "quant",
        type: "input",
        message: "How many items do you want to add?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?"
      connection.query(query, [answer.quant, {item_id: answer.product}], function(err) {
        if (err) throw err;
        console.log("Updated inventory!\n");
        manager();
      });
    });
}

function newProduct() {
  inquirer
    .prompt([
      {
        name: "new",
        type: "input",
        message: "Enter the name of the product you would like add."
      },
      {
        name: "department",
        type: "list",
        message: "Select the department of the new product.",
        choices: [
          "Food",
          "Beverages",
          "Office Supplies",
          "Pet Supplies",
          "Computers",
          "Movies",
          "Misc"
        ]
      },
      {
        name: "price",
        type: "input",
        message: "Enter the item's price per unit.",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quant",
        type: "input",
        message: "Enter the number of items to be added for this product.",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var product = answer.new;
      var dept = answer.department;
      var price = parseFloat(answer.price);
      var quant = answer.quant;

      var query = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('${product}', '${dept}', '${price}', '${quant}')`;
      connection.query(query, function(err) {
        if (err) throw err;
        console.log("Updated inventory!\n");
        manager();
      });
    });
}