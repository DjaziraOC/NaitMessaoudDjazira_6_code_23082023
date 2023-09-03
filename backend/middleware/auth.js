//---------------------middleware authentifié-------------------------
//ce middleware s'appliquera à toutes les routes afin de les sécuriser
//il protégera les routes sélectionnées et vérifiera que l'utilisateur 
//est authentifié avant d'autoriser l'envoi de ses requêtes.

//On vérifie le TOKEN de l'utilisateur, si il correspond à l'id de 
//l'utilisateur dans la requête, il sera autorisé à modifier les 
//données correspondantes.

//-----------------Importation de package jsonwebtoken-----------------
//On utilise le package jsonwebtoken pour attribuer un token à un 
//utilisateur au moment ou il se connecte
const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        //---------1:Récuperer le token dans le header bearer token (la requête)---
    //extraire le token du header Authorization (la key) grâce à la 
    //fonction split

        console.log("--->contenu req.headers")
        console.log(req.headers)

        console.log("--->contenu req.headers.authorization")
        console.log(req.headers.authorization)

        //la fonction split renvoie un tableau [index 0 (bearer),index1(token)] 
        //pour extraire et récupérer le token,il faut seléctionner l'index 1
        const token = req.headers.authorization.split(" ")[1]    
        console.log("--->contenu Token")
        console.log(token)
        //---------------------------2:Décoder le token----------------------------
        //---La méthode jwt.verify pour décoder le token. Si celui-ci n'est
        //pas validé, une erreur sera générée;
        //On vérifie le token décodé avec la clé secrète initiéé avec la création 
        //du token encodé initialement (Cf Controller user), les clés doivent correspondre
        const decodedToken = jwt.verify(token, `${process.env.KEY_JW_TOKEN}`)     
        // const decodedToken = jwt.verify(token,"RANDOM_TOKEN_SECRET")
        console.log("--->contenu decodedToken")
        console.log(decodedToken)//il affiche le userId et configuration avec une expiration

        console.log("--->contenu  de la requête avant  le token")
        console.log(req)//undefined

        //-------3:Récuperer le userId à l'intérieur du token déchiffré----------
        //extraire l'userId de token décoder
        const userIdDecodedToken = decodedToken.userId
        console.log("--->contenu  userId decoded Token")
        console.log(userIdDecodedToken)

        //-----4:comparaison de userId (requête)/ userId (token décodé)-----------
        //on compare le userId envoyé avec la requête et userId contenu dans 
        //token décodé

        if(req.body.userId && req.body.userId !== userIdDecodedToken){
            // si le token ne correspond pas au userId :on envoi une erreur
            throw "userId non valide" 
        } else {
            req.auth = {
                userId: userIdDecodedToken
            }
            //si tout est validé on passe au prochain middleware
            next()
        }
        //si il y a des errers dans le try,on les récupères ici
    } catch {
        res.status(401).json({
            error: new Error("Requête non authentifiée!")
        })
    }
}

