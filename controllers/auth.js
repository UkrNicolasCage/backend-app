const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error");
  if(errorMessage[0]){
    errorMessage = errorMessage[0]
  }else{
    errorMessage = null
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

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
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      req.flash("error", "E-mail exists already, please pick a different one.");
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        password: hashedPassword,
        email: email,
        cart: { items: [] },
      });
      await user.save();
    }
  } catch (err) {
  } finally {
    res.redirect("/login");
  }
};
