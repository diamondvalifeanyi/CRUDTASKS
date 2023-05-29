const express = require('express')
PORT = 1100;

const app = express();
app.use(express.json());

const ems = [{id: 1, eName: "valentine", eAdress: "okota", eTitle: "md", eAge: 40, eSalary: 9000, eGrade: "msc"},
{id: 2, eName: "ebuka", eAdress: "ago palace", eTitle: "manager", eAge: 36, eSalary: 7500, eGrade: "msc"},
{id: 3, eName: "geraldine", eAdress: "festac", eTitle: "supervisor", eAge: 31, eSalary: 5000, eGrade: "bsc"},
{id: 4, eName: "blaze", eAdress: "isolo", eTitle: "secretary", eAge: 28, eSalary: 3500, eGrade: "ND"},
{id: 5, eName: "favour", eAdress: "festac", eTitle: "cashier", eAge: 24, eSalary: 2500, eGrade: "ssce"}]
   
app.get('/', (req, res) => {
    res.status(200).json({
        message: "creating an EMS to perform basic CRUD"
    })
});

// get all employee
app.get("/employees", (req, res) => {
    res.status(200).json({
        data: ems
    });
})

//get one employee
app.get("/employees/:id", (req, res) => {
    const employeeId = parseInt(req.params.id);
    const employee = ems.find( (item) => ( item.id === employeeId));
    if (! employee) {
        res.status(404).json({
            data: "not a registered employee"
        })
    }else {
        res.status(200).json({
            data: employee
        })
    }
})

// create employee
app.post("/employees", (req, res) => {
    const newEmployee = req.body;
    newEmployee.id = ems.length + 1;
    ems.push(newEmployee);
    res.status(200).json({
        data: newEmployee
    })
})

// edit employee details
app.put("/employees/:id", (req, res) =>{
    const employeeId = parseInt(req.params.id);
    const updatedEmployee = req.body;
    const index = ems.findIndex( (item) => (item.id === employeeId))
    if ( index !== -1) {
        ems[index] = { ...ems[index], ...updatedEmployee}
        res.status(200).json({
            new: ems[index]
        })
    }else {
        res.send("this id does not exist")
    }
})

// delete an employee from the system
app.delete("/employees/:id",(req,res) => {
    const employeeId = parseInt(req.params.id);
    const index = ems.findIndex( (item) => (item.id === employeeId))
    if (!ems[0]) {
        res.status(404).json({
            message: "this employee: ${employeeId} does not exist"
        })
    }else {
        deletedEmployee = ems[index]
        ems.splice(index, 1);
        res.status(200).json({
            data: " employee deleted for life"
        })
    }
})


app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});