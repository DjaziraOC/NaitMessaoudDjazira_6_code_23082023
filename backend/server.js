//importer le package http de node.js pour avoir des outils (les méthodes des les fonctions)  
//pour créer le server
const http = require("http")

//importer l'application app.js (app.js:gère toutes les requêtes envoyé par le client vers le serveur)
const app = require("./app")

//importer le le package dotenv pour utiliser les variables de l'environnement
const dotenv = require("dotenv")
console.log("-----dotenv")
console.log(dotenv)

const resultat = dotenv.config()
console.log("----contenue de dotenv Config")
console.log(resultat)
//La fonction normalizePort renvoie un port valide, qu'il soit fourni 
//sous la forme d'un numéro ou d'une chaîne - Cela configure le port de 
//connection en fonction de l'environnement
const normalizePort = val => {
    const port = parseInt(val, 10)
  
    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}
//Si aucun port de connexion n'est fourni(n'est pas declarer par 
//l'environnement) on écoutera sur le port 3000
const port = normalizePort(process.env.PORT ||"3000")
// paramètrage du port avec la méthode set d'express 
app.set("port",port)
  
//la fonction errorHandler  recherche les différentes erreurs et les 
//gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
const errorHandler = error => {
    if (error.syscall !== "listen") {
        throw error
    }
    const address = server.address()
    const bind = typeof address === "string" ? "pipe " + address : "port: " + port
    switch (error.code) {
    case "EACCES":
        console.error(bind + " requires elevated privileges.")
        process.exit(1)
        break
    case "EADDRINUSE":
        console.error(bind + " is already in use.")
        process.exit(1)
        break
    default:
        throw error
    }
}

//la méthode createServer(retourne une nouvelle instance de http.server) 
//Elle prend en argument la fonction qui sera appelé à chaque requête reçu par le server, 
//les fonctions seront dans app.js
const server = http.createServer(app)//Lance le serveur et affiche sur quel port se connecter ou gère les erreurs s'il y en a
server.on("error", errorHandler)
server.on("listening", () => {  //on ecoute un évènement qui enregistre le port nommé sur lequel le serveur s'exécute dans la console
    const address = server.address()
    const bind = typeof address === "string" ? "pipe " + address : "port " + port
    console.log("Listening on " + bind)
})
 
//un écouteur d'évènements est également enregistré, consignant le port
//ou le canal nommé sur lequel le serveur s'exécute dans la console.
//on peut dire que le serveur écoute les requètes sur le port.
server.listen(port)
