const dbConfig = require("../config/db.js");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};


db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./users.js")(sequelize, Sequelize);

db.sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database synchronized successfully.');
  });

module.exports = db;
