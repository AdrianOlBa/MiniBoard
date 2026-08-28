/**
 * funcion que limpia los datos de sesion
 */
export function cerrar_sesion() {
    document.cookie = "token=; max-age=0";
    document.cookie = "estado=; max-age=0";
    document.cookie = "correo=; max-age=0";
    document.cookie = "nombre=; max-age=0";
    document.cookie = "tema=; max-age=0";
}
