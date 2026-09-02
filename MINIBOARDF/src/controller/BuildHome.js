import { Home_Page } from "../view/Home_Page.js";

/**
 * Controller del modulo de Login 
 */
export class BuildHome {

  constructor() {
    this.estado="Home"//favoritos... , ajustes
    this.view = Home_Page(); 
  }

  /**
   * Dibuja sobre un contenedor el contenido de la vista
   * @param {HTMLElement} container 
   */
  render(container) {
    this.container = container;
    this.container.innerHTML = '';
    console.log(container)
    this.view.render(container);
  }

  destroy() {
    if (this.container) this.container.innerHTML = '';
  }

}