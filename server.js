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

// Initial question that is asked on startup (called at the bottom of this file)
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
    
    // Case statement based off initial user choice
    switch (choice) {
        // Case 1: All departments displayed
        case 'View all departments':
            // Simple select * from departments table
            db.query('SELECT * FROM department' , function (err, results) {
                console.table(results);
                init();
              });
            break;
        // Case 2: All roles displayed
        case 'View all roles':
            // Query role table for all values, join to department table to pull in department name
            db.query('SELECT r.id, r.title, d.name AS department, r.salary FROM role AS r JOIN department AS d ON r.department_id = d.id', function (err, results) {
                console.table(results);
                init();
              });
            break;
        // Case 3: All employees displayed
        case 'View all employees':
            // Query employee table for all values, joining the two additional tables to pull in role title, department name, role salary and manager name
            db.query('SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, COALESCE(CONCAT(f.first_name," ",f.last_name), "null") AS manager FROM employee AS e JOIN role AS r ON e.role_id = r.id JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS f ON e.manager_id = f.id ORDER BY e.id', function (err, results) {
                console.table(results);
                init();
              });
            break;
        // Case 4: Add a department to the database
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
                // Pass this input in the department table
               .then((data) => {
                    db.query('INSERT INTO department (name) VALUES (?)', [data.department], (error, result) => {
                        if (error) {
                            // catch and describe errors
                            console.error('Error inserting record:', error);
                            init();
                        } else {
                            console.log(`${data.department} inserted successfully!`);
                            init();
                        }
                    });
               });
            break;
        // Case 5: Add a role to the database
        case 'Add a role':
            // Prompt the user for the necessary details to add a role
            let departmentNames = [];
            // Pull existing department names into a list
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
                // Existing department names populate a list for user selection
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
        // Case 6: Add an employee to database
        case 'Add an employee':
            // Create two new variables to hold existing role and employee values
            let roleId = [];
            let employeeName = [];
            // Pull existing role titles and add to roleID array
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
                // Pull existing employee names and add to employeeName array
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
                    // Add a 'none' option in situations where new employee will not have a manager
                    employeeName.unshift({
                        name: "None",
                        value: 0,
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
                // Existing role titles populate choices
                choices: roleId,
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is this employee's manager?",
                // Existing employee names populate choices
                choices: employeeName,
            },           
             ])
             // Take user input and input it into a mysql query
            .then((data) => {
                // If user selected manager as 'none', run an insert query that puts 'null' as manager
                if (data.manager === 0) {
                    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, null)', [data.first, data.last, data.role], (error, result) => {
                     if (error) {
                         console.error('Error inserting record:', error);
                         init();
                     } else {
                         console.log(`Employee added successfully!`);
                         init();
                     }
                 });
                 // If user selected an employee as a manager, run an insert query that utilizes the four previous answers to make an insert function
                } else {
                 db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [data.first, data.last, data.role, data.manager], (error, result) => {
                     if (error) {
                         console.error('Error inserting record:', error);
                         init();
                     } else {
                         console.log(`Employee added successfully!`);
                         init();
                     }
                 });
                }
                });
            });
        });
            break;
            // Case 7: Update an existing employee's role
            case 'Update an employee role':
                // Create empty arrays for all roles and employees
                let role2 = [];
                let employeeName2 = [];
                // Pull all existing roles into role2 array
                db.query('SELECT title FROM role', (error, results) => {
                if (error) {
                    throw error;
                } 
                results.forEach((role, i) => {
                    role2.push({
                        name: role.title,
                        value: i+1,
                    })
                })
                // Pull all employee names into employeeName2 array
                db.query('SELECT CONCAT(first_name," ",last_name) AS name FROM employee', (error, results) => {
                    if (error) {
                        throw error;
                    } 
                    results.forEach((employee, i) => {
                        employeeName2.push({
                            name: employee.name,
                            value: i+1,
                        })
                    })
                    inquirer
                    .prompt([
                    {
                        type: 'list',
                        message: 'Whose role would you like to update?',
                        name: 'employees',
                        // Populate employee names as choices
                        choices: employeeName2,
                    },
                    {
                        type: 'list',
                        message: 'Which role do you want to assign the selected employee?',
                        name: 'role',
                        // Populate existing role names as choices
                        choices: role2,
                    },
                    ])
                    .then((data) => {
                        // I need to update this, then revert back to what would we like to do
                        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [data.role, data.employees], (error, result) => {
                            if (error) {
                                console.error('Error inserting record:', error);
                                init();
                            } else {
                                console.log(`Employee updated successfully!`);
                                init();
                            }
                        });
                    }
                );
               });
           });
            break;   
            // Default to an exit from the program
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