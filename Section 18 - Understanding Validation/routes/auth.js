const express = require("express");
const { check } = require("express-validator/check");

const authController = require("../controllers/auth");

const router = express.Router();

// after setting up a path, we can set up as many middlewars and control handlers as we want

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

// email validation
router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
      if (value === "test@test.com") {
        throw new Error("This email triggers our custom validation");
      }
      return true;
    }),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassowrd);

module.exports = router;
