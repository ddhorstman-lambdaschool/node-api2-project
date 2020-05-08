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
                    errorMessage: `The post with id '${id}' does not exist.`
                })
                : res.status(200).json(posts[0]))
        .catch(e => {
            console.error(e);
            res.status(500).json({
                errorMessage: "The post information could not be retrieved."
            });
        })
});

posts.post("/", (req, res) => {
    if (!(req.body.title && req.body.contents)) {
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
                errorMessage: "There was an error while saving the post to the database."
            });
        });
});

posts.delete("/:id", (req, res) => {
    const { id } = req.params;
    let post;
    db
        .findById(id)
        .then(posts => {
            //an empty array means the id was invalid
            if (!posts[0]) {
                res.status(404).json({
                    errorMessage: `The post with id '${id}' does not exist.`
                });
            }
            else {
                post = posts[0];
                return db.remove(id);
            }
        })
        .then(numberDeleted => {
            if (numberDeleted === 0) {
                throw new Error("Error when trying to delete the post.");
            }
            if (numberDeleted === 1) res.status(200).json(post);
        })
        .catch(e => {
            console.error(e);
            res.status(500).json({
                errorMessage: "There was an error while removing the post from the database."
            });
        });
});

posts.put("/:id", (req, res) => {
    const { id } = req.params;
    db
        .findById(id)
        .then(posts => {
            //an empty array means the id was invalid
            if (!posts[0]) {
                res.status(404).json({
                    errorMessage: `The post with id '${id}' does not exist.`
                });
            }
            else if (!(req.body.title && req.body.contents)) {
                res.status(400).json({
                    errorMessage: "Please provide 'title' and 'contents' for the post."
                });
            }
            else return db.update(id, req.body);
        })
        .then(numberUpdated => {
            if (numberUpdated === 0) {
                throw new Error("An error ocurred while trying to update the post");
            }
            if (numberUpdated === 1) return db.findById(id)
        })
        .then(posts => posts && res.status(200).json(posts[0]))
        .catch(e => {
            console.error(e);
            res.status(500).json({
                errorMessage: "There was an error while updating the post in the database."
            });
        });
});

posts.use("/:id/comments", (req, res, next) => {
    req.id = req.params.id;
    next();
}, commentsRouter);

module.exports = posts;