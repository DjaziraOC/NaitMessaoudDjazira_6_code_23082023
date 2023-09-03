//---------------------------------modèle'sauce'----------------------------------------
//Importation modèle de base de données MongoDB pour les sauces, créé 
//grâce à la fonction schéma de mongoose
const Sauces = require ("../models/sauces")

//-----------------------------------file system----------------------------------------
//Importation de module de nodeJS 'file system' pour accéder aux dossier 
//de serveur, permettant de gérer les téléchargements et modifications d'images 
const fs = require ("fs")

//----------------------------createSauce/body-Form-data---------------------------------
// la fonction 'createSauce' stocke les données envoyées par le front-end en forme 
// (form-data) grâce a deux key :(sauce:qui prend comme value tous les proprietés de body)
// et images : qui prend comme valeur le fichier images) et sauvgarder dans une variable 
// les données envoyées sont transformées en objet java Script avec JSON.parse() 
// sauvgarder dans une variable SauceObjectJs.
// à l'aide de model Sauce on crée une nouvelle instance de model Sauce contenant SauceObjectJs
// et l'url de l'image télécharger depuis le server  par utilisateur et userId est généré 
// automatiquement pour chaque objet puis on sauvgarde l'objet sauces dans la base de donnée
// MongoDB Atlas grâce à la méthode save()

exports.createSauce = (req,res)=>{
    //--->Stocker les données envoyées par le front-end en forme (form-data) 
    //grâce à deux key :(sauce:qui prend comme value tous les proprietés de body)
    //et images: qui prend comme valeur le fichier images) et sauvegarder 
    //dans une variable. 
    //les données envoyées sont en chaine de caractère au format JSON et
    //avec JSON.parse(), on les transforment en objet java Script

    console.log("--->contenu createSauce req,body,--controllers/sauces")
    console.log(req.body)
    //le contenu de la requête 'Sauces'
    console.log("--->contenu createSauce req,body,sauces --controllers/sauces")
    console.log(req.body.sauce)
   
    console.log("----le contenu POST:req.file")
    console.log(req.file)
    
    console.log("----le contenu POST:req.auth")
    console.log(req.auth)

    const SauceObjectJs = JSON.parse(req.body.sauce)
    console.log("--->contenu createSauce  SauceObjectJs --controllers/sauces")
    console.log(SauceObjectJs) 
   
    //--->Création d'une instance du modèle Sauces (objet)
    //permet de générer automatiquement l'id de l'objet
    const sauces = new Sauces({
        //--: Les données envoyées par le front-end sont en objet java Script
        ...JSON.parse(req.body.sauce),
        userId:req.auth.userId,
        //--: L'URL de l'image de la sauce téléchargée par l'utilisateur
        // On modifie l'URL de l'image, on veut l'URL complète,dynamique avec les segments de l'URL
        /*On doit résoudre l'URL complète de notre image, car req.file.filename 
        ne contient que le segment filename.on utilise req.protocol pour obtenir
        le premier segment ('http').On ajoute'://',on puis utilise req.get('host') 
        ('localhost:3000').On ajoute finalement '/images/' et le nom de fichier pour compléter l'URL.*/
        //imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        imageUrl:`${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes:  0,
        usersLiked: [],
        usersDisliked: []
    })
    console.log("--->contenu createSauce  sauces de new Sauces   --controllers/sauces")
    console.log(sauces)

    //--->Enregistrer l'objet sauces dans la base de donnée MongoDB Atlas       
    sauces
        .save()   
    //On envoi une réponse au frontend avec un statut 201 le code de 
    //succès, et un message au format json sinon on a une expiration de la requête
        .then(()=> 
        {   
            res.status(201) 
                .json({ 
                    message:"objet sauces est sauvegardée dans la base de donnée MongoDB Atals !",
                    contenu: sauces
                })
        })
    //En cas de problème, on ajoute un code erreur 
        .catch((error)=>res.status(400).json({error}))          
}

//----------------------------getAllSauces---------------------------------
//--->La fonction  getAllSauces permet d'afficher toutes les sauces en faisant appel au model 
//de la BD Sauce et avec la méthode find on récupera toutes les sauces créer par les utitlsateurs
  
exports.getAllSauces = (req,res)=>{
    //le modèle de la base de donnée Sauces 
    Sauces 
        .find()
    //récuper tous ce qui est dans la response, toutes les sauces créer par l'utilisateur
        .then((allSauces)=>{res.status(200).json(allSauces)})
        .catch((error)=>{res.status(400).json({error})})
}

