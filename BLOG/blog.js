// import the express library
const express = require('express');
const fs = require('fs')
const PORT = 4044;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: "welcome to y blog"
    })
});

// get a database
const readDatabase = (req, res) =>{
    const database = fs.readFileSync("./blog.json");
    return JSON.parse(database); 
}

//write to database
const writeDatabase = (data) => {
    fs.writeFileSync("./blog.json", JSON.stringify(data, null, 2))
}

// get all posts
app.get("/blog", (req,res)=>{
    const blog = readDatabase();
    if (blog.blog.length === 0){
        res.status(404).json({
            message: "no blog found"
        })
    }else {
        res.status(200).json({
            message: "ok",
            data: blog,
            total: blog.blog.length
        });
    }
});

// one post
app.get('/blog/:id', (req, res) =>{
    const database = readDatabase();
    const blogId = parseInt(req.params.id);
    const blog = database.blog.find((u)=> (u.id === blogId));


    if (!blog){
        res.status(404).json({
            message: "post not found "
        });
    } else {
        res.status(200).json({
            data: blog
        })
    }
    

})
// create new post
app.post("/blog", (req, res) =>{
    const database = readDatabase();
    const newPost = req.body;
    newPost.id = database.blog.length + 1;
    database.blog.push(newPost);
    writeDatabase(database);
    res.status(201).json({
        newData: newPost
    });

});

// update post in database
app.put("/blog/:id",(req, res) =>{
    const database = readDatabase();
    const blogId = parseInt(req.params.id);
    const updatedPost = req.body;
    const index = database.blog.findIndex((i) => (i.id === blogId));
    if (index !== -1){
        database.blog[index] = { ...database.blog[index], ...updatedPost}
        writeDatabase(database)
        res.status(200).json({
            data: database.blog[index]
        });
    }else {
        res.send("no post sent")
    }
})

// delete post
app.delete("/blog/:id", (req, res) =>{
    const database = readDatabase();
    const blogId = parseInt(req.params.id)
    const index = database.blog.findIndex((i) => (i.id === blogId))
    if (!database.blog[0]){
        res.status(404).json({
            message: "no blog post"
        })
    }else{
        deletedPost = database.blog[index]
        database.blog.splice(index, 1)
        writeDatabase(database);
        res.status(200).json({
            deletedData: deletedPost
        })
    }
})



app.listen(PORT, ()=>{
    console.log(`app is listening onport i created ${PORT}`);
});