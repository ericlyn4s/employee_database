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

// Initial question that is asked on startup
const initialQuestion = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'actions',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit application'],
    },
];

// Take the user input from the initial question and feed it into a large decision tree
function queryType(data) {
    const choice = data.actions;
    
    // Case statement based off initial user input
    switch (choice) {
        case 'View all departments':
            // Simple select * from departments table
            db.query('SELECT * FROM department' , function (err, results) {
                console.table(results);
                init();
              });
            break;
        case 'View all roles':
            // Query role table for all values
            db.query('SELECT r.id, r.title, d.name, r.salary FROM role AS r JOIN department AS d ON r.department_id = d.id', function (err, results) {
                console.table(results);
                init();
              });
            break;
        case 'View all employees':
            // Query employee table for all values, joining three additional tables to pull in the proper columns
            db.query('SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, COALESCE(CONCAT(f.first_name," ",f.last_name), "null") AS manager FROM employee AS e JOIN role AS r ON e.role_id = r.id JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS f ON e.manager_id = f.id', function (err, results) {
                console.table(results);
                init();
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
                            init();
                        } else {
                            console.log(`${data.department} inserted successfully!`);
                            init();
                        }
                    });
               });
            break;
        case 'Add a role':
            // Prompt the user for the necessary details to add a role
            let departmentNames = [];
            db.query('SELECT name from department', (error, results) => {
                if (error) {
                    throw error;
                } 
                results.forEach((department, i) => {
                    departmentNames.push({
                        name: department.name,
                        value: i+1,
                    })
                })
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
                type: 'list',
                name: 'department',
                message: 'What is the department?',
                choices: departmentNames,
            },
             ])
             // Take user input and input it into a mysql query
            .then((data) => {
                 db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [data.title, data.salary, data.department], (error, result) => {
                     if (error) {
                         console.error('Error inserting record:', error);
                         init();
                     } else {
                         console.log(`Role added successfully!`);
                         init();
                     }
                 });
                });
            });   
            break;
        case 'Add an employee':
            let roleId = [];
            let employeeName = [];
            db.query('SELECT title FROM role ', (error, results) => {
                if (error) {
                    throw error;
                } 
                results.forEach((role, i) => {
                    roleId.push({
                        name: role.title,
                        value: i+1,
                    })
                })
                db.query('SELECT CONCAT(first_name," ",last_name) AS name FROM employee', (error, results) => {
                    if (error) {
                        throw error;
                    } 
                    results.forEach((employee, i) => {
                        employeeName.push({
                            name: employee.name,
                            value: i+1,
                        })
                    })
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
                type: 'list',
                name: 'role',
                message: 'What is the role?',
                choices: roleId,
            },
            {
                type: 'list',
                name: 'manager',
                message: "What is the employee's manager's id?",
                choices: employeeName,
            },           
             ])
             // Take user input and input it into a mysql query
            .then((data) => {
                 db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [data.first, data.last, data.role, data.manager], (error, result) => {
                     if (error) {
                         console.error('Error inserting record:', error);
                         init();
                     } else {
                         console.log(`Employee added successfully!`);
                         init();
                     }
                 });
                });
            });
        });
            break;
            case 'Update an employee role':
                // Prompt the user for the necessary details to add an employee
                const employeeNames = db.query('SELECT name FROM employee')
                    inquirer
                    .prompt([
                    {
                        type: 'list',
                        message: 'Whose role would you like to update?',
                        name: 'employees',
                        choices: employeeNames,
                    },
                    {
                        type: 'list',
                        message: 'Which role do you want to assign the selected employee?',
                        name: 'role',
                        choices: employeeNames,
                    },
                    ])
                    .then((data) => {
                        // I need to update this, then revert back to what would we like to do
                     console.log(data.employees);
                     init();
                    })  
                break;   
                default: 
                    process.exit();
                } 
};

            
                        

 // Create a function to execute user selection
function init() {
    inquirer
    .prompt(initialQuestion)
    .then(data => queryType(data));
};

// Start the init function at application startup
init();