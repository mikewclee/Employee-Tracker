var mysql = require("mysql");
var inquirer = require("inquirer");
const logo = require("asciiart-logo");
// const { table } = require("console");
// require("console.table");

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
    runApp();
});

//Splash screen to show employee tracker
function runApp() {
    const display = logo({ name: "Employee Tracker" }).render();
    console.log(display);
    promptUser();
}

function promptUser() {
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        pageSize: 18,
        message: "What would you like to do? Please type in number.",
        choices: [
            "View all Departments",
            "View all Roles",
            "View all Employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update employee role",
            "Update employee manager",
            "View employees by manager",
            "Delete department",
            "Delete role",
            "Delete an employee",
            "View total budget by Department",
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
            case "Update employee manager":
                updateEmployeeManager();
                break;
            case "Delete department":
                deleteDepartment();
                break;
            case "Delete role":
                deleteRole();
                break;
            case "Delete an employee":
                deleteEmployee();
                break;
            case "View employees by manager":
                viewEmployeesByManager();
                break;
            case "View total budget by Department":
                viewTotalBudgetByDepartment();
                break;
            case "Exit":
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
//Select from employee
function viewEmployees() {
    console.log(`Viewing all Employees`);
    connection.query("select * from employee", (err, res) => {
        if (err) throw err;
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
            console.table(`Successfully added department`);
            promptUser();
        });
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
            console.table(`Successfully added role`);
            promptUser();
        });
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
            console.table("Successfully Added employee");
            promptUser();
        });
    });
}

function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the employeeID to update their Role?",
            name: "employee_Id"
        }, {
            type: "number",
            message: "enter the new role ID:",
            name: "role_id"
        }
    ]).then(function (res) {
        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [res.role_id, res.employee_Id], (err, data) => {
            if (err) throw err;
            console.table(`Successfully updated Employee's Role`);
            promptUser();
        });
    });
}

function updateEmployeeManager() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the employeeID to update their manager?",
            name: "employee_Id"
        }, {
            type: "number",
            message: "Please enter the new Manager's ID:",
            name: "manager_id"
        }
    ]).then(function (res) {
        connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [res.manager_id, res.employee_Id], (err, data) => {
            if (err) throw err;
            console.table(`Successfully updated Employee's Manager`);
            promptUser();
        });
    });
}

function deleteEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the employee you want to delete?",
            name: "idDelete"
        }
    ]).then(function (res) {
        connection.query("DELETE FROM employee WHERE id = ?", [res.idDelete], (err, data) => {
            if (err) throw err;
            console.table(`Successfully deleted employee by ID`);
            promptUser();
        });
    });
}

function deleteDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the department you want to delete?",
            name: "idDelete"
        }
    ]).then(function (res) {
        connection.query("DELETE FROM department WHERE id = ?", [res.idDelete], (err, data) => {
            if (err) throw err;
            console.table(`Successfully deleted department by ID`);
            promptUser();
        });
    });
}

function deleteRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the role you want to delete?",
            name: "idDelete"
        }
    ]).then(function (res) {
        connection.query("DELETE FROM role WHERE id = ?", [res.idDelete], (err, data) => {
            if (err) throw err;
            console.table(`Successfully deleted role by ID`);
            promptUser();
        });
    });
}

//View Employees by Manager
function viewEmployeesByManager() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, role.salary FROM employeesDB.employee JOIN role on employee.role_id = role.id JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        promptUser();
    });
}

//View utilized budget by department
function viewTotalBudgetByDepartment() {
    console.log(`Viewing Budget by departments`);
    connection.query("SELECT department.id, department.name, SUM(role.salary) AS Utilized_Budget FROM employee JOIN role on employee.role_id = role.id JOIN department on role.department_id = department.id GROUP BY department.id", (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}