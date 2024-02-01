-- Drop an employees database if it exists, instantiate a new one, and set it as the default --
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

-- First table is the department table, with a primary key field in ID --
CREATE TABLE department (
    id INT AUTO_INCREMENT, 
    name VARCHAR(30),
    PRIMARY KEY (id)
);

-- Second table is the role table, with a primary key field in ID and foreign key in department_id that links to the department table --
CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

-- Third table is the employee table, with a primary key field in ID and foreign key in manager_id that links to role table --
CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);
