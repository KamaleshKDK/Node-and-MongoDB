const express = require("express");
const app = express();
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const URL = "mongodb://localhost:27017/zen_class";

app.use(express.json())

app.get("/user", async (req, res) => {
    try {
        let connection = await MongoClient.connect(URL);
        let db = connection.db("zen_class");
        let users = await db.collection("users").find({}).toArray();
        connection.close();
        res.json(users);

    } catch (error) {
        console.log(error);
    }
})

app.post("/create-user", async (req, res) => {
    //connect the DB
    try {
        let connection = await MongoClient.connect(URL);
        //select the DB
        let db = connection.db("zen_class");
        //select connection
        //Do any Operation
        await db.collection("users").insertOne(req.body);
        //Close the DB
        await connection.close();
        // Message to the api
        res.json({ message: "User added" });
    } catch (error) {
        console.log(error);
    }
})

app.listen(3001);
