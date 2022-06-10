const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("62a1177c8368104cec55dc29")
    .then((user) => {
      // we save this session via server side, which the data is saved across requests but not users
      // it's best to save the session data within the database and not in memory because it won't scale well
      // with sessions we can share data across requests
      req.session.isLoggedIn = true;
      req.session.user = user;

      // this redirect completes the request
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
