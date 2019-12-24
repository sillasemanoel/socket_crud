var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

const db = require("./db/index");

app.get("/", function(req, res) {
  res.send({ status: "api online" });
});

io.on("connection", function(socket) {
  console.log("novo usuario: ", socket.id);

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

        socket.emit("CONTACT_DELETED_SUCCESS", {
          status: "Usuario removido com sucesso"
        });
      },
      () => db.end() // depois de executar a consulta, fecha a conexao
    );
  });
});

http.listen(4000, function() {
  console.log("listening on *:4000");
});
