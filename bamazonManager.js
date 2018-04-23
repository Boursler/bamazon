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
//View Low Inventory
//Add to Inventory
//Add New Product
