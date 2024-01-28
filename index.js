// Import inquirer, express and mysql modules
const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

// Setup correct port
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
      database: 'employees_db)'
    },
    console.log(`Connected to the employees_db database.`)
  );

const questions = [
    {
        type: 'list',
        name: 'actions',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    },
]


// Create a function to execture user selection
function init() {
    inquirer
    .prompt(questions)
    .then(answers => console.log(answers));
};

// Function call to initialize app
init();

