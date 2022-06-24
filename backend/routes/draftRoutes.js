const express = require("express");
const router = express.Router();
const {
  saveDraft,
  getDrafts,
  editDraft,
  getDraftById,
  deleteDraft,
} = require("../controllers/draftController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, saveDraft);
router.get("/", protect, getDrafts);
router.get("/:id", protect, getDraftById);
router.put("/:id", protect, editDraft);
router.delete("/:id", protect, deleteDraft);

module.exports = router;
