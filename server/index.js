const express = require("express");
const cors = require("cors");
const monk = require("monk");
const mongoose = require("mongoose");
const Filter = require("bad-words");
const rateLimit = require("express-rate-limit");
const Tweet = require("./models/tweet");


const app = express();

//Connect to MongoDB
const dbURI = "mongodb+srv://User1:User1@minitwitterdb.gj9il.mongodb.net/MiniTwitterDB?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(res => app.listen(5000))
    .catch(err => console.log("err"));

app.use(cors());
app.use(express.json());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}))

app.get("/mews", (req, res) => {
    Tweet.find()
        .then(result => {
            res.send(result)
        })
        .catch(err => console.log(err));
})

function isValidTweet(mew) {
    return mew.name && mew.name.toString().trim() !== "" && mew.content && mew.content.toString().trim() !== "";
}

app.post("/mews", (req, res) => {
    if(isValidTweet(req.body)) {
        const tweet = new Tweet({
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        });
        tweet.save()
            .then(result => {
                res.send(result)
            })
            .catch(err =>  console.log("error"));
    }
     else {
        res.status(422);
        res.json({
            message: "Hey! Name and Content are required!"
        });
    }
});

app.delete("/mews/:id", (req, res) => {
    const id= req.params.id;

    Tweet.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: "/client"})
        })
        .catch(err => console.log("error"));
})

