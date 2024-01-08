const User = require("../models/usersModel");
const HttpError = require("../models/Http-Error");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid Inputs passed, please check your data",
      422
    );
    return next(error);
  }
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User already exists", 422);
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 422);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }
  res
    .status(201)
    .json({ user: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Login failed", 500);
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError("User does not exist", 422);
    return next(error);
  }
  let validPassword = false;
  try {
    validPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Loging in failed, please try again.", 500);
    return next(error);
  }

  if (!validPassword) {
    const error = new HttpError("Invalid credentials, Please try again", 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Login failed, please try again...", 500);
    return next(error);
  }
  res.status(200).json({
    email: existingUser.email,
    token,
  });
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, Please try again later",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.signup = signup;
exports.login = login;
exports.getUsers = getUsers;
