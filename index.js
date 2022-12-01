const mysql = require(`mysql2`);
const inquirer = require(`inquirer`);

require(`dotenv`).config();

const db = mysql.createConnection(
  {
    host: `localhost`,
    user: `root`,
    password: process.env.DB_PASSWORD,
    database: `employee_db`,
  },
  console.log(`Connected to the employee_db database!`)
);

const mainMenu = () => {
  return inquirer
    .createPromptModule([
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
          `Update employee managers`,
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
      switch (userInput.menu[0]) {
        case `View all employees`: //
          viewEmployees();
          break;
        case `Add new employee`:
          addEmployee();
          break;
        case `Update employee role`:
          updateRole();
          break;
        case `View all roles`: //
          viewRoles();
          break;
        case `Add new role`:
          addRole();
          break;
        case `View all departments`: //
          viewDepartments();
          break;
        case `Add new department`:
          assDepartment();
        case `Update employee's manager`:
          updateManagers();
          break;
        case `View employees by manager`:
          viewEmployeesByManager();
          break;
        case `View employees by department`:
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
        default:
          db.end();
      }
    });
};

// All VIEW functions
const viewEmployees = () => {
  db.promise().query(`SELECT * FROM employee`, (err, results) => {
    if (err) throw err;
    console.log(results);
    mainMenu();
  });
};

const viewRoles = () => {
  db.promise().query(`SELECT * FROM role`, (err, results) => {
    if (err) throw err;
    console.log(results);
    mainMenu();
  });
};

const viewDepartments = () => {
  db.promise().query(`SELECT * FROM department`, (err, results) => {
    if (err) throw err;
    console.log(results);
    mainMenu();
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
    .then((userInput) => {
      const newEmployee = [userInput.firstName, userInput.lastName];

      db.promise().query(
        `SELECT role.id and role.title FROM role`,
        (err, results) => {
          const rolesChoices = results.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: `list`,
                name: `role`,
                message: `What is the employee's role?`,
                choices: rolesChoices,
              },
            ])
            .then((userInput) => {
              const roleChosen = userInput.role;
              newEmployee.push(roleChosen);

              db.promise().query(`SELECT * FROM employee`, (err, results) => {
                const managerList = results.map(
                  ({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    id: id,
                  })
                );

                inquirer
                  .prompt([
                    {
                      type: `list`,
                      name: `manager`,
                      message: `Who is the employee's manager?`,
                      choices: managerList,
                    },
                  ])
                  .then((userInput) => {
                    const managerChosen = userInput.manager;
                    newEmployee.push(managerChosen);

                    db.query(
                      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(${newEmployee[0]},${newEmployee[1]},${newEmployee[2]},${newEmployee[3]})`,
                      (err, results) => {
                        console.log(results);
                        console.log(
                          `The employee has been successfully added!`
                        );
                        viewEmployees();
                      }
                    );
                  });
              });
            });
        }
      );
    });
};
