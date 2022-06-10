exports.getLogin = (req, res, next) => {
  // to grab and setup the cookie
  let isAuthenticated = false;
  let cookieString = req.get("Cookie");

  if (cookieString) {
    let cookieArray = cookieString.split(";");

    cookieArray.forEach((cookie) => {
      if (cookie.includes("loggedIn")) {
        isAuthenticated = cookie.split("=")[1] === "true";
      }
    });
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  // we save this session via server side, which the data is saved across requests but not users
  req.session.isLoggedIn = true;

  // this redirect completes the request
  res.redirect("/");
};
