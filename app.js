const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const outputPathStylesheet = path.join(OUTPUT_DIR, "style.css");
const styleSheet = fs.readFileSync(path.resolve(__dirname, "templates/style.css"), "utf8");

// Stores employees created with CLI and rendering method used below in addEmployees();
let employees = [];
const render = require("./lib/htmlRenderer");

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
            // Creates new manager class and adds to emplyees array, then goes on to make more employees
            const managerInfo = new Manager(response.managerName, response.managerId, response.managerEmail, response.managerOfficeNumber);
            employees.push(managerInfo);
            addEmployee();
        })
}

// This checks to see what type of employee is needed or breaks the inquirer to render the page.
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

// Add employee info depending on engineer or intern.
function addEmployeeInfo(employeeType) {
    inquirer
        // Questions
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
            // Create specific class and push to employee array.
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

// This creates the output folder if there isn't one. Also writes the html and css file for the team
function writeHTMLFile(htmlData) {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdir(OUTPUT_DIR, (err) => err ? console.error(err) : console.log('Folder created'));
    }
    fs.writeFile(outputPath, (htmlData), (err) => err ? console.error(err) : console.log('team.html created'));
    fs.writeFile(outputPathStylesheet, (styleSheet), (err) => err ? console.error(err) : console.log('style.css created'));
}