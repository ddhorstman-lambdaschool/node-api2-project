const express = require('express');
const db = require('../data/db.js');
const router = express.Router();


router.get("/", (req,res)=>{
    db.find()
    .then(posts => res.status(200).json(posts))
    .catch(() => res.status(500).json(
        { errorMessage: "The posts information could not be retrieved." }
    ));
});

router.post("/", (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        return res.status(400).json({
            errorMessage: "Please provide 'title' and 'contents' for the post."
        });
    }
    db
        .insert(req.body)
        .then(({ id }) => db.findById(id))
        .then(post => res.status(201).json(post))
        .catch(() => res.status(500).json({
            errorMessage: "There was an error while saving the post to the database"
        }));
});

module.exports = router;