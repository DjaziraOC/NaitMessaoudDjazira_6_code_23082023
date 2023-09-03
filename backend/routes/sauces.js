/* eslint-disable no-unused-vars */
//---------------------Importation de l'express------------------------- 
//Importation de l'express pour utiliser Router
const express = require ("express")

//----------------Importation du controllers/user.js--------------------------
//on importe toutes les fonctions du fichier sauces qui sont sous controllers
const saucesControllers = require("../controllers/sauces")
console.log("saucesControllers------routes-sauce.js")
console.log(saucesControllers)

//-----------------Importation du controllers/like.js-------------------------
//on importe toutes les fonctions du fichier like qui sont sous controllers
const likeControllers =require("../controllers/like")
console.log("likeControllers------route-like.js")
console.log(likeControllers)

//------------------Importation du middleware d'authenfication--------------
//On importe le middleware auth pour sécuriser les routes,et on le passe 
//comme argument aux routes à protéger
// Récupère la configuration d'authentification JsonWebToken
const auth = require("../middleware/auth") 
console.log("authentification------routes-sauce.js")
console.log(auth)

//------------------Importation du middleware multer_config----------------
//On importe le middleware multer pour la gestion des images
const multer = require("../middleware/multer")

/*Remarque: on peut importer quelque fonctions spécifique
// const {createSauce,getAllSauces, getOneSauce,
// modifySauces,deleteSauces} = require('../controllers/sauces')
// router.post('/',auth,multer,createSauce);//la même chose pour 
//les autres routes*/

//------------------------la fonction Router-------------------------------
//crée un nouvel objet router
const router = express.Router() 

//--------------------Les routes dédiées au sauces -----------------------------

//-----------La route POST pour(Create)créer les sauces--------------------------
router.post("/",auth,multer,saucesControllers.createSauce)

//------------La route GET pour(Read)afficher toutes les sauces---------------
//Permet de récupérer toutes les sauces,elle renvoie et affiche le tableau 
//de toutes les sauces sauvgardées dans la base de données MongoDB Atlas
router.get("/",auth,saucesControllers.getAllSauces)

//------------La route GET pour(Read)afficher une seul sauce------------------
//à partir de l'id d'un objet, on peut afficher l'objet en question 
router.get("/:id",auth,saucesControllers.getOneSauce)

//------------La route PUT pour(Update)modifier les sauces---------------------
//quand la route sera appélée,la foction sera excutée
router.put("/:id",auth,multer,saucesControllers.updateSauce)

//------------La route Delete pour(Delete)supprimer les sauces-----------------
//quand la route sera appélée,la foction sera excutée
router.delete("/:id",auth,saucesControllers.deleteSauces)

//-------------La route POST pour gérer les likes-----------------------------
//router.post('/:id/like',auth,saucesControllers.likeDislike)
router.post("/:id/like",auth,likeControllers.likeDislike)
//--------------------Exportaion de module router----------------------------
//il faut qu'il y a un lien entre le fichier app.js et le fichier sauces.js
module.exports = router
