const asyncHandler = require("express-async-handler");
const Draft = require("../models/draftModel");
const { is } = require("express/lib/request");

// @desc    Create a draft
// @route   POST /api/drafts
// @access  Private

const saveDraft = asyncHandler(async (req, res) => {
  const { title, body } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Please add a title");
  }
  const draft = await Draft.create({
    title,
    body: body ? body : "",
  });
  if (draft) {
    res.status(201).json({
      _id: draft.id,
      title: draft.title,
      body: draft.body,
    });
  } else {
    res.status(400);
    throw new Error("Invalid draft data");
  }
});

// @desc    Get all drafts
// @route   GET /api/drafts
// @access  Private

const getDrafts = asyncHandler(async (req, res) => {
  // We could try sorting by date here but we'll do it on the frontend for now
  // Also, once we have a lot of drafts it might be worth adding pagination
  const drafts = await Draft.find({});
  res.status(200).json(drafts);
});

// @desc    Get draft by ID
// @route   GET /api/drafts/:id
// @access  Private

const getDraftById = asyncHandler(async (req, res) => {
  // We could try sorting by date here but we'll do it on the frontend for now
  // Also, once we have a lot of drafts it might be worth adding pagination
  const draft = await Draft.findById(req.params.id);
  res.status(200).json(draft);
});

// @desc    Update a draft
// @route   PUT /api/drafts/:id
// @access  Private
const editDraft = asyncHandler(async (req, res) => {
  const draft = await Draft.findById(req.params.id);

  if (!draft) {
    res.status(400);
    throw new Error("Draft not found");
  }

  // Make sure the logged in user matches the goal user
  // if (goal.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }

  const updatedDraft = await Draft.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedDraft);
});

// @desc    Delete a draft
// @route   DELETE /api/drafts/:id
// @access  Private
const deleteDraft = asyncHandler(async (req, res) => {
  console.log("we're in the controller");
  await Draft.findByIdAndDelete(req.params.id).exec();
  res.status(200).json({ id: req.params.id });
});
module.exports = {
  saveDraft,
  getDrafts,
  editDraft,
  getDraftById,
  deleteDraft,
};
