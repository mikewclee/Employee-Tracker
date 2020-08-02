var mysql = require("mysql");
var inquirer = require("inquirer");
const logo = require("asciiart-logo");
const { table } = require("console");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeesDB"
});

//connect to mysql dbase
connection.connect(function (err) {
    if (err) throw err;
    console.log(`connected!!!`);
    runApp();
});

function runApp() {
    const display = logo({ name: "Employee Tracker" }).render();
    console.log(display);
    promptUser();
}

function promptUser() {
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        pageSize: 15,
        message: "What would you like to do?",
        choices: [
            "View all Departments",
            "View all Roles",
            "View all Employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update employee role",
            // "Update employee manager",
            // "View employees by manager",
            // "Delete department",
            // "Delete role.",
            // "Delete employee",
            // "View total utilized budget",
            "Exit"
        ]
    }).then(function (answers) {
        switch (answers.action) {
            case "View all Departments":
                viewDepartments();
                break;
            case "View all Roles":
                viewRoles();
                break;
            case "View all Employees":
                viewEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            case "Exit":
                // exitApp();
                connection.end();
                break;
        }
    });
}

//Select from department
function viewDepartments() {
    console.log(`Viewing all departments`);
    connection.query("select name as Department_Name, id as Department_ID from department", (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

//Select from role
function viewRoles() {
    console.log(`Viewing all roles`);
    connection.query("select * from role", (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}
//Slect from Employees
function viewEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employeesDB.employee JOIN role on employee.role_id = role.id JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        promptUser();
    });
}

// INSERT INTO department
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "deptName",
            message: "What Department would you like to add?"
        }
    ]).then(function (res) {
        // console.log(res);
        connection.query("INSERT INTO department SET ?", { name: res.deptName }, (err, res) => {
            if (err) throw err;
            console.table(`Successfully Inserted`);
        });
        promptUser();
    });
}

//INSERT into role
function addRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter title:",
            name: "title"
        }, {
            type: "number",
            message: "Enter salary:",
            name: "salary"
        }, {
            type: "number",
            message: "Enter department ID:",
            name: "department_id"
        }
    ]).then(function (res) {
        connection.query("INSERT INTO role (title, salary, department_id) values (?, ?, ?)", [res.title, res.salary, res.department_id], (err, res) => {
            if (err) throw err;
            console.table(res);
        });
        promptUser();
    });

}

//4."Add Employee"
function addEmployee() {
    inquirer.prompt([{
        type: "input",
        name: "firstName",
        message: "What is the employees first name?"
    },
    {
        type: "input",
        name: "lastName",
        message: "What is the employees last name?"
    },
    {
        type: "number",
        name: "roleId",
        message: "What is the employees role ID"
    },
    {
        type: "number",
        name: "managerId",
        message: "What is the employees manager's ID?"
    }
    ]).then(function (res) {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.roleId, res.managerId], (err, data) => {
            if (err) throw err;
            console.table("Successfully Inserted");
        });
        promptUser();
    });
}

function updateEmployeeRole() {
    inquirer.prompt([
        {
            message: "which employee would you like to update? (use first name only for now)",
            type: "input",
            name: "name"
        }, {
            message: "enter the new role ID:",
            type: "number",
            name: "role_id"
        }
    ]).then(function (res) {
        connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [res.role_id, res.name], (err, data) => {
            if (err) throw err;
            console.table(`Updated Employee's Role`);
        });
        promptUser();
    });
}