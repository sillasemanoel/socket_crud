var contatos = document.getElementById("listacontato");
var classNameList =
  "list-group-item d-flex justify-content-between align-items-center";

// conexao
var socket = io("http://localhost:4000/");

// eventos
socket.on("LIST_CONTACTS", _list_contacts);
socket.on("CONTACT_DELETED_SUCCESS", _alert_contact_deleted);

/**
 * renderiza os usuarios
 *
 * @param {Array} contacts dados que vem do socket
 */
function _list_contacts(contacts) {
  contacts.forEach((contact, index) => {
    // linha
    const div = document.createElement("div");
    div.className = classNameList;
    div.setAttribute("user-id", contact.id);
    div.setAttribute("array-index", index);

    // span
    const span = document.createElement("span");
    span.textContent = contact.name;

    // button edit
    const button_e = document.createElement("button");
    button_e.textContent = "Editar";
    button_e.className = "btn btn-outline-warning";

    button_e.onclick = function(e) {
      $("#modal-edit").modal("show");

      // esse botao está dentro de uma div que o segura esse
      // o de editar, porem os atributos estao na div (linha) que
      // segura todos, ou seja, 2 niveis a vima
      const attrs = _get_attrs_from_row(this.parentNode.parentNode);

      console.log(attrs);
    };

    // button delete
    const button_d = document.createElement("button");
    button_d.textContent = "Remover";
    button_d.className = "btn btn-outline-danger";

    button_d.onclick = function(e) {
      // esse botao está dentro de uma div que o segura esse
      // o de editar, porem os atributos estao na div (linha) que
      // segura todos, ou seja, 2 niveis a vima
      const attrs = _get_attrs_from_row(this.parentNode.parentNode);

      console.log(attrs);

      const ok = confirm("Deseja realmente deletar esse usuario?");

      if (ok) {
        socket.emit("DELETE_CONTACT", contact);

        this.parentNode.parentNode.remove();
      }
    };

    const rightDiv = document.createElement("div");

    rightDiv.appendChild(button_e);
    rightDiv.appendChild(button_d);

    div.setAttribute("data-user-id", contact.id);
    div.setAttribute("data-user-index", index);

    div.appendChild(span);
    div.appendChild(rightDiv);

    contatos.appendChild(div);
  });

  /**
   * retorna o data-user-id e data-user-index da linha que segura os botoes
   *
   * @param {HTMLElement} elem
   *
   * @returns {{user_id: string, user_index: string}}
   */
  function _get_attrs_from_row(elem) {
    const user_id = elem.getAttribute("data-user-id");
    const user_index = elem.getAttribute("data-user-index");

    return { user_id, user_index };
  }
}

/**
 * alerta se usuario foi removido ou nao
 *
 * @param {Object} data
 * @param {string} data.status
 */
function _alert_contact_deleted(data) {
  alert(data.status);
}
