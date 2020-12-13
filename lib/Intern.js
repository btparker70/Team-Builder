const Employee = require("./Employee");

// Template Intern class constructor
class Intern extends Employee {
    constructor(name, id, email, school) {
        super(name, id, email);
        this.school = school;
    }
    getSchool() {
        return this.school;
    }
    getRole() {
        return this.constructor.name;
    }
}
module.exports = Intern;