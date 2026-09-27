/**
 * Guarda una cookie por 35 días
 * 
 * @param {string} nombre - Nombre de la cookie
 * @param {string|number} valor - Valor a guardar
 */
export function save_cookie(nombre,valor) {
    document.cookie = (nombre+"=" +valor+ ";max-age=3072000");
}
