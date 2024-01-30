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

const initialQuestion = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'actions',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    },
];

function queryType(data) {
    const choice = data.actions;
    
    // Case statement based off initial user input
    switch (choice) {
        case 'View all departments':
            // Simple select * from departments table
            db.query('SELECT * FROM department' , function (err, results) {
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
            // Prompt the user for the new department name
            inquirer
               .prompt([
                {
                    type: 'input',
                    name: 'department',
                    message: 'What is the name of the department?',
                },
                ])
               .then((data) => {
                    db.query('INSERT INTO department (name) VALUES (?)', [data.department], (error, result) => {
                        if (error) {
                            console.error('Error inserting record:', error);
                        } else {
                            console.log(`${data.department} inserted successfully!`);
                        }
                    });
               });
            break;
        case 'Add a role':
            // Prompt the user for the necessary details to add a role
            inquirer
            .prompt([
             {
                 type: 'input',
                 name: 'title',
                 message: 'What is the name of the role?',
             },
             {
                type: 'input',
                name: 'salary',
                message: 'What is the salary?',
            },
            {
                type: 'input',
                name: 'department',
                message: 'What is the department id?',
            },
             ])
            .then((data) => {
                 db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [data.title, data.salary, data.department], (error, result) => {
                     if (error) {
                         console.error('Error inserting record:', error);
                     } else {
                         console.log(`Role added successfully!`);
                     }
                 });
                });
            break;
        case 'Add an employee':
            // Prompt the user for the necessary details to add an employee
            inquirer
            .prompt([
             {
                 type: 'input',
                 name: 'first',
                 message: 'What is the first name of the employee?',
             },
             {
                type: 'input',
                name: 'last',
                message: 'What is the last name of the employee?',
            },
            {
                type: 'input',
                name: 'role',
                message: "What is the employee's role id?",
            },
            {
                type: 'input',
                name: 'manager',
                message: "What is the employee's manager's id? (Input null if no manager)",
            },           
             ])
            .then((data) => {
                 db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [data.first, data.last, data.role, data.manager], (error, result) => {
                     if (error) {
                         console.error('Error inserting record:', error);
                     } else {
                         console.log(`Employee added successfully!`);
                     }
                 });
                });
            break;
            case 'Update an employee role':
                // Prompt the user for the necessary details to add an employee
                db.query('SELECT name FROM employees')
                .then(results => {
                const employeeNames = results.map(row => row.name);

                inquirer
                .prompt([
                 {
                    type: 'list',
                    message: 'Whose role would you like to update?',
                    name: 'employees',
                    choices: employeeNames
                 },
                       
                 ])
                .then((data) => {
                     console.log(data.employees);
                         }
                )


                    })
                break;    
                }
};
            
                        

 // Create a function to execute user selection
function init() {
    inquirer
    .prompt(initialQuestion)
    .then(data => queryType(data));
};

init();