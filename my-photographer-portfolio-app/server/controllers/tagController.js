import Tag from "../models/tagModel.js";

export const createTag = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) {
      return res.status(400).json({
        status: "failed",
        message: "Tag name is required"
      });
    }
    const tag = await Tag.create({ name, color });
    res.status(201).json({
      status: "success",
      message: "Tag created successfully",
      data: tag
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: "failed",
        message: "Tag already exists"
      });
    }
    res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json({
      status: "success",
      message: "Tags fetched successfully",
      data: tags
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const tag = await Tag.findByIdAndDelete(tagId);
    res.status(200).json({
      status: "success",
      message: "Tag deleted successfully",
      data: tag
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const { name, color } = req.body;
    const tag = await Tag.findByIdAndUpdate(
      tagId,
      { name, color },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Tag updated successfully",
      data: tag
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};
