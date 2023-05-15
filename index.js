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
      if (res.prompt === "View All Roles") {
        viewRoles();
      }
      if (res.prompt === "Add Role") {
        addRole();
      }
      if (res.prompt === "View All Departments") {
        viewDepartments();
      }
      if (res.prompt === "Add Department") {
        addDepartment();
      }
      if (res.prompt === "Update Role") {
        updateRole();
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
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    promptMainMenu();
  });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is this roles title?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is this roles salary?",
      },
    ])
    .then((res) => {
      connection.query("INSERT INTO role SET ?", {
        title: res.title,
        salary: res.salary,
      });
      console.log("This role was added to the role table.");
    });
};

const viewDepartments = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    promptMainMenu();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: "What is this department's name?",
      },
    ])
    .then((res) => {
      connection.query("INSERT INTO department SET ?", {
        department_name: res.department_name,
      });
      console.log("This department was added to the department table.");
    });
};

const updateRole = () => {
  const employeeSql = `SELECT * FROM employee`;
  connection.query(employeeSql, (err, data) => {
    if (err) throw err;

    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to update?",
          choices: employees,
        },
      ])
      .then((res) => {
        const employee = res.name;
        const params = [];
        params.push(employee);
        connection.query("SELECT * FROM role", (err, data) => {
          if (err) throw err;
          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What is the employee's new role?",
                choices: roles,
              },
            ])
            .then((res) => {
              const role = res.role;
              params.push(role);
              let employee = params[0];
              params[0] = role;
              params[1] = employee;
              connection.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                params,
                (err, result) => {
                  if (err) throw err;
                  console.log("Employee has been updated!");

                  promptMainMenu();
                }
              );
            });
        });
      });
  });
};
