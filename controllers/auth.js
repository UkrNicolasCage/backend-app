const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");

const User = require("../models/user");

// const transporter = nodemailer.createTransport(sendgridTransport({
//   // auth:{
//   //   api_user:,
//   //   api_key
//   // }
// }));

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage[0]) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage,
    oldInput: { email: "", password: "" },
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: errors.array()[0].msg,
        oldInput: { email, password },
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "invalid email");
      res.redirect("/login");
    } else {
      const doMatch = await bcrypt.compare(password, user.password);
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        await req.session.save();
        res.redirect("/");
      } else {
        req.flash("error", "invalid password");
        res.redirect("/login");
      }
    }
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

exports.postLogout = async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/login");
};

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage[0]) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage,
    oldInput: { email: "", password: "" },
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      res.status(422).render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        errorMessage: errors.array()[0].msg,
        oldInput: { email, password },
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      password: hashedPassword,
      email: email,
      cart: { items: [] },
    });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    res.redirect("/login");
  }
};

exports.getReset = async (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage[0]) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage,
  });
};

exports.postReset = async (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "No account with that email found");
      return res.redirect("/reset");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
    return res.redirect(`/reset/${token}`);
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  let errorMessage = req.flash("error");
  if (errorMessage[0]) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  if (!user) {
    redirect("login");
  }

  res.render("auth/new-password", {
    path: "/new-password",
    pageTitle: "New Password",
    errorMessage,
    userId: user._id.toString(),
    passwordToken: token,
  });
};

exports.postNewPassword = async (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  const user = await User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  });

  const hashedPassword = await bcrypt.hash(password, 12);

  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiration = undefined;
  await user.save();
  res.redirect("/login");
};
