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

connection.query("SELECT * FROM products", function (error, results) {
	if (error) throw error;
	//ids, names, and prices of products for sale.
	for (let i = 0; i < results.length; i++) {
		console.log(
			" ID: " + results[i].item_id +
			" || Product: " + results[i].product_name +
			" || Price: $" + results[i].price +
			"\n"
		);
	}
	first_choice();

});

function first_choice() {
	inquirer.prompt(
		{
			name: "choices",
			type: "list",
			message: "What would you like to do?",
			choices: ["Select a product to buy", "Exit"]
		}
	).then(function (answer) {
		if (answer.choices === "Exit")
			connection.end();
		else
			select_product();
	})
}

//ID of the product they would like to buy.
function select_product() {
	var product;
	inquirer.prompt({
		name: "item_id",
		type: "input",
		message: "Enter the product ID of the product you would like to purchase.",
		validate: function (value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false;
		}
	}).then(function (answer) {
		if (answer.exit)
			connection.end()
		else {
			console.log("answer + " + JSON.stringify(answer) + "type: " + typeof (answer.item_id));
			// if(answer.item_id)
			product = answer.item_id;
			how_many(product);
		}

	})
	return product;
}

function back_to_menu() {
	inquirer.prompt({
		name: "main",
		type: "confirm",
		message: "Would you like to return to the main menu?"
	}).then(function (answer) {
		if (answer.main)
			first_choice();
		else
			connection.end();
	})

}

//how many units of the product they would like to buy
function how_many(item_id) {
	var quantity;
	inquirer.prompt({
		name: "how_much",
		type: "input",
		message: "Enter the amount that you would like to purchase.",
		validate: function (value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false;
		}
	}).then(function (answer) {
		quantity = answer.how_much;
		console.log("quantity: " + quantity);
		stock(item_id, quantity)
	})
	return quantity;
}
//check if your store has enough of the product 
function stock(item_id, quantity) {

	var query = "SELECT item_id,stock_quantity FROM products WHERE ?";
	connection.query(query, { item_id: item_id }, function (error, results) {
		if (error) throw error;
		console.log(JSON.stringify(results) + "stock results at item_id");
		var stock = parseInt(results[0].stock_quantity);
		console.log("stock: " + stock + typeof (stock));
		quantity = parseInt(quantity);
		console.log("quantity " + typeof (quantity));
		if (results[0].stock_quantity >= quantity) {
			stock = stock - quantity;
			console.log("new quantity " + quantity);
			purchase(item_id, stock, quantity);
		}
		else
			console.log("Insufficient quantity!");
	});
}
//store does have enough of the product, you should fulfill the customer's order.
function purchase(item_id, stock, quantity) {
	var query = "UPDATE products SET ? WHERE ?";
	connection.query(query, [
		{
			stock_quantity: stock
		},
		{
			item_id: item_id
		}
	], function (error, results) {
		if (error) throw error;
		console.log(JSON.stringify(results) + "purchase");
		console.log("quantity in purchase func " + quantity + typeof (quantity));
		console.log(results.affectedRows + "rows affected");
		priceCalculate(item_id, quantity);

	})
}

function priceCalculate(item_id, quantity) {
	var query = "SELECT * FROM products WHERE ?";
	connection.query(query, { item_id: item_id }, function (error, results) {
		if (error) throw error;
		var cost = results[0].price * quantity;
		console.log("Total price is " + cost);
		back_to_menu();
	});

}

