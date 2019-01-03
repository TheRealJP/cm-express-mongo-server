const mongoose = require('mongoose');

let roomSchema = new mongoose.Schema({
    id: String,
    naam: String,
    type: String,
    bezet: Boolean,
    capaciteit: Number,
    beamer: Boolean,
    drukte: Number,
    hoogte: Number,
    breedte: Number
});

let floorSchema = new mongoose.Schema({
    floorlevel: Number,
    rooms: [roomSchema]
});


var Floor = mongoose.model('Floor', floorSchema);
module.exports = Floor;
