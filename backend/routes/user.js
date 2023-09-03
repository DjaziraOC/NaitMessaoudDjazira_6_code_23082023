//---------------------Importation de l'express------------------------------- 
const express = require ("express")//Importation de l'express pour 

//-------------------Importation du middleware/password.js---------------------
//on a importé toutes les fonctions du fichier password qui est sous middleware
const password = require ("../middleware/password")
console.log("password------middleware/password.js")
console.log(password)

//---------------------Importation du controllers/user.js--------------------
//on a importé toutes les fonctions du fichier user qui sont sous controllers
const userControllers = require("../controllers/user")
console.log("userControllers------routes-user.js")
console.log(userControllers)

//------------------------la fonction Router-------------------------------
//crée un nouvel objet router
const router = express.Router() 
console.log("-----le contnue de Router")
console.log(router)

//---------------------La route Signup (endpoint)---------------------------
//lorsque la requête signup arrive à ce niveau, et la méthode POST avec
//le endpoint signup, on va basculer vers "user/controllers" ou la requête
//va être traiter
//router mini-middelware (ou comme une application intégrer )capable 
//d'exécuter les fonctions de middleware et les routages
// router.post("/signup",password,userControllers.signup)
router.post("/signup",password,userControllers.signup)

//---------------------La route Login (endpoint)--------------------------
//router permet de se connecter
router.post("/login",userControllers.login)

//--------------------Exportaion de module router-------------------------
//il faut qu'il y a un lien entre le fichier app.js et le fichier user.js
module.exports = router
