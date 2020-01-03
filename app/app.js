// pega elemento que vai listar
var contatos = document.getElementById("listacontato");

// class bootstrap da lista
var classNameList =
  "list-group-item d-flex justify-content-between align-items-center";

// conexao
var socket = io("http://localhost:4000/");

// eventos
// _list_contacts é como se tivesse aqui dentro, mas resolvi separar
// mas ela ainda recebe os paramentros que vem do socket
socket.on("LIST_CONTACTS", _list_contacts);
socket.on("CONTACT_DELETED", _alert_contact_deleted);
socket.on("CONTACT_EDITED", _alert_contact_edited);

/**
 * renderiza os usuarios
 *
 * @socket_event LIST_CONTACTS
 * @param {Array} contacts dados que vem do socket
 */
function _list_contacts(contacts) {
  contacts.forEach((contact, index) => {
    // linha para segurar o nome e os botoes
    const div = document.createElement("div");
    div.className = classNameList;

    // define atributos para editar/remover
    div.setAttribute("data-user-nome", contact.name);
    div.setAttribute("data-user-id", contact.id);
    div.setAttribute("data-user-index", index);

    // span para o nome
    const span = document.createElement("span");
    // usado para buscar o usuario editado
    // veja na funcao que envia $('#form_edit').submit
    span.setAttribute("id", `user-${contact.id}`);
    span.textContent = contact.name;

    // button edit
    const button_e = document.createElement("button");
    button_e.textContent = "Editar";
    button_e.className = "btn btn-outline-warning";

    // evento click no botao editar
    button_e.onclick = function(e) {
      $("#modal-edit").modal("show");

      // esse botao está dentro de uma div que o segura esse
      // o de deletar, porem os atributos estao na div (linha) que
      // segura todos, ou seja, 2 niveis a vima
      const attrs = _get_attrs_from_row(this.parentNode.parentNode);

      $("#form_edit_nome").val(attrs.user_nome);
      $("#form_edit_id").val(attrs.user_id);

      console.log(attrs);
    };

    // button delete
    const button_d = document.createElement("button");
    button_d.textContent = "Remover";
    button_d.className = "btn btn-outline-danger";

    // evento click no botao deletar
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

    // div que segura os dois botoes, pois a div (linha) esta com estilo
    // flex e justify-content: space-between ( os dois botoes tem q ficar juntim )
    // <span>nome</span>             <div> button1 button2</div>
    const rightDiv = document.createElement("div");

    // coloco os dois botoes na div rightDiv
    rightDiv.appendChild(button_e);
    rightDiv.appendChild(button_d);

    // coloque na linha o nome
    // depois a div que segura os dois botoes
    div.appendChild(span);
    div.appendChild(rightDiv);

    // coloque a linha na #listacontato
    contatos.appendChild(div);
  });

  /**
   * retorna o data-user-id e data-user-index da linha que segura os botoes,
   * quando clicado em um dos botoes
   *
   * @param {HTMLElement} elem
   *
   * @returns {{user_nome: string, user_id: string, user_index: string}}
   */
  function _get_attrs_from_row(elem) {
    const user_nome = elem.getAttribute("data-user-nome");
    const user_id = elem.getAttribute("data-user-id");
    const user_index = elem.getAttribute("data-user-index");

    return { user_nome, user_id, user_index };
  }
}

/**
 * alerta se usuario foi removido ou nao
 *
 *
 * @socket_event CONTACT_DELETED
 * @param {Object} data
 * @param {string} data.status
 */
function _alert_contact_deleted(data) {
  alert(data.status);
}

/**
 * alerta se usuario foi removido ou nao
 *
 *
 * @socket_event CONTACT_EDITED
 * @param {Object} data
 * @param {string} data.status
 */
function _alert_contact_edited(data) {
  alert(data.status);
}

$("#form_edit").submit(function() {
  let id = Number($("#form_edit_id").val());
  let nome = $("#form_edit_nome").val();

  // transformo em json
  // mesmo que {id: id, nome: nome}
  // {id: id} = {id}
  const dados = { id, nome };

  console.log(dados);

  socket.emit("EDIT_CONTACT", dados);

  // no span tem o id do usuario
  // quando abro o model tenho o id do usuario q vai atualizar
  // ai consigo pegar assim :)
  $(`#user-${id}`).text(nome);

  $(`#user-${id}`)
    .parent()
    .attr("data-user-nome", nome);

  $("#modal-edit").modal("hide");

  // evita o form seguir em frente
  return false;
});
