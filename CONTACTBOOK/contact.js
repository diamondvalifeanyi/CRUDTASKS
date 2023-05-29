const express = require('express');
const fs = require('fs');
PORT = 3820

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "thsi is my contact list"
    })
});

// get my contact database
const readDatabase = (req, res) => {
    const database = fs.readFileSync("./contact.json");
    return JSON.parse(database);
}

// write to database
const writeDatabase = (data) => {
    fs.writeFileSync("./contact.json", JSON.stringify(data))
}

// get all contacts
app.get("/contacts", (req, res) => {
    const contacts = readDatabase();
    if (contacts.contacts.length === 0) {
        res.status(404).json({
            message: "No contacts found"
        })
    }else {
        res.status(200).json({
            message: "Contacts found",
            data: contacts,
            total: contacts.contacts.length
        })
    }
})

// get one contact
app.get("/contacts/:id", (req, res) => {
    const database = readDatabase();
    const contactId = parseInt(req.params.id);
    const contact = database.contacts.find((c) => (c.id === contactId))
    if (!contact) {
        res.status(404).json({
                    message: "Contact not found"
                });
    }else {
        res.status(200).json({
            data: contact
        })
    }

})

// create a new contact
app.post("/contacts", (req, res) => {
    const database = readDatabase();
    const newContact = req.body;
    newContact.id = database.contacts.length + 1;
    database.contacts.push(newContact);
    writeDatabase(database);
    res.status(201).json({
        newdata: newContact
    })
})

//update contact list
app.put("/contacts/:id", (req, res) => {
    const database = readDatabase();
    const contactId = parseInt(req.params.id);
    const updatedContact = req.body;
    const index = database.contacts.findIndex((c) => (c.id === contactId))
    if (index !== -1) {
        database.contacts[index] = { ...database.contacts[index], ...updatedContact }
        writeDatabase(database)
        res.status(200).json({
            data: database.contacts[index]
        })
    }else {
        res.send("wrong id sent")
    }
})

app.delete("/contacts/:id", (req, res) => {
    const database = readDatabase();
    const userId = parseInt(req.params.id)
    const index = database.contacts.findIndex((c) => (c.id === userId))
    if (!database.contacts[0]){
        res.status(404).json({
            message: "Contact not found"
        })
    }else {
        deletedContact = database.contacts[index]
        database.contacts.splice(index, 1)
        writeDatabase(database);
        res.status(200).json({
            deletedData: deletedContact
        })
    }
})


















app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});