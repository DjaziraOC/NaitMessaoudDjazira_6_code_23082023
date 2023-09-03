## Projet 6 - Construire une API sécurisée pour l'application web 
## Piiquante : Marque de sauces piquantes

# backend 
pour lancer le serveur : `$ npm run start`

Mettre les informations pour les variables d'environnement (Base de donnée MongoDB Atlas)

## Routes 
## La route POST pour créer un compte
- [x] http://localhost:3000/api/auth/signup

## La route POST pour se logger
- [x] http://localhost:3000/api/auth/login

body---->raw---->json
{
   "email":"xxxxxxxxxxxxxxx",
   "password":"xxxxxxxxxxxxx" 
}

## La route POST pour créer la fiche Sauce
- [x] http://localhost:3000/api/sauces

## La route GET pour afficher le contenu de  fiche sauces
- [x] http://localhost:3000/api/sauces

## La route GET pour afficher  un seul  objet grâce à son id 
- [x] http://localhost:3000/api/sauces/:id

## La route PUT pour modifier un objet qui a été sélectionné  par le biais de  son _id
- [x] http://localhost:3000/api/sauces/:id

## La route Delete pour supprimer un objet qui a été sélectionné  par le biais de  son _id
- [x] http://localhost:3000/api/sauces/:id

## La route  POST pour liker ou Dislker un objet qui a été sélectionné  par le biais de  son _id
- [x] http://localhost:3000/api/sauces/:id/like
Auth---->bearer Token------Token:{{token}}
body---->raw---->json 
{
    "userId":"xxxxxxxxxxxxxxx",
    "like":0   (1 pour like) (-1 pour deslike) 
              (0 neutre: pas de vote)
}