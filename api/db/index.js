var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "a0l11e4x23",
  database: "phone_book"
});

module.exports = connection;
