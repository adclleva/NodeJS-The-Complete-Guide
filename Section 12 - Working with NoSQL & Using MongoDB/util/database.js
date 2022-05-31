const Sequelize = require("sequelize");

// this is the entire database collection pool package
const sequelize = new Sequelize("node-complete", "root", "mysql123!", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
