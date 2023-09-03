//------------------------middlware passWord---------------------------
//crée  le schéma de mot de passe avec le module password-validator
//afin de rendre le ce password fort, des instructions pour contrôler sa 
//qualité a été mise en place et avec la fonction validate, on peut par   
//la suite verifier sa validité avant qu'il soit haché et envoyé dans la BD 
 
//----------a:Création du schéma de mot de passe plus sécurisé------------

//-->1:Importation  password-validator
const  passwordValidator = require ("password-validator") 

//-->2:Mise en place de de schéma de passWord avec le password-validator
const passwordSchema = new passwordValidator()

//--------------b:qualité et validité du password-------------------------

//-->1:Mise en place des instructions pour contrôler la qualité passWord
//Le schéma de passWord doit respecter les instructions suivantes (les propriétés)
passwordSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(["Passw0rd", "Password123"]) // Blacklist these values
console.log("---passwordSchema")
console.log(passwordSchema)

//-->2:Verification de la validité (qualité)du password avant qu'il soit 
//hashé par rapport au schéma
//Mongoose contient des fonctions comme Validate permet de contrôler 
//et de verifier ce qu'on envoi dans la base de donnée.
module.exports =(req,res,next)=>{
    //si le password est validé aprés verification
    if(passwordSchema.validate(req.body.password)){ 
        next()
    }else{ 
   
        return res
            .status(400)
            .json({error:"Mot de passe requis n'est pas assez fort:"+ 
        passwordSchema.validate("req.body.password",{ list: true })})
  
    }
}



