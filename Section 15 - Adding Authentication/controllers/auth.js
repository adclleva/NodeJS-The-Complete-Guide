const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: errorMessage,
  });
};

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash("error");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: errorMessage,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      // if user doesn't exist
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      } else {
        // compares the inputted password with the password from the data base and also returns a promise
        bcrypt
          .compare(password, user.password)
          .then((passwordMatches) => {
            if (passwordMatches) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save((err) => {
                console.log(err);
                res.redirect("/");
              });
            } else {
              req.flash("error", "Invalid email or password");
              return res.redirect("/login");
            }
          })
          .catch((err) => {
            console.log(err);
            // if the comparison fails
            res.redirect("/login");
          });
      }
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // to find any user duplicates within the database
  User.findOne({
    email: email,
  })
    .then((userDocument) => {
      if (userDocument) {
        req.flash("error", "E-mail exists already, please pick a different one.");
        return res.redirect("/signup");
      } else {
        // this returns a promise and we want to make the password secured by hashing it
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              email: email,
              password: hashedPassword,
              cart: {
                items: [],
              },
            });

            return user.save();
          })
          .then((result) => {
            res.redirect("/login");
          });
      }
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
