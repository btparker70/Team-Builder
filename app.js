const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employees = [];

addManager();
// FUNCTIONALITY //
function addManager() {
    inquirer
        // Questions
        .prompt([
            {
                type: 'input',
                message: 'Manager Name:',
                name: 'managerName'
            },
            {
                type: 'input',
                message: 'Manager id:',
                name: 'managerId'
            },
            {
                type: 'input',
                message: 'Manager email:',
                name: 'managerEmail'
            },
            {
                type: 'input',
                message: 'Manager Office Number:',
                name: 'managerOfficeNumber'
            }
        ])
        .then((response) => {
            const managerInfo = new Manager(response.managerName, response.managerId, response.managerEmail, response.managerOfficeNumber);
            employees.push(managerInfo);
            addEmployee();
        })
}

function addEmployee() {
    inquirer
        // Questions
        .prompt([
            {
                type: 'list',
                message: 'Which type of employee to add?',
                choices: ['Engineer', 'Intern', 'No more employees to add'],
                name: 'employeeType'
            }
        ])
        .then((response) => {
            if (response.employeeType === 'No more employees to add') {
                htmlData = render(employees);
                writeHTMLFile(htmlData);
            } else {
                addEmployeeInfo(response.employeeType);
            }
        })
}
function addEmployeeInfo(employeeType) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: `${employeeType} Name:`,
                name: 'employeeName'
            },
            {
                type: 'input',
                message: `${employeeType} Id:`,
                name: 'employeeId'
            },
            {
                type: 'input',
                message: `${employeeType} Email:`,
                name: 'employeeEmail'
            },
            {
                when: employeeType === 'Engineer',
                type: 'input',
                message: "Engineer's Github: ",
                name: 'github'
            },
            {
                when: employeeType === 'Intern',
                type: 'input',
                message: "Intern's School: ",
                name: 'school'
            }
        ])
        .then((response) => {
            switch (employeeType) {
                case 'Engineer':
                    const engineerInfo = new Engineer(response.employeeName, response.employeeId, response.employeeEmail, response.github);
                    employees.push(engineerInfo);
                    break;
                case 'Intern':
                    const internInfo = new Intern(response.employeeName, response.employeeId, response.employeeEmail, response.school);
                    employees.push(internInfo);
                    break;
            }
            addEmployee();
        })
}

function writeHTMLFile(htmlData) {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdir(OUTPUT_DIR, (err) => err ? console.error(err) : console.log('Folder created'));
    }
    fs.writeFile(outputPath, (htmlData), (err) => err ? console.error(err) : console.log('File created'));
}
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.
// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
