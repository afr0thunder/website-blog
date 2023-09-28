const express = require('express');
const { createCommentCtrl, getCommentsCtrl, getCommentCtrl, deleteCommentCtrl, updateCommentCtrl } = require("../../controllers/comments/comments");
const protected = require('../../middlewares/protected');

const commentRoutes = express.Router();

//POST/
commentRoutes.post("/:id", protected, createCommentCtrl);

//GET/
commentRoutes.get("/", getCommentsCtrl);

//GET//:id
commentRoutes.get("/:id", getCommentCtrl);

//DELETE//:id
commentRoutes.delete("/:id", protected, deleteCommentCtrl);

//PUT//:id
commentRoutes.put("/:id", protected, updateCommentCtrl);

module.exports = commentRoutes;