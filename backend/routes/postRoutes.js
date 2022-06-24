const express = require("express");
const router = express.Router();
const {
  publishPost,
  getPosts,
  editPost,
  getPostById,
  deletePost,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, publishPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", protect, editPost);
router.delete("/:id", protect, deletePost);

module.exports = router;
