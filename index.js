const mysql = require(`mysql2`);
const inquirer = require(`inquirer`);
const cTable = require(`console.table`);

require(`dotenv`).config();

const db = mysql.createConnection({
  host: `localhost`,
  user: `root`,
  password: process.env.DB_PASSWORD,
  database: `employee_db`,
});

db.connect(function () {
  console.log(`Connected to the employee_db database!`);
  mainMenu();
});

const mainMenu = () => {
  return inquirer
    .prompt([
      {
        type: `list`,
        name: `menu`,
        message: `What would you like to do?`,
        choices: [
          `View all employees`,
          `Add new employee`,
          `Update employee role`,
          `View all roles`,
          `Add new role`,
          `View all departments`,
          `Add new department`,
          `Update employee's manager`,
          `View employees by manager`,
          `View employees by department`,
          `Delete departments. roles, and employees`,
          `View the total utilized budget of a department`,
          `Quit`,
        ],
      },
    ])
    .then((userInput) => {
      console.log(`Action Selected: ${userInput.menu}`);
      switch (userInput.menu) {
        case `View all employees`: //
          viewEmployees();
          break;
        case `Add new employee`: //
          addEmployee();
          break;
        case `Update employee role`: //
          updateRole();
          break;
        case `View all roles`: //
          viewRoles();
          break;
        case `Add new role`: //
          addRole();
          break;
        case `View all departments`: //
          viewDepartments();
          break;
        case `Add new department`: //
          addDepartment();
          break;
        case `Update employee's manager`: //
          updateManagers();
          break;
        case `View employees by manager`: //
          viewEmployeesByManager();
          break;
        case `View employees by department`: //
          viewEmployeesByDepartment();
          break;
        case `Delete departments. roles, and employees`:
          deleteData();
          break;
        case `View the total utilized budget of a department`:
          viewTotalBudget();
          break;
        case `Quit`:
          db.end();
          break;
      }
    });
};

// All VIEW functions
const viewEmployees = () => {
  db.query(`SELECT * FROM employee`, (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  });
};

const viewRoles = () => {
  db.query(`SELECT * FROM roles`, (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  });
};

