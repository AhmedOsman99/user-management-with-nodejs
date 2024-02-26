const db = require("../models/index.js");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
require("dotenv").config();

const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 1;

    
    const offset = (page - 1) * limit;

    const { count, rows } = await db.User.findAndCountAll({
      offset,
      limit,
      attributes: ['id', 'username', 'email']
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      totalUsers: count,
      totalPages,
      currentPage: page,
      users: rows
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword };
    const user = await db.User.create(newUser);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const token = sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, username } = req.body;
    const updates = {};
    if (email) updates.email = email;
    if (username) updates.username = username;

    const [updatedRowsCount, updatedRows] = await db.User.update(updates, {
      returning: true,
      where: { id },
    });
    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedRowCount = await db.User.destroy({
      where: { id },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
