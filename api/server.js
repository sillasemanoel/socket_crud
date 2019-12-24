var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
// pega as variaveis de .env
require("dotenv").config();

const db = require("./db/index");

// base da api
// http://localhost:4000/
app.get("/", function(req, res) {
  res.send({ status: "api online" });
});

// socket
io.on("connection", function(socket) {
  // console.log("novo usuario: ", socket.id);

  db.query(
    "SELECT * FROM users",
    (err, result) => {
      if (err) {
        throw err;
      }

      socket.emit("LIST_CONTACTS", result);
    },
    () => db.end() // depois de executar a consulta, fecha a conexao
  );

  socket.on("DELETE_CONTACT", contact => {
    db.query(
      "DELETE FROM users WHERE id = ?",
      [contact.id],
      (err, result) => {
        if (err) {
          throw err;
        }

        console.log("user", contact, "deleted");

        socket.emit("CONTACT_DELETED", {
          status: "Usuario removido com sucesso"
        });
      },
      () => db.end() // depois de executar a consulta, fecha a conexao
    );
  });

  socket.on("EDIT_CONTACT", contact => {
    db.query(
      "UPDATE users set name = ? WHERE id = ?",
      [contact.nome, contact.id],
      (err, result) => {
        if (err) {
          throw err;
        }

        console.log("user", contact, "edited");

        socket.emit("CONTACT_EDITED", {
          status: "Usuario editado com sucesso"
        });
      },
      () => db.end() // depois de executar a consulta, fecha a conexao
    );
  });
});

http.listen(process.env.APP_PORT, function() {
  console.log("listening on:", process.env.APP_PORT);
});
