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
  // to set a cookie which holds data specific to each user
  res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");

  // this redirect completes the request
  res.redirect("/");
};
