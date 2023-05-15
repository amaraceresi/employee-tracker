const inquirer = require('inquirer');
const { createConnection } = require('mysql2');
const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./database');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Enter your MySQL username:',
      validate: (input) => {
        if (input.trim() === '') {
          return 'Please enter a valid username.';
        }
        return true;
      },
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your MySQL password:',
      mask: '*',
      validate: (input) => {
        if (input.trim() === '') {
          return 'Please enter a valid password.';
        }
        return true;
      },
    },
  ])
  .then((answers) => {
    const { username, password } = answers;

    const connection = createConnection({
      host: 'localhost',
      port: 3306,
      user: username,
      password: password,
      database: 'your_database',
    });

    connection.connect((err) => {
      if (err) throw err;
      console.log('Connected to the database.');

      promptMainMenu(connection);
    });
  });

function promptMainMenu(connection) {

}
