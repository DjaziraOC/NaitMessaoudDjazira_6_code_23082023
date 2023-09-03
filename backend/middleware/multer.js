//permet gérer les fichiers entrants dans les requêtes HTTP 
//il faut créer un objet de configuration pour préciser à multer où 
//enregistrer les fichiers images (répértoire) et les renommer 
//en rajoutant l'extension du fichier NIME_TYPE et 
//pour que le fichier soit unique, on rajoute timestamp Date.now(): 
//nombre en millisecodes unique à chaque fichier
         
//--------------------Importation de package---------------------------------
//Importation de package multer
const multer = require("multer")

//------------------------------MIME_TYPES------------------------------------
//MIME_TYPE:permet de définir la nature et le format d'un document
//Il faut créer un objet pour ajouter une extention en fonction du type mime du ficher
const MIME_TYPES = {
    "image/jpg":"jpg",
    "image/jpeg":"jpeg",
    "image/gif":"gif",
    "image/png":"png"
}
console.log(MIME_TYPES)

//---------------------La distination du fichier----------------------------
//créer un objet de configuration pour préciser à multer où enregistrer 
//les fichiers images (répértoire) et les renommer

const storage = multer.diskStorage({
    //--->La destination de stockage du fichier (images)    
    destination:(req, file, cb)=>{ 
        //On appelle le callback, on passe null pour dire qu'il n'y a pas d'erreur
        //On passe le nom du fichier "images" qui est à la racine (backend)    
        cb(null,"images")    
    },
    //--->créer le filename en entier, avec le nom d'origine en supprimant 
    //l'enciennne extension avec split,en recupérant le nom avant le (.) et
    // on insère (_) avant qu'on ajoute un timestamp, un point et enfin 
    //l'extension du fichier

    //--->Supprimer les espaces dans le nom du fichier
    filename:(req, file, cb)=>{ 

        //on prend le nom original du fichier qui a éte envoyé, avec 
        //split on va le couper au niveau de point,on recupère le nom 
        //avant le point et l'extension 
        // let name = file.originalname.split(' ').join('_')
        let name = file.originalname.split(".")[0]
        console.log("----contenu name--multer")
        console.log(name)
        //il faut rajouter extension du fichier NIME_TYPE
        let extension = MIME_TYPES[file.mimetype]    
        console.log("------extension")
        console.log(extension)

        //il va falloir mettre  timestamp pour que le fichier soit unique 
        //Date.now(): nombre en millisecodes unique à chaque fichier
        //(forte protection) puis le point et l'extension     
    
        cb(null,`${name}_${Date.now()}.${extension}`)//UUID
        //cb(null,name + "_" + Date.now() + "."+ extension);
    } 
})
const upload = multer({storage: storage})

//il faut bien préciser qu'il faut envoyer un seul fichier avec la méthode single
module.exports = upload.single("image")




