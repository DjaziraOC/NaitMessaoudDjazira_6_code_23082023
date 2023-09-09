//------------------------------Modèle pour les sauces----------------------------------
//Mise en place du schéma de donnée (sauce) avec la méthode Schema de 
//mongoose.
//on applique la fonction validate sur le shéma pour ajouter des instructions 
//afin de contrôler et de valider ce qu'on envoi dans la base de donnée.
//et avec le sanitizer-plugin de mongoose on peut purifie les champs du 
//shéma de données avant de les enregistré dans la base MongoDB sous 
//forme de modèle et d'intéragir avec mongoDB.


//--------------------------------Importation des modules----------------------------------
//-->Importation de module de mongoose
const mongoose = require("mongoose")

//Importation de module de mongoose-validator
const validate = require("mongoose-Validator") 

//Importation de module de sanitizerPlugin
const sanitizerPlugin = require("mongoose-sanitizer-plugin")

//-----------------------1:Mongoose-Validator------------------------------------
//Mongoose contient des fonctions comme Validate permet d'ajouter des
//instructions pour contrôler ce qu'on envoi dans la base de donnée.

//-----instructions pour contrôler Le nom de la sauce
// Validation du champ 'nom de la sauce'
var name_validator = [ 
    validate({
        validator: "isLength",
        arguments: /^[^0-9]/i,
        message: "Vous ne pouvez pas utiliser que des chiffres",
    }),
    validate({
        validator: "matches",
        arguments: /^[^0-9]/i,
        message: "Vous ne pouvez pas utiliser que des chiffres",
    }) 
]

//-----instructions pour contrôler manufacturer
// Validation pour le manufacturer
var manufacturer_validator =[
    validate({
        validator: "isLength",
        arguments: /^[^0-9]/i,
        message: "Vous ne pouvez pas utiliser que des chiffres",
    }),
    validate({
        validator: "matches",
        arguments: /^[^0-9]/i,
        message: "Vous ne pouvez pas utiliser que des chiffres",
    })    
]

//-----instructions pour contrôler le champ description
// Validation pour la description
var description_validator =[ 
    validate({
        validator: "isLength",
        arguments: [5,1000], 
        message: "La description de produit doit contenir entre 5 et 1000 caractères",
    }),
    validate({
        validator: "matches",
        arguments: /^[^0-9]/i,
        message: "Vous ne pouvez pas utiliser que des chiffres",
    }),
]

//-----instructions pour contrôler le champ principal ingrédient de la sauce
// Validation pour mainPepper de la sauce
var mainPepper_Validator = [ 
    validate({
        validator: "isLength",
        arguments: [3, 500], 
        message: "Le principal ingrédient doit contenir entre 3 et 100 caractères",
    }),
    validate({
        validator: "matches",
        arguments: /^[^0-9]/i,
        message: "Vous ne pouvez pas utiliser que des chiffres",
    }),
]

//-----------------------2:Mongoose.Schema/sauce------------------------------------
//Un schema mangoose pour que les données de la base MongoDB ne puissent pas 
//différer de celui précisé dans le schema Modèle des sauces. 
//L'id est généré automatiquement par MongoDB
const sauceSchema = new mongoose.Schema({
//--1: UserId du createur de la sauce (l'identifiant MongoDB unique) 
    userId: {
        type: String,
        required: true
    },
    //--2: Nom de la sauce
    name: {
        type: String,
        required: true, 
        validate: name_validator
    },
    //--3: Fabricant de la sauce
    manufacturer: {
        type: String,
        required: true,
        validate: manufacturer_validator  
    },
    //--4: Description de la sauce
    description: {
        type: String,
        required: true,
        validate: description_validator
    },
    //--5: Le principal ingrédient épicé de la sauce
    mainPepper: {
        type: String,
        required: true,
        validate: mainPepper_Validator 
    },
    //--6: L'URL de l'image de la sauce téléchargée par l'utilisateur
    imageUrl: {
        type: String,
        required: true
    },
    //--7: Force le piquant de la sauce
    heat: {
        type: Number,
        required: true
    },
    //--8: Nombre de Like reçu
    likes: {
        type: Number
    },
    //--9: Nombre de dislike reçu
    dislikes: {
        type: Number
    },
    //--10: Utilisateur qui Like la sauce
    usersLiked: {
        type: [String]
    },
    //--11: Utilisateur qui DisLike la sauce
    usersDisliked: {
        type: [String]
    },
},
//--12: l'heure de la création et la mise à jour de l'objet 
// {
//     timestamps:true
// }
)
console.log("------sauceSchema") 
console.log(sauceSchema) 
//-----------------------3:Mongoose-sanitizerPlugin------------------------------------------
//Plugin pour Mongoose qui purifie les champs du modèle avant de les 
//enregistrer dans la base MongoDB.
//Utilise le HTML Sanitizer de Google Caja pour effectuer la désinfection.
sauceSchema.plugin(sanitizerPlugin)

//-----------------------4:Exportation de modèle sauces----------------------------------------------
//Exportation de modèle de schéma de données 'sauceSchema'pour intéragir
//avec l'application

module.exports = mongoose.model("sauces",sauceSchema)



