const express = require('express');
const fs = require('fs');
const PORT = 3434

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// get a database 
const readDatabase = (req, res) => {
    const database = fs.readFileSync("./cart.json");
    return JSON.parse(database);
}

// write tothe database
const writDatabase = (data) => {
    fs.writeFileSync("./cart.json", JSON.stringify(data));
}

// get all cart items
app.get("/cart", (req, res) => {
    const mycart = readDatabase();
    if (mycart.mycart === 0){
        res.status(404).json({message: "empty cart"});
    }else {
        res.status(200).json({
            message: "check your cart",
            data: mycart,
            total: mycart.mycart.length
        });
    }
})

// get one item 
app.get("/cart/:id", (req, res) => {
    const database = readDatabase();
    const cartId = parseInt(req.params.id);
    const mycart = database.mycart.find((s) => (s.id === cartId));
    if (!mycart){
        res.status(404).json({message: "cart not found"});
    }else{
        res.status(200).json({
            message: "check your cart",
            data: mycart
        });
    }
})

// create a new cart
app.post("/cart", (req, res) => {
    const database = readDatabase();
    const newCart = req.body;
    newCart.id = database.mycart.length + 1;
    database.mycart.push(newCart);
    writDatabase(database);
    res.status(201).json({
        message: "cart created",
        newData: newCart
    });
})

// update cart
app.put("/cart/:id", (req, res) => {
    const database = readDatabase();
    const cartId = parseInt(req.params.id);
    const updatedCart = req.body;
    const index = database.mycart.findIndex((c) => (c.id === cartId));
    if (index !== -1){
        database.mycart[index] = { ...database.mycart[index], ...updatedCart }
        writDatabase(database);
        res.status(200).json({
            data: database.mycart[index]
        });
    }else {
        res.send("wrond cart id")
    }
})

// deleting a cart
app.delete("/cart/:id", (req, res) => {
    const database = readDatabase();
    const cartId = parseInt(req.params.id)
    const index = database.mycart.findIndex((c) => (c.id === cartId));
    if (!database.mycart[0]){
        res.status(404).json({message: "cart not found"});
    }else {
        deletedCart = database.mycart[index]
        database.mycart.splice(index, 1)
        writDatabase(database);
        res.status(200).json({
            message: "cart deleted",
            deletedData: deletedCart
        })
    }
})


















app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});