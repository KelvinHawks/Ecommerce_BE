const express = require("express");
const { check } = require("express-validator");
const userControlers = require("../users-controlers/Users");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userControlers.signup
);
router.post("/login", userControlers.login);
router.get("/", userControlers.getUsers);

module.exports = router;
