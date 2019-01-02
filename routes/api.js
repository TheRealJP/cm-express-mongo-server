const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
var Floor = require('../models/floor');
const db = require("./db");

const db_string = "mongodb://localhost:27017/cmdb";

// mongoose client
mongoose.connect(db_string, {useNewUrlParser: true}, () => console.log("Mongoose up!"));
// mongodb client
db.connect((err) => {
    // If err unable to connect to database
    // End application
    if (err) {
        console.log('unable to connect to database');
        process.exit(1);
    }
    // Successfully connected to database
    // Start up our Express Application
    // And listen for Request
    else {
        app.listen(3001, () => {
            console.log('connected to database, app listening on port 3001');
        });
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    console.log(username + ' | ' + password);
    const resp = await User.find({username, password}, (err, result) => {
        if (err) console.log("error:" + err);
        if (result.length) console.log("we have result");
        else console.log("we dont");
    });

    res.send(resp);
    res.status(200);
    // return resp
});

router.get('/floors', async (req, res) => {
    const resp = await Floor.find({}, (err, result) => {
        if (err) console.log(err);
    });
    res.send(JSON.stringify(resp))
});

router.get('/floors/:id', (req, res) => {
    var id = req.params.id;
    Floor.find({floorlevel: `${id}`}, (err, result) => {
        if (result) {
            console.log('single floor fetch:' + result);
            res.status(200).json(result)
        }
        if (err) console.log(err);
    });
});

router.get('/floors/:id/rooms', async (req, res) => {
    var id = req.params.id;
    db.getDB()
        .collection('floors')
        .aggregate([
            {$unwind: "$rooms"},
            {$match: {floorlevel: parseInt(id)}}])
        .toArray((err, documents) => {
            if (err) {
                console.log('error' + err);
            } else {
                console.log('inside lammbda docs:' + documents);
                console.log('id:' + id);
                res.send(documents)
            }
        });
});

module.exports = router;
