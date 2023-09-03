//--------------controller pour la route signup/login---------------------------------
/*Middleware signup pour enregistrer un nouvel utilisateur dans BD avec 
//un email et un mot de passe haché
/*En  faisant appel au model user contenant l'e-mail et MDP,avec le  plugin bcrypt associé
à la méthode hash le MDP en clair envoyé par l'utilisateur lors de son inscription sera hashé, 
si tout est ok. 
la promise renvoie un nouveau model de donnée contennant l'email et le mdp ashé et avec la 
méthode save.on sauvegarde les informations de la connexion de l'utlisateur dans la BDD*/

/*Le Middleware login permet à l'utilisateur de se connecter aprés avoir vérifier 
//si l'utilisateur existe dans la base MongoDB lors de sa connexion à l'aide de son 
//adresse email, puis on vérifie la validité du son password envoyé en clair avec bcrypt.
//compare,s'il est bon il renvoie objet JSON avec un userId: récupérant l'id de
l'utilisateur de la BD et en lui attribuant un token encodé expirera au bout de 24h,
sinon renvoie une erreur. */ 

//----------------------importation des packages----------------------------
//Importation de bcrypt pour hasher le password
const bcrypt = require ("bcrypt")

//Importation jsonwebtoken pour attribuer un token à un utilisateur 
//lors de sa connexion
const jwt = require("jsonwebtoken")

//Importation modèle User de base de données (User.js)
const User = require("../models/User")

//---------------------------Signup----------------------------------
//Middleware signup pour enregistrer un nouvel utilisateur dans BD 
//avec un email et un mot de passe haché
exports.signup = (req,res)=>{
    //le contenu de la requête de l'utilisateur lors de son inscription    
    console.log("contenu req,body.email --controllers/user")
    console.log(req.body.email)
    
    console.log("contenu req,body.password --controllers/user")
    console.log(req.body.password)

    //-->Hasher le mot de passe avant de l'envoyer dans la BD
    //On fait appelle à la méthode hash de bcrypt et on lui passe le mdp 
    //en clair de l'utilisateur,salt = 10 nombre de fois sera exécuté 
    //l'algoritme de hashage
    bcrypt
        .hash(req.body.password, 10) 
    //avec le retoure de la promise on récupére le mot de passe hasher 
    //qu'on va enregister en tant que nouvel utilisateur dans la BD mongoDB
        .then((hash)=>{
            //-->Créer un nouvel utilisateur avec le modèle mongoose "User"   
            const user = new User({ 
            // On passe l'email qu'on trouve dans le corps de la requête lors d'inscription de l'utilisateur
                email:req.body.email,
                //le mot de passe haché de bcrypt récupéré
                password:hash
            })
            console.log("contenu: user--controllers/user.js")
            console.log(user)

            //-->Sauvegarder l'utilisateur dans la base de donnée MongoDB
            //la méthode save qui renvoie une promise si elle est résulut 
            //on aura .then, si elle n'est pas résulut on aura .catch pour gérer les erreurs 
            user
                .save() 
            //on envoie le status 201 le code de succès, et un message au format json 
                .then(()=>{
    
                    res.status(201).json({ 
                        message:"utilisateur créé et sauvegardé !"})
                }
                )
            //si un utilisateur existe déjà avec cette adresse email ,il y a une erreur, l'erreur 400 
                .catch((error)=>res.status(400).json({error}))    

        })
    //s'il y a une erreur, l'erreur 500 le serveur recontre une situation qu'il ne sait pas traiter
        .catch(error => res.status(500).json({ error}))
}

//-----------------------------Login-------------------------------------------
//Le Middleware permet à l'utilisateur de se connecter aprés vérification
//si l'utilisateur existe dans la base MongoDB lors de sa connexion puis on vérifie la 
//validité du password envoyer par l'utilisateur avec bcrypt.compare,s'il 
//est bon il renvoie objet JSON avec un userId et un token encodé contenant l'id de 
//l'utilisateur, sinon renvoie une erreur. 
/*Le Middleware login permet à l'utilisateur de se connecter aprés avoir vérifiant 
//si l'utilisateur existe dans la base MongoDB lors de sa connexion puis on vérifie la 
//validité du son password avec bcrypt.compare,s'il 
//est bon il renvoie objet JSON avec un userId: récupérant l'id de l'utilisateur de la
//BD et en lui attribuant  un token encodé expirera au bout de 24h ,sinon renvoie une erreur. */ 


exports.login = (req,res)=>{

    //-->Verifier si l'email d'utilisateur est bien présent dans la BD   

    //on cherche l'utilisateur dans la BDD qui correspond à l'adresse email 
    //entrée par l'utilisateur
    User
        .findOne ({email: req.body.email}) 
        .then(user =>{ // (user = e-mail & mdp)
        //si l'email de l'utilisateur n'est pas présent, il n'existe pas,
        //on va renvoyer un code 401 et un message d'erreur 
            if(!user){ 
                return res.status(401).json({ error: "Utilisateur non trouvé !" })
            }
            //si l'email de l'utilisateur est présent, il existe
            //on va renvoyer un code de succès (200) avec un message de succès  
            //res.status(200).json({message:"l'utilisateur est trouvé dans la base de données!"}) 
        
            //-->Contrôler la validité du password envoyer par l'utilisateur avec bcrypt 
            //le contenu de la requête envoyé par l'utilisateur lors de sa connexion 
            console.log("--->contenu login req,body.email --controllers/user")
            console.log(req.body.email)

            console.log("--->contenu login req,body.password --controllers/user")
            console.log(req.body.password)
        
            console.log("--->contenu login user.password --controllers/user")
            console.log(user.password)

            console.log("--->contenu login user._id --controllers/user")
            console.log(user._id)
            //--bcrypt.compare: compare les password hachés qui éxiste dans la BD 
            //et savoir si ils ont la même mot de passe en clair (d'origine)   
            bcrypt
                .compare(req.body.password,user.password )
                .then(controlPassword =>{ 
                    console.log("--->contenu login controlPassword --controllers/user")
                    console.log(controlPassword)//true
      
                    //--->Si la promise renvoi false, 
                    //c'est que ce n'est pas le bon utilisateur,ou le mdp est incorrect
                    if(!controlPassword){
                        return res.status(401).json(
                            {error:"error, mot de passe incorrect"
                            })
                    }
                    //--->si la promise renvoi true,on renvoie un statut 200 et
                    // un objet JSON avec un userId et un token  
            
                    //-->un objet JSON avec un userId et un token d'authentification 
                    return res.status(200).json({ 
                
                        //-->récupérer l'id de l'utilisateur de la BD pour lui attribuer un token          
                        userId: user._id,
                        //-->obtenir un token encodé pour cette authentification grâce 
                        //à jsonwebtoken et la méthode sign 
                        token : jwt.sign( 
                    
                            {// Encodage de l'userdId nécéssaire dans le cas où une requête transmettrait un userId (ex: modification d'une sauce)
                                userId: user._id,
                            },
                            //Clé d'encodage du token qui peut être rendue plus complexe en production 
                            `${process.env.KEY_JW_TOKEN}`, 
                            {//Argument de configuration avec une expiration au bout de 24h
                                expiresIn: "24h"
                            }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error}))//il revoi toujours une erreur  
        })   
        .catch((error)=> res.status(500).json(error))//il revoi toujours une erreur      
}


