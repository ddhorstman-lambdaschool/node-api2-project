const comments = require('express').Router();
const db = require('../data/db.js');

comments.get("/", (req, res) => {
    const { id } = req;
    db
        .findById(id)
        .then(posts =>
            //an empty array means the id was invalid
            !posts[0]
                ? res.status(404).json({
                    errorMessage: `The post with id ${id} does not exist`
                })
                : db.findPostComments(id))
        .then(comments => res.status(200).json(comments))
        .catch(e => {
            console.error(e); res.status(500).json({
                errorMessage: "There was an error while retrieving comments from the database."
            });
        });
});

comments.post("/", (req, res) => {
    const { id } = req;
    const newComment = { ...req.body, post_id: id };
    db
        .findById(id)
        .then(posts =>
            //an empty array means the id was invalid
            !posts[0]
                ? res.status(404).json({
                    message: `The post with id '${id}' does not exist.`
                })
                : !req.body.text
                    ? res.status(400).json(
                        { errorMessage: "Please provide 'text' for the comment" }
                    )
                    : db.insertComment(newComment))
        .then(({ id }) => db.findCommentById(id))
        .then(comment => res.status(201).json(comment))
        .catch(e => {
            console.error(e); res.status(500).json({
                errorMessage: "There was an error while saving the comment to the database."
            });
        });
});

module.exports = comments;