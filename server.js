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
/*
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
    console.log(`Connected to the employees_db database.`)
  );
*/
const questions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'actions',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    },
];

// Create a function to execute user selection
function init() {
    inquirer
    .prompt(questions)
    .then(data => queryType(data));
};

function queryType(data) {
    const choice = data.actions;
    
};

init(); 