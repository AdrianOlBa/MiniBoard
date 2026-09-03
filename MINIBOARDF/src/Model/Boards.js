export class Board {

    async Delete_Diagrama(token, datos) {

        let resp_serv = await (await fetch('http://localhost:3000/User/Delete', { method: "POST", headers: { 'Content-Type': 'application/json', token: token }, body: JSON.stringify(datos) })).json();
      
        return resp_serv

    }

    async Add_Diagrama(token, datos) {
        console.log(datos)
        let resp_serv = await (await fetch('http://localhost:3000/User/Create', { method: "POST", headers: { 'Content-Type': 'application/json', token: token }, body: JSON.stringify(datos) })).json();
        return resp_serv
    }

    async Change_Favorite_Diagrama(token, datos) {
        let resp_serv = await (await fetch('http://localhost:3000/User/ChangueFavorite', { method: "POST", headers: { 'Content-Type': 'application/json', token: token }, body: JSON.stringify(datos) })).json();
        return resp_serv
    }


}