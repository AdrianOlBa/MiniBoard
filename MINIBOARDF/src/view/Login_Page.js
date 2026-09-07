/**
 * Crea la vista del formulario para Iniciar sesion o Registrarse
 * 
 * Conecta props a distintos eventos
 *
 * @param {Object} props Funciones controlador para manejar eventos.
 * @returns {{
 *   root: HTMLDivElement,
 *   update: Function,
 *   Form_data: Function,
 *   render: Function,
 *   Registered: Function,
 *   error: Function
 * }} Objeto con acceso a la vista y sus funciones 
 */
export function Login_Page(props) {
  const root = document.createElement('div');

  root.className = 'row h-100 d-flex align-items-center justify-content-center';
  root.id = "principalLogin";
  root.innerHTML = `
    <div class="d-flex justify-content-center">
      <div class="col-12 col-sm-10 col-md-10 col-lg-6">

        <div class="card shadow-sm">
          <div id="Form-container" class="card-body p-4">
            <h1 class="card-title text-center mb-4">Iniciar Sesión</h1>
          </div>
        </div>
      </div>
    </div>
  `;

  const Formulario = document.createElement("form")
  Formulario.id = "loginForm"
  Formulario.innerHTML = `
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
`
  root.querySelector('#Form-container').appendChild(Formulario)
  const ErrorMsg = Formulario.querySelector('#errorMsg')

  //Eventos manejados por props 
  Formulario.querySelector('#ChangueMode').addEventListener('click', props.onChangue);
  Formulario.addEventListener('submit', (e) => { e.preventDefault(); props.onSubmit(e); });



  /**
   * Recopila los valores actuales del formulario 
   * @returns {{correo: string, password: string, nombre: string|boolean, type: string}}
   *   Datos del formulario con el tipo de acción actual.
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
   * Actualiza la interfaz del formulario según el estado recibido.
   *
   * Cambia el título, el texto de cambio de modo y
   * agrega o elimina el campo nombre
   *
   * @param {Object} state Estado actual del formulario.
   */
  const update = (state) => {
    let FormBody = root.querySelector('#FormBody');
    let titulo = root.querySelector('.card-title');
    let mensaje = root.querySelector('#ChangueMode');
    Formulario.reset()
    ErrorMsg.classList.add("d-none")
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


  /**
   * Carga la vista dentro del contenedor indicado.
   * @param {HTMLElement} container Elemento raíz donde se montará la vista.
   */
  const render = (container) => {
    container.innerHTML = '';
    container.appendChild(root)
  }

  /**
   * Muestra un mensaje de error en la pantalla del formulario.
   * @param {string} errorMSG Texto de error.
   */
  const error = (errorMSG) => {
    console.log(errorMSG)
    ErrorMsg.classList.remove("d-none")
    ErrorMsg.textContent = errorMSG;
  }

  /**
   * Resetea el formulario y lo deja preparado para el modo de Login
   */
  const Registered = () => {
    Formulario.reset()
    update("Register")
  }


  return { root, update, Form_data, render, Registered, error };
}