const viewDepartments = () => {
  db.query(`SELECT * FROM department`, (err, results) => {
    console.table(results);
    mainMenu();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: `input`,
        name: `name`,
        message: `What is the department's name?`,
        validate: (userInput) => {
          if (userInput) {
            return true;
          } else {
            console.log("Please enter the department's name");
            return false;
          }
        },
      },
    ])
    .then(({ name }) => {
      db.query(
        `INSERT INTO department(department_name) VALUES(?)`,
        name,
        function (err, results) {
          if (err) throw err;
          console.log(results);
          viewDepartments();
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: `input`,
        name: `name`,
        message: `What is the name of the role?`,
        validate: (userInput) => {
          if (userInput) {
            return true;
          } else {
            console.log("Please enter the role's name");
            return false;
          }
        },
      },
      {
        type: `input`,
        name: `salary`,
        message: `What is the salary of the role?`,
        validate: (userInput) => {
          if (userInput) {
            return true;
          } else {
            console.log("Please enter the role's name");
            return false;
          }
        },
      },
    ])
    .then(({ name, salary }) => {
      const newRole = [name, salary];
      console.log(newRole);

      db.query(`SELECT * FROM department`, (err, results) => {
        console.log(results);
        const departmentChoices = [];
        results.forEach(({ department_name, id }) => {
          departmentChoices.push({
            name: department_name,
            value: id,
          });
        });

        inquirer
          .prompt([
            {
              type: `list`,
              name: `department`,
              message: `What department does this role belong to?`,
              choices: departmentChoices,
            },
          ])
          .then(({ department }) => {
            newRole.push(department);

            db.query(
              `INSERT INTO roles(title, salary, department_id) VALUES(?, ?, ?)`,
              newRole,
              (err, results) => {
                if (err) throw err;
                console.table(results);
                viewRoles();
              }
            );
          });
      });
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: `input`,
        name: `firstName`,
        message: `What is the employee's first name?`,
        validate: (userInput) => {
          if (userInput) {
            return true;
          } else {
            console.log("Please enter the employee's first name");
            return false;
          }
        },
      },
      {
        type: `input`,
        name: `lastName`,
        message: `What is the employee's last name?`,
        validate: (userInput) => {
          if (userInput) {
            return true;
          } else {
            console.log("Please enter the employee's last name");
            return false;
          }
        },
      },
    ])
    .then(({ firstName, lastName }) => {
      const newEmployee = [firstName, lastName];
      console.log(newEmployee);

      db.query(`SELECT * FROM roles`, (err, results) => {
        if (err) throw err;
        console.log(results);
        const rolesChoices = [];
        results.forEach(({ title, id }) => {
          rolesChoices.push({
            name: title,
            value: id,
          });
        });

        inquirer
          .prompt([
            {
              type: `list`,
              name: `role`,
              message: `What is the employee's role?`,
              choices: rolesChoices,
            },
          ])
          .then(({ role }) => {
            newEmployee.push(role);
            console.log(newEmployee);

            db.query(`SELECT * FROM employee`, (err, results) => {
              if (err) throw err;
              const managerList = [
                {
                  name: `None`,
                  value: null,
                },
              ];
              results.forEach(({ id, first_name, last_name }) => {
                managerList.push({
                  name: `${first_name} ${last_name}`,
                  value: id,
                });
              });

              inquirer
                .prompt([
                  {
                    type: `list`,
                    name: `manager`,
                    message: `Who is the employee's manager?`,
                    choices: managerList,
                  },
                ])
                .then(({ manager }) => {
                  newEmployee.push(manager);

                  db.query(
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`,
                    newEmployee,
                    (err, results) => {
                      if (err) throw err;
                      console.log(results);
                      console.log(`The employee has been successfully added!`);
                      viewEmployees();
                    }
                  );
                });
            });
          });
      });
    });
};

const updateRole = () => {
  db.query(`SELECT * FROM employee`, (err, results) => {
    if (err) throw err;
    const employeesList = [];
    results.forEach(({ id, first_name, last_name }) => {
      employeesList.push({
        name: `${first_name} ${last_name}`,
        value: id,
      });
    });

    inquirer
      .prompt([
        {
          type: `list`,
          name: `employee`,
          message: `Which employee would you like to update?`,
          choices: employeesList,
        },
      ])
      .then(({ employee }) => {
        let employeeId = employee;

        db.query(`SELECT * FROM roles`, (err, results) => {
          if (err) throw err;
          const rolesChoices = [];
          results.forEach(({ title, id }) => {
            rolesChoices.push({
              name: title,
              value: id,
            });
          });

          inquirer
            .prompt([
              {
                type: `list`,
                name: `role`,
                message: `What is the employee's new role?`,
                choices: rolesChoices,
              },
            ])
            .then(({ role }) => {
              db.query(
                `UPDATE employee SET role_id = ${role} WHERE id=${employeeId}`,
                (err, results) => {
                  console.log(results);
                  viewEmployees();
                }
              );
            });
        });
      });
  });
};

const updateManagers = () => {
  db.query(`SELECT * FROM employee`, (err, results) => {
    if (err) throw err;
    const employeesList = [];
    results.forEach(({ id, first_name, last_name }) => {
      employeesList.push({
        name: `${first_name} ${last_name}`,
        value: id,
      });
    });
    const managerList = [
      {
        name: `None`,
        value: null,
      },
    ];
    results.forEach(({ id, first_name, last_name }) => {
      managerList.push({
        name: `${first_name} ${last_name}`,
        value: id,
      });
    });

    inquirer
      .prompt([
        {
          type: `list`,
          name: `employee`,
          message: `Which employee would you like to update?`,
          choices: employeesList,
        },
        {
          type: `list`,
          name: `manager`,
          message: `Who is the employee's new manager?`,
          choices: managerList,
        },
      ])
      .then(({ employee, manager }) => {
        let employeeId = employee;
        let managerId = manager;

        db.query(
          `UPDATE employee SET manager_id=${managerId} WHERE id=${employeeId}`,
          (err, results) => {
            if (err) throw err;
            console.log(results);
            viewEmployees();
          }
        );
      });
  });
};

const viewEmployeesByManager = () => {
  db.query(
    `SELECT e.first_name AS 'Employee First Name', e.last_name AS 'Employee Last Name', m.first_name AS 'Manager First Name', m.last_name AS 'Manager Last Name'
    FROM employee e
    LEFT JOIN employee m
    ON e.manager_id = m.id
    ORDER BY m.last_name, e.last_name`,
    (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    }
  );
};

const viewEmployeesByDepartment = () => {
  db.query(
    `SELECT d.department_name AS 'Department', e.last_name AS 'Last Name', e.first_name AS 'First Name', r.title AS 'Role'
  FROM employee e
  JOIN roles r
  ON e.role_id = r.id
  LEFT JOIN department d
  ON r.department_id = d.id
  ORDER BY d.department_name, e.last_name`,
    (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    }
  );
};
