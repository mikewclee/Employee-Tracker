var mysql = require("mysql");
var inquirer = require("inquirer");
const logo = require("asciiart-logo");
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
            "Add a department",
            "Add a role",
            "Add an employee",
            "View all Departments",
            "View all Roles",
            "View all Employees",
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
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addDepartment();
                break;
            case "View all Departments":
                viewDepartments();
                break;
            case "View all Roles":
                viewRoles();
                break;
            case "view all Employees":
                viewEmployees();
                break;
            case "Update employee role":
                updateEmployeeRoles();
                break;
            // case "Update employees by manager":
            //     updateEmployeesManager();
            //     break;
            case "Exit":
                exitApp();
                break;

        }
    });
}

function viewDepartments(){
    console.log(`Viewing all departments`);
    connection.query("select name as Department_Name from department", (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}