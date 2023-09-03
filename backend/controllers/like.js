//----------------------------likeDislike---------------------------------
//quand l'utilisateur envoi une requête front pour aimer ou pas aimer une sauce 
//on fait appel à la BD en cherchant la sauce à liker ou à disliker grâce à 
//la méthode findOnd et l'id de l'objet.
//pour gérer les différents cas de système de like,
/*on a utilisé la méthode javascript include() qui 
//permet de verifier si le tableau de usersLike ou usersDislike dans la BD 
//contien des valeurs de userId de la requête front s'il existe, il revoi 
//true dans le cas contraire, il revoi false.
//Par la suite pour incrémenter la valeur des likes dans la BD envoyé 
//par le front on a utilisé l'opérateur $inc 
//et $push pour mettre (ajouter) userId de front dans le usersliked 
//ou usersdisliked dans la BD et 
//$pull pour supprimer userId de l'utilisatteur dans le usersliked ou usersdisliked*/

//-----------------------importation de modèle'sauce'----------------------------------------
//Importation models de base de données MongoDB pour les sauces, créé grâce à la fonction schéma de mongoose
const Sauces = require ("../models/sauces")
console.log("-----le contnue de sauces --controllers/sauces")
console.log(Sauces)
//----------------------likeDislike/Sauces--------------------------------
exports.likeDislike = (req, res) => {
    //--->afficher le req body
    //la req sera envoyé par le body --->raw au  format JSON avec 2 propriétés
    /*{
        "userId":"62b9edb96e5519fbecd979e2",
        "like":1
    }*/
    console.log("----le contenu :req.body ---ctrl like")
    console.log(req.body)
    console.log(req.body.userId)
    //--->Récupére l'id dans l'URL de la requête    
    console.log("contenu req.params---ctrl like")
    console.log(req.params)

    //--->Mise en format de l'id pour pouvoir chercher l'objet correspond dans la BDD (_id)
    console.log("_id: req.params.id---ctrolleur like")
    console.log({_id: req.params.id}) 
    //--->chercher l'objet dans la base de donnée avec la méthode findOne et l'_id

    Sauces
        .findOne({_id: req.params.id})//
        .then((objet) =>{
            console.log("---->objet")
            console.log(objet)
   
            //Il faut trouver un moyen de mettre le userId de la requête front dans 
            //le tableau de usersliked de la BDD et comment faire passer le like de 0 a 1

            //exemple :lorsque le front envoi sa requête, si le userId de la
            //requête front like,le like passera a 1 et userId qui aime elle sera mis 
            //dans le tableau usersliked de la bdd
 
            //like = 1   (likes = +1)
            //il faut verifier si l'userId est présent dans le tableau de usersLikes et
            //le like de req.body est strictement égal à 1 (La première condition est
            //false,donc on va ajouter ! pour avoir true et pour que les instructions seront éxecutées)
            //--->Si le usersliked est false et si like ===1 (donc le likes= +1 et userId est dans le tableau de usersLiked)
            if(!objet.usersLiked.includes(req.body.userId) && req.body.like === 1){
                //Le userId n'est pas présent dans usersLiked de BDD et la requête front like === 1 
                //---> mise à jour de l'objet de la BDD MongoDB  
                Sauces
                    .updateOne(
                        {//chercher l'objet de la BDD
                            _id: req.params.id
                        },
                        {//mise à jour de la BDD
                            //on incrémente avec l'opérateur $inc la valeur de likes envoyé
                            //par le front 
                            $inc: {likes:1},
                            //mettre le userId de l'utilisateur dans le usersLiked de la BDD
                            $push :{usersLiked: req.body.userId}
                        }
                    )
                    .then(()=>{res.status(201).json(
                        {message:"l'utilisateur aime (like +1)"})
                    })       
                    .catch((error) =>res.status(400).json({error}))   
            }

            //like = O   (likes = 0, pas de vote neutre)

            //si le userId est présent dans usersLiked de BDD et si dans le req.body like égal a 0
            if(objet.usersLiked.includes(req.body.userId) && req.body.like === 0){
                //Le userId est présent dans usersLiked de BDD et la requête front like === 0     
                //---> mise à jour de l'objet de la BDD MongoDB     
                Sauces
                    .updateOne(
                        {//chercher l'objet de la BDD
                            _id: req.params.id
                        },
                        {//mise à jour de la BDD
                            //on incrémente avec l'opérateur $inc la valeur de likes 
                            //envoyé par le front
                            $inc: {likes:-1 },
                            //on supprime le userId de l'utilisateur dans le usersLiked de la BDD
                            $pull :{usersLiked: req.body.userId}
                        }
                    )
                    .then(()=>{res.status(201).json(
                        {message:"l'utilisateur ne vote pas (like 0)"})
                    })       
                    .catch((error) =>res.status(400).json({error}))
            }
            //like = -1  (dislikes = +1)
            //--->Si le usersDisliked est false et si like === -1 (donc le Dislikes= +1 et userId est dans le tableau de usersDisliked)
            //il faut verifier si l'userId est présent dans le tableau de usersDislikes 
            //et le like de req.body est strictement égal a -1 (La première condition 
            //est false,donc on va ajouter ! pour avoir true et pourque les instructions seront éxecutées)    
            if(!objet. usersDisliked.includes(req.body.userId) && req.body.like === -1){
                //Le userId n'est pas présent dans usersDisliked de BDD et la requête front like === -1 
                //---> mise à jour de l'objet de la BDD MongoDB  
                Sauces
                    .updateOne(
                        {//chercher l'objet de la BDD
                            _id: req.params.id
                        },
                        {//mise à jour de la BDD
                            //on incrémente avec l'opérateur $inc la valeur de Dislikes envoyé par le front
                            $inc: {dislikes:1 }, 
                            //mettre le userId de l'utilisateur dans le usersDisliked de la BDD
                            $push :{usersDisliked: req.body.userId}
                        }
                    )
                    .then(()=>{res.status(201).json(
                        {message:"l'utilisateur n'aime pas (like -1)"})
                    })       
                    .catch((error) =>res.status(400).json({error}))   
            }

            //Aprés un like= -1 on met le like = 0   (on enleve le dislikes )
            //si le userId est présent dans usersDisliked de BDD et si dans le req.body like égal a 0
            if(objet.usersDisliked.includes(req.body.userId) && req.body.like === 0){
                //Le userId est présent dans usersLiked de BDD et la requête front like === 0     
                //---> mise à jour de l'objet de la BDD MongoDB     
                Sauces
                    .updateOne(
                        {//chercher l'objet de la BDD
                            _id: req.params.id
                        },
                        {//mise à jour de la BDD
                            //on incrémente avec l'opérateur $inc la valeur de dislikes, 
                            //en envoyant la req like ===0 par le front 
                            $inc: {dislikes: -1 }, 
                            //on supprime le userId de l'utilisateur dans le usersLiked de la BDD
                            $pull :{usersDisliked: req.body.userId}
                        }
                    )
                    .then(()=>{res.status(201).json(
                        {message:"l'utilisateur ne vote pas (like 0)"})
                    })       
                    .catch((error) =>res.status(400).json({error}))
            }
        })
        .catch((error) =>res.status(404).json({error}))
}
