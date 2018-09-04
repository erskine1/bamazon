
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
  inventory();
});


// functions

function inventory() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      var priceVal = parseFloat(res[i].price).toFixed(2);
      console.log(`ID: ${res[i].item_id} | ${res[i].product_name} | $${priceVal}`);
    }
    // connection.end();
    customer();
  });
};

function customer() {
  inquirer
    .prompt({
      name: "product",
      type: "input",
      message: "Please enter the ID of the product you would like to buy."
    })
    .then(function(answer) {
      var query = "SELECT * FROM products WHERE ?"
      connection.query(query, {item_id: answer.product}, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          var tag = res[i].item_id;
          var product = res[i].product_name;
          var price = res[i].price;
          var stock = res[i].stock_quantity;

          if (stock === 0) {
            console.log("That item is out of stock. Sorry!\n");
            customer();
          }
          else {
            checkout(tag, product, price, stock);
          }
        }
      });
    });
};

function checkout(tag, product, price, stock) {
  inquirer.prompt({
    name: "checkout",
    type: "input",
    message: `How many units of ${product} would you like to purchase?`,
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }).then(function(answer) {
    var quant = answer.checkout;
    if (quant > stock) {
      console.log("Insufficient quantity.");
      checkout(tag, product, price, stock);
    }
    else {
      fulfill(tag, product, price, stock, quant);
    }
  })
};

function fulfill(tag, product, price, stock, quant) {
  var cost = parseFloat(price * quant).toFixed(2);
  console.log("Please review your order before confirming:\n");
  console.log("Product Name | Quantity | Total Price");
  console.log(`${product}   | ${quant} |  $${cost}`);
  inquirer.prompt({
    name: "confirm",
    type: "confirm",
    message: "Would you like to place your order?"
  }).then(function(answer) {
    if (!answer.confirm) {
      console.log("\nMaybe next time!");
      connection.end();
    }
    else if (answer.confirm) {
      console.log("\nPlacing your order...");
      var newStock = stock - quant;
      var query = "UPDATE products SET ? WHERE ?";
      connection.query(query, [{stock_quantity: newStock}, {item_id: tag}], function(err) {
        if (err) throw err;
        console.log("Your order has been placed. Thanks for shopping with us.\n");
        inventory();
      });
    }
  });
};

