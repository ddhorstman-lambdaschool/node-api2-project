const comments = require('express').Router();
const db = require('../data/db.js');

comments.post("/", (req, res) => {
    const { id } = req;
    const comment = { ...req.body, post_id: id };
    db
        .findById(id)
        .then(posts => !posts[0]
            ? res.status(404).json({
                message: `The post with id '${id}' does not exist.`
            })
            : !req.body.text
                ? res.status(400).json(
                    { errorMessage: "Please provide 'text' for the comment" }
                )
                : db.insertComment(comment))
        .then(({ id }) => db.findCommentById(id))
        .then(c => res.status(201).json(c))
        .catch((e) => {
            console.error(e); res.status(500).json({
                errorMessage: "The post information could not be retrieved."
            });
        });
});

module.exports = comments;