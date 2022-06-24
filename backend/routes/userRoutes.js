const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser); // This is protected for now to prevent new users form being created
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;
