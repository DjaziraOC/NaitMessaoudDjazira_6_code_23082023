
//-----------------------Connexion MongoBD Atlas--------------------------
//--------------------------MongoBD Atlas---------------------------------
//la base de donnée MongoDB Atlas hébérgée dans le cloud et gratuite
//elle stocke des données de type JSON
//mongoose.connect permet à se conneté à la base de donnée et le fichier 
//.env cache les informations de connexion, il rend la connexion plus 
//sécurisé

//----------------------------mongoose----------------------------------
//mongoose est un module Node.js qui s'installe avec NPM dans le node_modules 
//permet d'intéragir avec la base de données MongoDB Atlas et d'implémenter 
//des schémas de données stricts qui permettent de rendre notre application 
//plus robuste

//Importation de Mongoose pour se connecter à la data base Mongo Db
const mongoose = require("mongoose")

//--------------------------dotenv---------------------------------------------
//importer le package dotenv pour utiliser les variables de l'environnement
//pour but de sécuriser l'appliquation en masquant les informations de 
//connexion à la base de données.
const dotenv = require("dotenv")
console.log("------dotenv") 
console.log(dotenv) 


const dotenvConfig = dotenv.config()
console.log("----contenue de dotenv Config")
console.log( dotenvConfig)

console.log("----contenue de process")
console.log(process.env.DB_USERNAME)

//------------------------Connexion MongoBD Atlas-------------------------------------------
//Connexion  la base de donnée avec la package "mongoose"et avec la 
//sécurité vers le fichier .env pour cacher les informations de connexion 

mongoose
    .set("strictQuery", false)
mongoose
    .connect(
        
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`
        ,{useNewUrlParser: true,
            useUnifiedTopology: true}
    )
    .then(() => console.log("Connexion à MongoDB réussie !")) 
    .catch(() => console.log("Connexion à MongoDB échouée !"))

module.exports = mongoose

