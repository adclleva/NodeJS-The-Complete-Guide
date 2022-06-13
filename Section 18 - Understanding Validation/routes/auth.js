const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

// after setting up a path, we can set up as many middlewars and control handlers as we want

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

// email validation
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email triggers our custom validation");
        // }
        // have to return true for the validations to pass
        // return true

        // we throw an error inside the promise and we return a promise and express-validator will wait for this promise to be fulfilled
        // this is an asynchronous validation
        return User.findOne({ email: value }).then((userDocument) => {
          if (userDocument) {
            return Promise.reject(
              // this will be stored as an error message
              "E-mail exists alread, please pick a different one."
            );
          }
        });
      }),

    // this will validation the req body
    // adding the message to the second parameter displays the message for all validation error checks
    body("password", "Please enter a password with only numbers and text and at least 5 characters")
      .isLength({ min: 5 })
      .isAlphanumeric(),

    // this validation checks if the password and confirmPassword is the same
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassowrd);

module.exports = router;
