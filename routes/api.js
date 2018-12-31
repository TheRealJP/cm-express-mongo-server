const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
var Floor = require('../models/floor');

const db = "mongodb://localhost:27017/cmdb";
mongoose.connect(db, {useNewUrlParser: true}, () => console.log("Mongoose up!"));

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
        if (result) console.log(result);
        if (err) console.log(err);
    });
    res.send(JSON.stringify(resp))
});

module.exports = router;
