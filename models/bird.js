const mongoose = require("mongoose");

const birdSchema = new mongoose.Schema({
    primary_name: { type: String, required: true },
    english_name: { type: String, reqired: true },
    scientific_name: { type: String, reqired: true },
    order: { type: String, reqired: true },
    family: { type: String, reqired: true },
    other_names: { type: Array, reqired: true },
    status: { type: String, reqired: true },
    photo: { type: Object, reqired: true },
    size: { type: Object, reqired: true }

})

const Bird = mongoose.model('bird', birdSchema);

module.exports = Bird;
