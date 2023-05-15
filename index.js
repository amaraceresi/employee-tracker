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
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "prompt",
      choices: [
        "View All Employees",
        "Add Employee",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Update Role",
      ],
    })
    .then((res) => {
      if (res.prompt === "View All Employees") {
        viewEmployees();
      }
      if (res.prompt === "Add Employee") {
        addEmployees();
      }
      if(res.prompt === "View All Roles") {
        viewRoles()
      }


      if(res.prompt === "View All Departments") {
        viewDepartments()
      }
    });
}

const viewEmployees = () => {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    promptMainMenu();
  });
};

const addEmployees = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is their first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is their last name?",
      },
      {
        type: "input",
        name: "role_id",
        message: "What is their role ID?",
      },
      {
        type: "input",
        name: "manager_id",
        message: "What is their manager's ID?",
      },
    ])
    .then((res) => {
      connection.query("INSERT INTO employee SET ?", {
        first_name: res.first_name,
        last_name: res.last_name,
        role_id: res.role_id,
        manager_id: res.manager_id,
      });
      console.log("This employee was added to the employee table.");
      promptMainMenu();
    });
};

const viewRoles = () => {
  connection.query("SELECT * FROM role", function(err,res) {
    if(err) throw err
    console.table(res)
    promptMainMenu()
  })
}




const viewDepartments = () => {
  connection.query("SELECT * FROM department", function(err,res) {
    if(err) throw err
    console.table(res)
    promptMainMenu()
  })
}
