import Role from "../models/roleModel.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if role with the same name already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "Role name already exists." });
    }
    const newRole = new Role({ name });
    await newRole.save();
    return res.status(201).json(newRole);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return res.status(404).json({ message: "Role not found." });
    }
    return res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found." });
    }
    return res.status(200).json(updatedRole);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
