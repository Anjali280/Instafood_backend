const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../configurations/config");

/*
*
*FOR SIGN IN PURPOSE
validaotor is mainly for the validation of name , email and password by express validator
* 
*/
router.post(
  "/createUser",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let securePassword = await bcrypt.hash(req.body.password, salt);

    try {
      await User.create({
        name: req.body.name,
        password: securePassword,
        email: req.body.email,
        location: req.body.location,
      })
        .then(res.json({ success: true }))
        .catch((err) => {
          console.log(err);
          res.json({ error: "Error while creating a USER" });
        });
    } catch (err) {
      console.log(err);
      res.json({ success: false });
    }
  }
);

/*
*
For LOGIN PURPOSE
*
*/
router.post(
  "/loginuser",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Try Logging in with correct credentials" });
      }

      const pwdCompare = await bcrypt.compare(password, user.password);
      if (!pwdCompare) {
        return res
          .status(400)
          .json({ success, error: "Try Logging in with correct credentials" });
      }

      /*Generation of JWT Token*/
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      const authToken = jwt.sign(data, config.JWT_SECRET_KEY);
      return res.json({ success: true, authToken });
    } catch (error) {
      console.error(error.message);
      res.send("Server Error");
    }
  }
);

/*
*
For 
*
*/
module.exports = router;
