/**
 * @typedef {Object} Login_return
 * @property {HTMLElement} root - Formulario dibujado
 * @property {Function} update - Actualizar la vista del formulario
 * @property {Function} Formdata - Extraer datos del formulario
 */



/**
 * Crea la vista del formulario de Login, funciones de Inicio de sesion y registro.
 * 
 * @param {Object} props Funciones delegadas por el controlador para el manejo de eventos.
 * @param {Function} props.onChangue acciones realizadas al cambiar el estado del form
 * @param {Function} props.onSubmit acciones realizadas al subir el form
 * @returns {Login_return}
 */
export function Login_Page(props) {
  const root = document.createElement('div');

  root.className = 'd-flex vh-100 vw-100 align-items-center justify-content-center';
  root.id = "principalLogin";
  root.innerHTML = `
    <div class="row w-100 justify-content-center">
      <div class="col-12 col-sm-10 col-md-10 col-lg-6">

        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h1 class="card-title text-center mb-4">Iniciar Sesión</h1>

            <form id="loginForm">
              <div id="FormBody">   
                <div class="mb-3">
                  <label for="correo" class="form-label">Correo electrónico</label>
                  <input type="email" id="correo" class="form-control" required autocomplete="email">
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input type="password" id="password" class="form-control" required autocomplete="current-password">
                </div>
              </div>
              <div id="ChangueMode" class="cambiar-modo d-flex justify-content-end px-3"> No tienes cuenta? Registrate </div>

              <div id="errorMsg" class="alert alert-danger d-none mb-3" role="alert"></div>
              
              
              
              <div  class="d-flex justify-content-center mt-4">
                <button type="submit" id="submit-Btn" class="w-50 btn btn-primary">
                  Ingresar
                </button>
              </div>



            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  //Event Listener con logica delegada al controlador
  root.querySelector('#ChangueMode').addEventListener('click', props.onChangue);
  root.querySelector('#loginForm').addEventListener('submit', (e) => { e.preventDefault();  props.onSubmit(e); });



  /**
   * Extraer datos del formulario Login/Register
   * @returns {Object} Datos del formulario (correo, password, ?nombre)
   */
  const Form_data = () => {
    let nombre = false;
    let type = "Login";

    const correo = root.querySelector('#correo').value || 'plcholder';
    const password = root.querySelector('#password').value || "placeholder";
    const nameInput = root.querySelector('#name');

    if (nameInput) {
      nombre = nameInput.value
      type = "Register";
    }

   
    return { correo, password, nombre, type }
  }



  /**
   * Alterar campos del formulario segun el estado actual (Login/Register)
   * @param {String} state estado actual del formulario
   */
  const update = (state) => {
    let Form = root.querySelector('#loginForm');
    let FormBody = root.querySelector('#FormBody');
    let titulo = root.querySelector('.card-title');
    let mensaje = root.querySelector('#ChangueMode');

    switch (state.estado) {
      case "Login":
        let nameInput = document.createElement('div');
        nameInput.className = 'mb-3';
        nameInput.innerHTML =
          `     
                <label for="name" class="form-label">Nombre</label>
                <input type="text" id="name" class="form-control" required>
              `
        FormBody.prepend(nameInput);
        titulo.textContent = "Registrar Cuenta";
        mensaje.innerHTML = "Ya tienes cuenta? Inicia sesión";
        break;
      case "Register":
        FormBody.removeChild(root.querySelector('#name').parentElement)
        titulo.textContent = "Iniciar Sesion";
        mensaje.innerHTML = "No tienes cuenta? Registrate";
        break;
    };
  };

  return { root, update, Form_data };
}


