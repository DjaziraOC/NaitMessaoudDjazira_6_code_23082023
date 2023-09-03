//----------Import des modules Node.js qui s'installe avec NPM-----------------
//----------------------------Express--------------------------------------------
//---------->Importation d'express, framework basé sur node.js
//L'application utilise le framework express
const express = require("express") 
//---------->Déclaration de constante app
const app = express() 
//---------->Express.json
//permet d'éviter d'importer le BodyParser,c'est une fonction middleware
//(méthode)intégré dans Express 
//Analysera les corps de toutes les demandes entrantes et il est basé sur 
//body-parser.Renvoie un middleware qui analyse uniquement json
app.use(express.json())

//--------------------------Morgan---------------------------------------------
//---------->Importation morgane (logger http)
const morgan = require ("morgan")
//---------->logger les request et response
app.use(morgan("dev"))
//Il faut paramètrer (on a le paramètrage qui est pris dev qui est un
//format prédéfini :method :url :status :response-time ms - :res[content-length])

//--------------------------Path---------------------------------------------
//--------->Importation le plugin path de node js pour upload des images et permet 
//de travailler avec les chemin des fichiers et des répertoires 
const path = require("path")

//--------------------------MongoBD-------------------------------------------
//-------->Importation de la connexion de la base de donnée MongoBD
const mongoose = require ("./db/db")
//-------->debugger Mongoose
//s'applique sur toutes les routes 
console.log("----->debug logger mongoose")
mongoose.set("debug",true)

//------------------------------CORS-------------------------------------------
/*Configurer le CORS pour accepter toutes les requêtes quelque soit l'origine de serveur
//Il permet de prendre en charge toutes les requêtes multi-origins sécurisées
//et le transferts des données entres les navigateurs et des serveurs web.
//en ajoutant des headers qui permettent aux serveur  de  décrire un ensemble 
//d'origine autorisées pour lire les informations depuis un navigateur web*/  
//la méthode setHeader 
//Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, 
//afin que tout le monde puisse faire des requetes depuis son navigateur
const cors = require("cors")
app.use(cors({
    origin : [process.env.ORIGINE_1,process.env.ORIGINE_2,process.env.ORIGINE_3],
    methods: ["GET", "POST","PUT","DELETE", "PATCH", "OPTIONS"],
}))
app.use((req, res, next) => {
    // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
    // res.setHeader("Access-Control-Allow-Origin","*")
    // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization")
    // on indique les méthodes autorisées pour les requêtes HTTP
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
    // on autorise ce serveur à fournir des scripts pour la page visitée
    res.setHeader("Content-Security-Policy", "default-src 'self'")  
    res.setHeader("Access-Control-Allow-Credentials",true)
    next()
})

//--------------------------Les routes-----------------------------------------
//--->Importation des routes/dédiée aux utilisateurs
const userRoutes = require("./routes/user")
//--->Importation des routes/dédiées aux sauces
const saucesRoutes = require("./routes/sauces")

//--------------------Le gestionnaire de routage--------------------------------

//----------------------la route d'authentification------------------------
//pour créer une route il faut un URL= URI: une chaine qui fait référence à
//une resource+endpoint:point de terminaison pour accéder à la ressource
//Dans l'authentification on a un login(pour s'identifier) et sign-up
//(pour créer un compte).
app.use("/api/auth",userRoutes)//URI=/api/auth

//--------------------------la route de sauce------------------------------
app.use("/api/sauces",saucesRoutes)//URI=/api/sauces

//--------------------------------------------------------------------------
//On indique à Express qu'il faut gérer la ressource images de manière 
//statique (un sous-répertoire de notre répertoire de base, __dirname) 
//à chaque fois qu'elle reçoit une requête vers la route /images joint
// tous les ségments de chemins le nom de répertoire __dirname

app.use("/images",express.static(path.join(__dirname,"images")))


//-------------------* Sécurité **OWASP** et **RGPD**------------------------
// L’Open Web Application Security Project (OWASP) 
// est un organisme impartial, mondial et sans but lucratif. Il s’agit du 
// premier effort de normalisation des pratiques de développement sécurisé. 
/* -->le compilateur Caja est un outil permettant de sécuriser l'intégration 
//   de HTML, CSS et JavaScript tiers dans le site Web.comme dans le cas 
// -->de Mongoose-sanitizerPlugin,utilise le HTML Sanitizer de Google Caja
//   pour effectuer la désinfection.
// -->le plugin uniqueValidator valide l'unicité de l'email
// -->passwordValidator:permets d’avoir un mot de passe plus sécurisé et fort 
// -->le hachage de mot de passe avec le Bcrypt de mongoose renfoce la sécurité de l'app
// -->l'attribution d'un token à un utilisateur au moment ou il se connecte
// -->ESLint:compare le code source à un ensemble de règles qui ont été 
     définit et il aide à les respecter 
// -->Helmet aide à sécuriser les applications Express en définissant divers 
     en-têtes /définit quatre en-têtes*/

const helmet = require("helmet")
app.use(helmet())

// -->cookie-session :sécurise les cookies
const session = require("cookie-session")
const expiryDate = new Date(Date.now() + 3600000) // 1 heure (60 * 60 * 1000)
app.use(session({
    name: "session",
    secret: process.env.SEC_SESSION,
    cookie: {
        secure: true,
        httpOnly: true,
        domain: "http://localhost:3000",
        expires: expiryDate
    }
}))

// -->nocache: permet de désactiver une grande partie de la mise en cache du navigateur
// en définissant certains en-têtes de réponse HTTP
const nocache = require("nocache") 
app.use(nocache())

//-----------------------Export de l'application----------------------------
//Export de l'application express pour pouvoir y accéder depuis un autre fichier //pour la déclarer dans server.js
module.exports = app

//Remarque:lorsque le front (client) envoi une requête sur la webAPI, 
//les reqêtes seront obligées de passer par le fichier serveur, 
//après passera dans le fichier app.js