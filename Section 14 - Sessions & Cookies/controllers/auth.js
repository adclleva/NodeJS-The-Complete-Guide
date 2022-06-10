exports.getLogin = (req, res, next) => {
  // to grab and setup the cookie
  // let isAuthenticated = false;
  // let cookieString = req.get("Cookie");

  // if (cookieString) {
  //   let cookieArray = cookieString.split(";");

  //   cookieArray.forEach((cookie) => {
  //     if (cookie.includes("loggedIn")) {
  //       isAuthenticated = cookie.split("=")[1] === "true";
  //     }
  //   });
  // }
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // we save this session via server side, which the data is saved across requests but not users
  // it's best to save the session data within the database and not in memory because it won't scale well
  req.session.isLoggedIn = true;

  // this redirect completes the request
  res.redirect("/");
};
