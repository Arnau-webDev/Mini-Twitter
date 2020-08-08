const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created: {
        type: Object,
        required: true
    }
}, { timestamps: true});

const Tweet = mongoose.model("tweet", tweetSchema);

module.exports = Tweet;