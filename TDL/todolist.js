const express = require('express');
const fs = require('fs')
const PORT = 5008;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "your todo list"
    })
});

// get my database
const readDatabase = (req, res) => {
    const database = fs.readFileSync("./todolist.json");
    return JSON.parse(database);
}

// write/add to database
const writeDatabase = (data) => {
    fs.writeFileSync("./todolist.json", JSON.stringify(data));
}

// get all tasks
app.get("/tdl", (req, res) => {
    const tasks = readDatabase();
    if (tasks.tasks.length === 0) {
        res.status(404).json({
            message: "no tasks"
        })
    }else {
        res.status(200).json({
            message: "todays tasks",
            data: tasks,
            total: tasks.tasks.length
        })
    }
});

//get one task
app.get("/tdl/:id", (req, res) => {
    const database = readDatabase();
    const taskId = parseInt(req.params.id);
    const tasks = database.tasks.find((i) => (i.id === taskId));

    if (!tasks) {
        res.status(404).json({
            message: "Task not found"
        });
    }else {
        res.status(200).json({
            message: "task found",
            data: tasks
        })
    }
})

// create a new task
app.post("/tdl", (req, res) => {
    const database = readDatabase();
    const newTask = req.body;
    newTask.id = database.tasks.length + 1;
    database.tasks.push(newTask);
    writeDatabase(database);
    res.status(201).json({
        newData: newTask
    });
})

// update a task 
app.put("/tdl/:id", (req, res) => {
    const database = readDatabase();
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body;
    const index = database.tasks.findIndex((i) => (i.id === taskId));
    if (index !== -1){
        database.tasks[index] = { ...database.tasks[index], ...updatedTask }
        writeDatabase(database);
        res.status(200).json({
            data: database.tasks[index]
        })
    }else {
        res.send("wrong id sent")
    }
})

// delete a task
app.delete("/tdl/:id", (req, res) => {
    const database = readDatabase();
    const taskId = parseInt(req.params.id);
    const index = database.tasks.findIndex((i) => (i.id === taskId))
    if (!database.tasks[0]){
        res.status(404).json({
                    message: "Task not found"
                })
    }else {
        deletedTask = database.tasks[index]
        database.tasks.splice(index, 1);
        writeDatabase(database);
        res.status(200).json({
            message: "task deleted",
            deletedData: deletedTask
        })
    }
})











app.listen(PORT, () => {
    console.log(`app is listening to port ${PORT}`);
});