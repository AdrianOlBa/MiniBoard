export function save_cookie(nombre,valor) {
    document.cookie = (nombre+"=" +valor+ ";max-age=3072000");
}
