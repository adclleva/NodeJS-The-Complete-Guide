const crypto = require("crypto"); // library that helps us create secure random values

const bcrypt = require("bcryptjs");

const sgMail = require("@sendgrid/mail");

const { validationResult } = require("express-validator/check");

// sets up and connects to the sendgrid api
sgMail.setApiKey(`SG.${process.env.SENDGRID_API_KEY}`);

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
    // the inputs are initially empty
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
    });
  }

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

  // we get the errors by the middleware set up within the auth controllers by the express-validator package
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  // we instantly hash the new password
  bcrypt
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

      const emailMessageObject = {
        to: email,
        from: "arvin.lleva.al@gmail.com",
        subject: "Signup succeeded",
        text: "Testing Node Email Service",
        html: "<strong>You successfully signed up!</strong>",
      };

      sgMail
        .send(emailMessageObject)
        .then(() => {
          console.log("email sent");
        })
        .catch((err) => console.log(err));
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let errorMessage = req.flash("error");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: errorMessage,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    // logic to set the resetToken to the User
    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // adds an hour

        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        // the token is used to check from the database
        const emailMessageObject = {
          to: req.body.email,
          from: "arvin.lleva.al@gmail.com",
          subject: "Password Reset",
          text: "Testing Node Email Service",
          html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>           
          `,
        };

        sgMail
          .send(emailMessageObject)
          .then(() => {
            console.log("email sent");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  // we need to check if the user has a valid token to change a new password
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    // we use mongoDB's greater than comparision to check the time of the resetTokenExpiration
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let errorMessage = req.flash("error");

      if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
      } else {
        errorMessage = null;
      }

      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: errorMessage,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassowrd = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
