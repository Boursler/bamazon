var inquirer = require("inquirer");
var mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: process.env.BAMAZON,
	database: "bamazon"
});
connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
});

//View Products for Sale

function managerChoices() {
	inquirer.prompt({
		name: "option",
		type: "list",
		message: "What would you like to do?",
		choices: [
			"View products for sale",
			"View low inventory",
			"Add to inventory",
			"Add new product",
			"Exit"
		]
	}).then(function (answer) {
		console.log(answer.option);
		switch (answer.option) {
			case "View products for sale":
				view_products();
				break;
			case "View low inventory":
				view_low();
				break;
			case "Add to inventory":
				add_inventory();
				break;
			case "Add new product":
				add_product();
			case "Exit":
				connection.end();
		}
	})

}
function back_to_menu() {
	inquirer.prompt({
		name: "main",
		type: "confirm",
		message: "Would you like to return to the main menu?"
	}).then(function (answer) {
		if (answer.main)
			managerChoices();
		else
			connection.end();
	})

}
managerChoices();
// item IDs, names, prices, and quantities
function view_products() {
	connection.query("SELECT * FROM products", function (error, results) {
		if (error) throw error;
		for (let i = 0; i < results.length; i++) {
			console.log(
				" ID: " + results[i].item_id +
				" || Product: " + results[i].product_name +
				" || Price: $" + results[i].price +
				" || Quantity: " + results[i].stock_quantity +
				"\n"
			);
		}
		back_to_menu();

	});
}
//View Low Inventory
function view_low() {
	var query = "SELECT product_name, stock_quantity FROM products GROUP BY stock_quantity HAVING stock_quantity <= 5";
	connection.query(query, function (error, results) {
		if (error) throw error;
		for (let i = 0; i < results.length; i++) {
			console.log(results[i].product_name + ": " + results[i].stock_quantity + "\n");
		}
		back_to_menu();
	})
}
//Add to Inventory
function add_inventory() {
	inquirer.prompt([
		{
			name: "product",
			type: "input",
			message: "Please enter a Product ID to add more inventory.",
			validate: function (value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		},
		{
			name: "quantity",
			type: "input",
			message: "Please enter the quantity to add to the inventory.",
			validate: function (value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}]).then(function (answers) {
			console.log(answers.quantity + " quantity to add " + typeof (answers.quantity));
			console.log(answers.product + " product " + typeof (answers.product))
			var product = parseInt(answers.product);
			var quantity = parseInt(answers.quantity);
			var stock;
			connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: product }, function (error, results) {
				if (error) throw error;
				stock = results[0].stock_quantity + quantity;
				var query = "UPDATE products SET ? WHERE ?";
				connection.query(query, [
					{
						stock_quantity: stock
					},
					{
						item_id: product
					}
				], function (error, results) {
					if (error) throw error;
					// console.log(results[0].product_name + ": " + results[0].stock_quantity + "\n")
					display_update(product);
					console.log(results);
					// back_to_menu();
				})
			})
		})
}

function display_update(product) {
	var query = "SELECT item_id,product_name,stock_quantity from products WHERE ?";
	connection.query(query, { item_id: product }, function (error, results) {
		if (error) throw error;
		console.log("There are " + results[0].stock_quantity + " units of " + results[0].product_name);
		back_to_menu();
	})
}
//Add New Product: product_name, department_name, price, stock_quantity
function add_product() {
	inquirer.prompt([
		{
			name: "product",
			type: "input",
			message: "Enter product name"
		},
		{
			name: "department",
			type: "input",
			message: "Enter department name"
		},
		{
			name: "price",
			type: "input",
			message: "Enter price in decimal form",
			validate: function (value) {
				var regex = /^\d+(?:\.\d{0,2})$/;
				if (regex.test(value))
					return true;
				else
					return false;
			}
		},
		{
			name: "stock",
			type: "input",
			message: "Enter quantity",
			validate: function (value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}
	]).then(function (answers) {
		var query = "INSERT INTO products SET ?";
		var set = {
			product_name: answers.product,
			department_name: answers.department,
			price: parseInt(answers.price),
			stock_quantity: parseInt(answers.stock)
		}
		connection.query(query, set, function (error, results) {
			if (error) throw error;
			console.log(results.affectedRows + " product added!");
			back_to_menu();
		})
	})
}
