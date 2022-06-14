require("dotenv").config();

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer"); // used to parse different kinds of data that isn't pure text

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = "mongodb+srv://arvin:mongodb123%21@cluster0.996hxxe.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

// disk storage engine from multer to use within the middleware
// this helps us control the path and file name
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single("image"));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash()); // give access to flash within the request object

// for CSRF protection in production environments
app.use((req, res, next) => {
  // setting up local variables that are passed to the views and will be avialable for each request
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken(); // this is provided by the csurf package
  next();
});

app.use((req, res, next) => {
  // this will only work for synchronous and the error middleware will catch it
  // throw new Error("Sync Dummy");

  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      // throw new Error("Dummy async error"); <- to test async errors
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);

      // this only works for async code and the error middleware will catch it
      next(new Error(err));
    });
});

// application routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

// express recognizes the error special middleware
app.use((error, req, res, next) => {
  // *** this is if we pass in the status code
  // res.status(error.httpStatusCode).render(...)
  console.log("ERROR:", error);
  // res.redirect("/500");

  res.status(500).render("500", {
    pageTitle: "Page Not Found",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
