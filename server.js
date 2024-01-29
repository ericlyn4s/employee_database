// Import inquirer, express and mysql modules
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
];

function queryType(data) {
    const choice = data.actions;
    
    // Case statement based off initial user input
    switch (choice) {
        case 'View all departments':
            db.query('SELECT * FROM department', function (err, results) {
                console.log(results);
              });
    };
}
 // Create a function to execute user selection
function init() {
    inquirer
    .prompt(questions)
    .then(data => queryType(data));
};

init();