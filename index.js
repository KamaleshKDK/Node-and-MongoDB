const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const URL = "mongodb://localhost:27017";


option = {
    origin: "*"
}

app.use(cors(option));
app.use(express.json());

//get method to get the data from API

app.get("/user", async function (req, res) {
    try {
        // connect the database
        let connection = await MongoClient.connect(URL);
        //select DB
        let db = connection.db("zen_class");
        //select collection
        //DO any operation
        let users = await db.collection("users").find({}).toArray();
        //close the connection
        await connection.close();
        // message for Api is worked or not
        res.json(users);

    } catch (error) {
        console.log(error);
    }
    // res.json(UserList)
});


app.get("/user/:id", async function (req, res) {

    try {
        let connection = await MongoClient.connect(URL);
        let db = connection.db("zen_class");
        let ObjId = mongodb.ObjectId(req.params.id);
        let user = await db.collection("users").findOne({ _id: ObjId });
        await connection.close();
        if (user) {
            res.json(user)
        }
        else {
            res.status(401).json({ message: "User Not Found !" })
        }

    } catch (error) {
        res.status(500).json({ message: "Something Wrong" })
    }

})


// post method to post the data in API in Database

app.post("/create-user", async function (req, res) {
    try {
        let connection = await MongoClient.connect(URL);
        let db = connection.db("zen_class");
        await db.collection("users").insertOne(req.body);
        await connection.close();
        res.json({ message: "User Added" });
    } catch (error) {
        console.log(error);
    }

})

// put method to modify the data in API

app.put("/user/:id", async function (req, res) {
    try {
        let connection = await MongoClient.connect(URL);
        let db = connection.db("zen_class");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("users").updateMany({ _id: objId }, { $set: req.body })
        await connection.close();
        res.json({ message: "User Updated" })
    } catch (error) {
        console.log(error)
    }

})


// delete method to delete the data from API

app.delete("/user/:id", async function (req, res) {
    try {
        let connection = await MongoClient.connect(URL);
        let db = connection.db("zen_class");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection('users').deleteOne({ _id: objId })
        await connection.close();
        res.json({ message: " User Deleted" })
    } catch (error) {
        console.log(error)
    }

})

app.listen(3000)