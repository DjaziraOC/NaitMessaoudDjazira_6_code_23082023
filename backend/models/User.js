//----------------------------Modèle d'utilisateur------------------------------
//Exporter le modèle de schéma de donnée 'userSchema'contenant le mail et
//mdp pour enregistrer un nouvel utilisateur dans la base de donnée mongoDB,
//l'unicité de mail vérifié et validé par la méthode plugin (uniqueValidator) 
//aplliqué à userSchema, et l'expression régulière mis en place 
//pour contrôler et valider le format de mail
//plugin(sanitizerPlugin) aplliqué à userSchema pour purifie les champs 
//du model avant de les enregistrer dans la base MongoDB

//--------------------------Importation des modules--------------------------
//Importation de module de mongoose
const mongoose = require("mongoose")

//Importation mongoose-unique-validator (pour l'email)
const uniqueValidator = require("mongoose-unique-validator") 

//Importation mongoose-sanitizerPlugin
const sanitizerPlugin = require("mongoose-sanitizer-plugin")

//------------------------mongoose.Schema/user---------------------------
//On crée un schéma de données pour le signup,qui permet d'enregistrer un 
//nouvel utilisateur.
//Pour créer ce schéma, il suffit d'utiliser l'objet Schema de mongoose 
//et remettre les clé et les values

const userSchema = mongoose.Schema({
//Pour enregistrer un nouvel utilisateur, il faut un mail de type string,
//unique (true) au niveau de la base de donnée (required), 
//On utilise l'expression régulière pour valider le format d'email.
    
    //L'email doit être unique
    email:{
        type:String, 
        unique: true, 
        required: [true,"Veuillez entrer votre adresse email"],
        match: [/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez entrer une adresse email correcte"]
    },
    //Enregistrer du mot de passe
    password:{
        type:String, 
        required:[true,"Veuillez choisir votre mot de passe"]
    }
})
console.log("----userSchema")
console.log(userSchema)
//-------------------Mongoose-validators-unique----------------------------------

//On applique le plugin uniqueValidator à userSchema (schéma)avant
//d'en faire un modèle user et on appelle la méthode plugin et on lui 
//passe uniqueValidator, permet de garantir un email unique pour ne pas 
//enregistrer 2 fois ou plus avec la même adresse email

userSchema.plugin(uniqueValidator)

//-------------------Mongoose-sanitizerPlugin----------------------------------
//plugin pour Mongoose qui purifie les champs du model avant de les 
//enregistrer dans la base MongoDB.
//On utilise le HTML Sanitizer de Google Caja pour effectuer cette désinfection.
userSchema.plugin(sanitizerPlugin)

//-----------------------------Model-----------------------------------------
//Exportation de modèle de schéma de données 'userSchema' pour 
//intéragir avec l'application
module.exports = mongoose.model("user",userSchema)

