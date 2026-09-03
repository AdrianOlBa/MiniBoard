/**
 * obtiene el valor actual de una cookie segun un index
 * @param {string} cookie 
 * @returns {String}
 */
export function Search_Cookie(cookie) {
    let dumb_dictionary = {}
    for (let i of document.cookie.split("; ")) {
        let [index, valor] = i.split("=")
        console.log(index, valor)
        dumb_dictionary[index] = valor
    }
    return dumb_dictionary[cookie]
}



