const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (value, { location, req }) => {
      const userDoc = await User.findOne({ email: value });
      if (userDoc) {
        return Promise.reject("E-mail exists already");
      }

      return true;
    }),
  body("password").isLength({ min: 6, max: 16 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords have to match");
    }
    return true;
  }),
  authController.postSignup
);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
