const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/user');
const db = "mongodb://localhost:27017/cmdb";
mongoose.connect(db, {useNewUrlParser: true}, () => console.log("Mongoose up!"));

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    console.log(username + ' | ' + password);
    const resp = await User.find({username, password}, (err, result) => {
        if (err) {
            console.log("error:" + err);
        }
        if (result.length) {
            console.log("we have result");
        } else {
            console.log("we dont");
        }
    });

    res.send(resp);
    res.status(200);
    // return resp
});

module.exports = router;
