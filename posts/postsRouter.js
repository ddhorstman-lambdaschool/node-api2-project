const posts = require('express').Router();
const commentsRouter = require('./commentsRouter.js');
const db = require('../data/db.js');


posts.get("/", (req, res) => {
    db
        .find()
        .then(posts => res.status(200).json(posts))
        .catch(e => {
            console.error(e);
            res.status(500).json(
                { errorMessage: "The posts information could not be retrieved." }
            );
        });
});

posts.get("/:id", (req, res) => {
    const { id } = req.params;
    db
        .findById(id)
        .then(posts =>
            //an empty array means the id was invalid
            !posts[0]
                ? res.status(404).json({
                    errorMessage: `The post with id '${id}' does not exist`
                })
                : res.status(200).json(posts[0]))
        .catch(e => {
            console.error(e);
            res.status(500).json({
                errorMessage: "The post information could not be retrieved"
            });
        })
});

posts.post("/", (req, res) => {
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
        .catch(e => {
            console.error(e);
            res.status(500).json({
                errorMessage: "There was an error while saving the post to the database"
            });
        });
});

posts.use("/:id/comments", (req, res, next) => {
    req.id = req.params.id;
    next();
}, commentsRouter);

module.exports = posts;