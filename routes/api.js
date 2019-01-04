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


router.get('/floors/:floorid/rooms/:roomid', async (req, res) => {
    // collect ids
    var floorid = req.params.floorid;
    var roomid = req.params.roomid;

    // query
    Floor.findOne({floorlevel: floorid})
        .select({rooms: {$elemMatch: {id: roomid}}})
        .then((result) => {
            console.log(result.rooms[0]);
            res.send(result.rooms[0])
        });
});


router.put('/rooms/:roomid', (req, res) => {
    const room = req.body['r'];
    var roomid = room['id'];
    var floorid = roomid.charAt(0);
    console.log(roomid);
    console.log(floorid);
    console.log(room['name']);
    console.log(room['type']);
    console.log(room['capaciteit']);
    console.log(room['beamer']);
    console.log(room['drukte']);

    Floor.updateOne({'rooms.id': roomid}, {
        $set: {
            'rooms.$.name': room['name'],
            'rooms.$.type': room['type'],
            'rooms.$.capaciteit': room['capaciteit'],
            'rooms.$.beamer': room['beamer'],
            'rooms.$.drukte': room['drukte'],
            'rooms.$.bezet': room['bezet'],
            'rooms.$.hoogte': room['hoogte'],
            'rooms.$.breedte': room['breedte']
        }
    }, (err, result) => {
        console.log('updated room?:' + JSON.stringify(result));
        res.send(result);
    });

    // Floor.findOne({floorlevel: floorid})
    //     .select({rooms: {$elemMatch: {id: roomid}}})
    //     .then((result) => {
    //         console.log(result.rooms[0]);
    //         res.send(result.rooms[0])
    //     });
});

// var floorid = parseInt(roomid.charAt(0));
// console.log(room['name']);
// console.log(room['type']);
// console.log(roomid);
// console.log(floorid);
// console.log(JSON.stringify(room));

// let floorTrueId;
// Floor.findOne({floorlevel: floorid}, (err, result) => {
//     floorTrueId = result['_id'];
//     console.log(floorTrueId);
// });
//
// Floor.findById('5c2a8746cc215a7c1c60875d', (err, floor) => {
//     floor.rooms.set(room);
//     floor.rooms[0].save((err, list) => {
//         console.log('updated list:' + list);
//     })

// floor.save((err, list) => {
//     console.log('updated list:' + list);
// });
// });

//
// Floor.findOne({floorlevel: floorid})
//     .select({rooms: {$elemMatch: {id: roomid}}})
//     .then((result) => {
//         console.log(result.rooms[0]);
//         result.set({name: room['name']});
//         result.save((err, updatedRoom) => {
//             // console.log(updatedRoom['_id']);
//             res.send(updatedRoom);
//         })
//     })


//
// Floor.findOneAndUpdate({floorTrueId, 'rooms.id': roomid}, {
//     $set: {
//         'rooms.$.name': room['name'],
//         'rooms.$.type': room['type'],
//         'rooms.$.capaciteit': room['capaciteit'],
//         'rooms.$.beamer': room['beamer'],
//         'rooms.$.drukte': room['drukte'],
//         'rooms.$.bezet': room['bezet'],
//         'rooms.$.hoogte': room['hoogte'],
//         'rooms.$.breedte': room['breedte']
//     }
// }, (err, result) => {
//     console.log(result);
//     res.send(result)
//     console.log('error:' + err);
// }, {new: true});
//
// Floor.findOneAndUpdate({"floorlevel": floorid, 'rooms.id': roomid}, {
//     $set: {
//         'rooms.$.name': "test",
//         'rooms.$.type': room['type'],
//         'rooms.$.capaciteit': room['capaciteit'],
//         'rooms.$.beamer': room['beamer'],
//         'rooms.$.drukte': room['drukte'],
//         'rooms.$.bezet': room['bezet'],
//         'rooms.$.hoogte': room['hoogte'],
//         'rooms.$.breedte': room['breedte']
//     }
// }, (err, result) => {
//     console.log(result);
//     res.send(result)
//     console.log('error:' + err);
// }, {new: true});
// ;


module.exports = router;