//----------------------------getOneSauce-----------------------------------------------
//--->La fonction getOneSauce permet d'afficher un seul objet(une sauce)
//avec la méthode findOne séléctionnant l'objet à afficher par le biais de son id

exports.getOneSauce = (req,res)=>{
//--->récupérer l'id de "la kye params" de la requête GET et on lui rajoute un _
    //pour aller chercher l'id de l'objet créer dans la base de donnée, il faut _id 
    console.log("-----la route/getOneSauce --controllers/sauces")
    //extraction de l'id de la requête
    console.log(req.params)
    //mettre l'id de la requête dans un objet _id
    console.log({_id: req.params.id}) 
    //--->La méthode findOne pour afficher un seul objet
    //la méthode findOne séléctionne l'objet à afficher par le biais de son id
    //pour afficher un objet , il suffit juste de sélectionné son _id (filter=_id)
    
    Sauces
    //on sélectionne l'objet de la BD grâce a son _id
        .findOne({_id: req.params.id})
    //on affiche ce qui est dans la promise
        .then((OneSauce)=>{res.status(200).json(OneSauce)})
    //s'il trouve pas la ressource,il affiche error
        .catch((error)=>{res.status(404).json({error})})
}

//------------------------------------updateSauce----------------------------------------
//la fonction updateSauce permet de modifier l'objet dans la base de donnée 
//et le fichier de l'image sur le serveur et de les mettre à jour lorsque 
//l'utilisateur envoi sa requête.
/*le traitement de données de la requête body et le fichier image sont traités différement
//une fois vérifié que l'utisateur connecté est autorisé à modifier/à supprimer  l'objet de la BDD
// il faut vérifier par la suite si le fichier image à supprimer existe,dans la cas existe
// on  cherche l'objet dans la base de donnée  via son id et on récupre le nom de l'image à supp 
// par la suite  on supp l'image dans le dossier images du serveur à l'aide d'un 
//module nodeJS file systeme (fs) qui va falloir importer et la méthode unlinkSync
// il faut Mettre à jour l'objet à envoyer dans de la base de données dans des deux cas 
// cas de modication d'image ou dans le cas modification de contenu boby et l'image  
// et par la suite on mis à jour la BDD à la d'aide de la méthode updateOne*/

exports.updateSauce = (req,res)=>{

    Sauces
        .findOne({_id: req.params.id})
        .then((objet)=>{
            //la promise retourne un l'objet JS associé a _id déjà séléctionnée
            console.log("--->le contenu de retourde la promise")
            console.log(objet)

            //---vérifier si userId connecté est autorisé à modifier l'objet en comparant 
            //l'userId dans l'objet avec userId de la commande 
            if(req.auth.userId === objet.userId){
                if(req.file){
                //il faut vérifier s'il y a un fichier
                    console.log("true")  
                    //--->1:récuperer du nom de l'image à supprimer dans la variable filename qui est dans la BD
                    //grâce à l'_id de l'objet et url de l'image et split(renvoie un tableau [0,1] et on sélectionne le 1  ou le nom de l'image*/
                    const filename = objet.imageUrl.split("/images")[1]
                    console.log("--->le contenu de put _filename")
                    console.log(filename)
                    //--->2:Supprimer l'image dans le dossier images du serveur à l'aide d'un 
                    //module nodeJS file systeme (fs) qui va falloir importer et la méthode unlinkSync 
                    fs.unlink(`./images/${filename}`,(err)=>{
                        if (err) {
                            console.log("failed to delete local image:"+err)
                        } else {
                            console.log("successfully deleted local image")                               
                        }           
                    }) 
                }else{
                    console.log("false")
                }

                //-->2:Mettre à jour l'objet à envoyer dans de la base de données   
                //deux cas possible à gérer :
                /*cas de modification de fichier image ou modification des valus de la key sauces 
                    //cas modification des deux cas précédents au même temps  
                    //il va falloir transformer les values de la key sauce en objet  javascript
                    //puis la key imageUrl remplacer l'ancien URL de l'ancienne image par la nouvelle*/
                
                // ---a:cas de modification de fichier image ou modification des valus de la key sauces 
                console.log("-----put req.body")
                console.log(req.body)

                console.log("-----put req.body.sauce")
                console.log(req.body.sauce)

                const  saucesObject = req.file?
                    {
                        ...JSON.parse(req.body.sauce),//l'opérateur spard pour éclater l'objet
                        // on change le chemin de l'image 
                        imageUrl:`${req.protocol}://${req.get("host")}/images/${req.file.filename}`,            
                    }:
                    {
                        ...req.body,
                    }
                console.log("----saucesObject")
                console.log(saucesObject)
        
                //-->3Mettre à jour la base de donnée
                //les modifications qui seront envoyé dans la base de donnée
                //la méthode updateOne séléctionne l'objet à mettre à jour par le biais 
                //de son  id puis tout le contenu de l'objet ,on le mettera dedant  

                Sauces 
                    .updateOne(
                        {_id: req.params.id},{...saucesObject, _id: req.params.id}
                    )
                    .then(()=>{
                        res.status(200).json(
                            { 
                                message:"l'objet est mis à jour",
                                contenu:saucesObject
                            })
                    })
                    .catch(()=>{ 
                        res.status(404).json({message:"l'objet n'est pas mis à jour"})
                    })
            }else{
                throw "Vous n'êtes pas autoriser à modifier l'objet, userId différent de userId de l'objet à modifier"
            }
        })    
        .catch((error)=>{res.status(500).json({error})})   
}           

