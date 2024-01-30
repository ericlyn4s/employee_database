// Import inquirer, express and mysql modules
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
    host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password
      password: 'Goingtotown234',
      database: 'employees_db'
    },
    console.log(`Connected to the employees database.`)
);

const questions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'actions',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    },
    {
        type: 'input',
        message: 'give input',
        name: 'yes',
    },
];

function queryType(data) {
    const choice = data.actions;
    
    // Case statement based off initial user input
    switch (choice) {
        case 'View all departments':
            // Simple select * from departments table
            db.query('SELECT * Exclude (index) FROM department' , function (err, results) {
                console.table(results);
              });
            break;
        case 'View all roles':
            // Query role table for all values
            db.query('SELECT r.id, r.title, d.name, r.salary FROM role AS r JOIN department AS d ON r.department_id = d.id', function (err, results) {
                console.table(results);
              });
            break;
        case 'View all employees':
            // Query employee table for all values, joining three additional tables to pull in the proper columns
            db.query('SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, COALESCE(CONCAT(f.first_name," ",f.last_name), "null") AS manager FROM employee AS e JOIN role AS r ON e.role_id = r.id JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS f ON e.manager_id = f.id', function (err, results) {
                console.table(results);
              });
            break;
        case 'Add a department':

    };
}
 // Create a function to execute user selection
function init() {
    inquirer
    .prompt(questions[0])
    .then(data => queryType(data));
};

init();