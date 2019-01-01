const mongoose = require('mongoose');

let roomSchema = new mongoose.Schema({
    name: String
});

let floorSchema = new mongoose.Schema({
    floorlevel: Number,
    rooms: [{roomSchema, type: Object}]
});


var Floor = mongoose.model('Floor', floorSchema);
module.exports = Floor;
