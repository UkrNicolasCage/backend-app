const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("test", "root", "Vovakill441#", {
  dialect: "mysql",
  host: 'localhost'
});

module.exports = sequelize;
