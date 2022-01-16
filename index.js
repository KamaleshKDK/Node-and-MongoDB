const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const URL = "mongodb+srv://Kamalesh:SIMTAANGARANKDK@123@cluster0.nvmcv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = "Kh12Lh2mf0";
option = {
    origin: "*"
}

let authenticate = function (req, res, next) {
    if (req.headers.authorization) {
        try {
            let verifyResult = jwt.verify(req.headers.authorization, secret);
            next();
        } catch (error) {
            res.status(401).json({ message: " Token Invalid" });
        }
    }
    else {
        res.status(401).json({ message: "Not Authorized" });
    }
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


//dashboard

app.get("/dashboard", authenticate, function (req, res) {
    res.json({ totalUsers: 20 })
})


//Customer registration form 

app.post('/register', async function (req, res) {
    try {
        let connection = await MongoClient.connect(URL);
        let db = connection.db("zen_class");
        //Encrypt the password and store in db
        //  await db.collection("customers").insertOne(req.body);
        // let userVerify = await bcrypt.compare(req.body.email, userVerify.email);
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;

        await db.collection("customers").insertOne(req.body);
        connection.close();
        res.json({ message: "Customer Registered" })
    } catch (error) {
        console.log(error);
    }
})

// Login Form
app.post("/login", async function (req, res) {
    try {
        let connection = await MongoClient.connect(URL);
        let db = connection.db("zen_class");
        let user = await db.collection("customers").findOne({ email: req.body.email });
        //If user is present allow then won't allow
        if (user) {
            let userVerify = await bcrypt.compare(req.body.password, user.password);
            if (userVerify) {
                let token = jwt.sign({ userid: user._id }, secret, { expiresIn: '2m' });
                res.json({ token });
            }
            else {
                res.status(401).json({ message: "Email or Password do not Correct  " })
            }

        } else {
            res.status(401).json({ message: "Email or Password do not Correct" })
        }




    } catch (error) {
        console.log(error);
    }
})




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

app.listen(process.env.PORT || 3000)