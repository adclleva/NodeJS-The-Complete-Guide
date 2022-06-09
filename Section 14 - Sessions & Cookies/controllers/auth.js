exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // we set this within the request middleware to be true once logged in successfully
  req.isLoggedIn = true;

  // this redirect completes the request
  res.redirect("/");
};
