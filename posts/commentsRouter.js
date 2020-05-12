const comments = require("express").Router();
const db = require("../data/db.js");

comments.get("/", async (req, res) => {
  const { id } = req;
  try {
    const posts = await db.findById(id);
    if (posts.length === 0) {
      res.status(404).json({
        errorMessage: `The post with id ${id} does not exist`,
      });
    } else {
      const comments = await db.findPostComments(id);
      res.status(200).json(comments);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      errorMessage:
        "There was an error while retrieving comments from the database.",
    });
  }
});

comments.post("/", async (req, res) => {
  const { id } = req;
  const newComment = { ...req.body, post_id: id };
  try {
    const posts = await db.findById(id);
    if (posts.length === 0) {
      res.status(404).json({
        message: `The post with id '${id}' does not exist.`,
      });
    } else if (!req.body.text) {
      res
        .status(400)
        .json({ errorMessage: "Please provide 'text' for the comment" });
    } else {
      const { id } = await db.insertComment(newComment);
      const comment = await db.findCommentById(id);
      res.status(201).json(comment);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      errorMessage:
        "There was an error while saving the comment to the database.",
    });
  }
});

module.exports = comments;
