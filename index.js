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
        "View All Departments",
        "View All Roles",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Role",
        "Delete Role",
        "Delete Employee",
        "Delete Department",
      ],
    })
    .then((res) => {
      if (res.prompt === "View All Employees") {
        viewEmployees();
      }
      if (res.prompt === "View All Departments") {
        viewDepartments();
      }
      if (res.prompt === "View All Roles") {
        viewRoles();
      }
      if (res.prompt === "Add Department") {
        addDepartment();
      }
      if (res.prompt === "Add Role") {
        addRole();
      }
      if (res.prompt === "Add Employee") {
        addEmployee();
      }
      if (res.prompt === "Update Role") {
        updateRole();
      }
      if (res.prompt === "Delete Role") {
        deleteRole();
      }
      if (res.prompt === "Delete Employee") {
        deleteEmployee();
      }
      if (res.prompt === "Delete Department") {
        deleteDepartment();
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

const viewDepartments = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
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
      promptMainMenu();
    });
};

const addRole = () => {
  inquirer
  .prompt([
    {
        type: "input",
        name: "title",
        message: "What is this role's title?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is this role's salary?",
      },
      {
        type: "input",
        name: "department_id",
        message: "What is their department ID?",
      },
    ])
    .then((res) => {
      connection.query("INSERT INTO role SET ?", {
        title: res.title,
        salary: res.salary,
        department_id: res.department_id || "",
      });
      console.log("This role was added to the role table.");
      promptMainMenu();
    });
  };
  
  const addEmployee = () => {
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
          type: "list",
          name: "role_id",
          message: "What is their role?",
          choices: res.map(({ id, title }) => ({
            value: id,
            name: title
          }))
        },
        {
          type: "list",
          name: "manager_id",
          message: "Who is their manager?",
          choices: employeeData.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${first_name} ${last_name}`
          }))
        },
      ])
      .then((res) => {        
        connection.query("INSERT INTO employee SET ?", {
          first_name: res.first_name,
          last_name: res.last_name,
          title: res.title,
          salary: res.salary,
          manager_id: res.manager_id,
        });
        console.log("This employee was added to the employee table.");
        promptMainMenu();
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
          name: "employeeId",
          message: "Which employee would you like to update?",
          choices: employees,
        },
      ])
      .then((res) => {
        const employeeId = res.employeeId;

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
                name: "roleId",
                message: "What is the employee's new role?",
                choices: roles,
              },
            ])
            .then((res) => {
              const roleId = res.roleId;

              connection.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [roleId, employeeId],
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


const deleteRole = () => {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt({
        type: "list",
        name: "roleToDelete",
        message: "Select the role you want to delete:",
        choices: res.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      })
      .then((response) => {
        const roleId = response.roleToDelete;

        connection.query(
          "DELETE FROM role WHERE id = ?",
          [roleId],
          function (error) {
            if (error) throw error;
            console.log("Role deleted successfully.");
            promptMainMenu();
          }
        );
      });
  });
};

const deleteEmployee = () => {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt({
        type: "list",
        name: "employeeToDelete",
        message: "Select the employee you want to delete:",
        choices: res.map((employee) => ({
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        })),
      })
      .then((response) => {
        const employeeId = response.employeeToDelete;

        connection.query(
          "DELETE FROM employee WHERE id = ?",
          [employeeId],
          function (error) {
            if (error) throw error;
            console.log("Employee deleted successfully.");
            promptMainMenu();
          }
        );
      });
  });
};

const deleteDepartment = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt({
        type: "list",
        name: "departmentToDelete",
        message: "Select the department you want to delete:",
        choices: res.map((department) => ({
          name: department.department_name,
          value: department.id,
        })),
      })
      .then((response) => {
        const departmentId = response.departmentToDelete;

        connection.query(
          "DELETE FROM department WHERE id = ?",
          [departmentId],
          function (error) {
            if (error) throw error;
            console.log("Department deleted successfully.");
            promptMainMenu();
          }
        );
      });
  });
};