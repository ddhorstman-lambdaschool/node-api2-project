const comments = require("express").Router();
const db = require("../data/db.js");

comments.get("/", (req, res) => {
  const { id } = req;
  db.findById(id)
    .then(posts => {
      //an empty array means the id was invalid
      if (posts.length === 0) {
        res.status(404).json({
          errorMessage: `The post with id ${id} does not exist`,
        });
      } else {
        return db.findPostComments(id);
      }
    })
    //If anything goes wrong, the previous function will return undefined
    //need to be sure we successfully got some comments before trying to send them
    .then(comments => comments && res.status(200).json(comments))
    .catch(e => {
      console.error(e);
      res.status(500).json({
        errorMessage:
          "There was an error while retrieving comments from the database.",
      });
    });
});

comments.post("/", (req, res) => {
  const { id } = req;
  const newComment = { ...req.body, post_id: id };
  db.findById(id)
    .then(posts => {
      //an empty array means the id was invalid
      if (posts.length === 0) {
        res.status(404).json({
          message: `The post with id '${id}' does not exist.`,
        });
      } else if (!req.body.text) {
        res
          .status(400)
          .json({ errorMessage: "Please provide 'text' for the comment" });
      } else {
        return db.insertComment(newComment);
      }
    })
    //If anything goes wrong, the previous function will return undefined
    //need to be sure we successfully got the id back before trying to retrieve the comment
    .then(res => res && db.findCommentById(res.id))
    //Again, safety check to ensure we got a comment from the previous function
    .then(comment => comment && res.status(201).json(comment))
    .catch(e => {
      console.error(e);
      res.status(500).json({
        errorMessage:
          "There was an error while saving the comment to the database.",
      });
    });
});

module.exports = comments;
