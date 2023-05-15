const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "employeeTracker",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database.");

  promptMainMenu();
});

function promptMainMenu() {
  inquirer.prompt({
    type: "list",
    message: "What would you like to do?",
    name: "prompt",
    choices: ["View All Employees", "Add Employee", "View All Roles", "Add Role", "View All Departments", "Add Department", "Update Role"]
  }).then((res) => {
    if(res.prompt === "View All Employees") {
      viewEmployees()
    }
  })
}

const viewEmployees = () => {
  connection.query('SELECT * FROM employee', function(err, res) {
    if(err) throw err
    console.table(res)
    promptMainMenu()
  })
}