//-----------------------------deleteSauces--------------------------------
//la fonction deleteSauces permet d'effacer l'objet dans la base de donnée et le fichier
//de l'image sur le serveur
/*la méthode findOne séléctionne l'objet à supprimer par le biais de son id
// on verifie si l'utilisateur 'userId'  connecté est autorisé à supprimer l'objet
// par la suite on récuperer le nom de l'image à supprimer dans la variable filename 
// puis on supprime l'image sélectionnée sur serveur avec la méthode unlink de module 'fs'
// pour suppr le fichier
// On supprime le document correspondant de la base de données avec la méthode deleteOne */

exports.deleteSauces = (req,res)=>{
//-->localiser et récupérer l'id de l'objet à supprimer dans la BDD 
    console.log("-----req.params.id-controllers/sauces")
    console.log(req.params.id)
    console.log({_id: req.params.id})

    //Avant de supprimer l'objet, on va: 
    //-->1:récupérer l'Url de l'image de l'objet à supprimer pour pouvoir 
    //l'effacer sur serveur    
    //on cherche l'objet dans la BDD.
    Sauces 
    //la méthode findOne séléctionne l'objet à supprimer par le biais de son id
    //Il suffit juste récupérer l'id de l'objet à supprimer dans la BDD _id
        .findOne({_id: req.params.id}) 
    //une fois l'objet est séléctionné, la promise retourne l'objet à supprimer
        .then((objet)=>{
            //pour eviter qu'un autre utilisateur supprime (pirater) les données (les objets) 
            //d'autre utilisateur
            //il faut bien sécuriser notre Web API, dans ce cas il faut
            //-->controller si userId connecté est autorisé à supprimer l'objet en comparant 
            //l'userId dans l'objet avec userId de la commande 

            console.log("--->req.auth.userId")
            console.log(req.auth.userId)
        
            console.log("---> userId--objet")
            const userIdObjet = objet.userId
            console.log(userIdObjet)
        
            if(req.auth.userId===userIdObjet){
                console.log("l'autorisation pour suppression de l'objet")
                //--->1:Récuperer le nom de l'image à supprimer dans la BD dans la variable filename 
                const filename = objet.imageUrl.split("/images")[1]
           
                //--->2:Supprimer l'image sélectionnée sur serveur avec la 
                //méthode unlink de module 'fs' pour suppr le fichier
                fs.unlink(`images/${filename}`,()=>{
            
                    //--->2:On supprime le document correspondant de la base de données
                    //on retourne à la base de donnée et avec la méthode deleteOne on efface 
                    //l'objet sélectionnée dans la BDD par le biais de models Sauces (mongoose)  
                    Sauces
                    //on supprime l'objet séléctionné
                        .deleteOne ({_id: req.params.id})
                        .then(res.status(200).json({
                            message:"l'objet a été supprimer dans la base de donnée"
                        }))
                        .catch((error)=>res.status(404).json({error}))
                })
            }else{
                throw "Vous n'êtes pas autoriser à  supprimer l'objet, userId différent de userId de l'objet à supprimer"
            }
        }) 
        .catch((error)=>{res.status(500).json({error})})
}




