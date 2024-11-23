# Documentation Technique - TimeApi

But : Prise en main de la méthode de développement scrum.


1. Introduction

    Cette application est un service web qui permet à l'utilisateur de récupérer la date et l'heure actuelles en fonction du fuseau horaire spécifié. Elle inclut également une interface web interactive avec une carte où les utilisateurs peuvent cliquer pour obtenir le fuseau horaire et l'heure correspondante à une position géographique donnée, ainsi que leurs informations météreologiques.

    L'application repose sur FastAPI pour la partie back-end (API REST) et Leaflet.js pour l'interface cartographique interactive. Elle utilise également l'API TimeZoneDB pour récupérer les fuseaux horaires basés sur les coordonnées géographiques.


2. Architecture

    L'architecture est basée sur deux principaux composants :

    - Back-end (API FastAPI) : Expose des routes pour obtenir la date et l'heure en fonction du fuseau horaire.
    - Front-end (HTML/JavaScript) : Fournit une carte interactive qui utilise Leaflet pour permettre aux utilisateurs de sélectionner des points géographiques, puis récupère les fuseaux horaires à partir de l'API TimeZoneDB.


3. Dépendances

    - Python (Back-end) :
        - FastAPI : Framework web pour construire l'API.
        - ZoneInfo : Gestion des fuseaux horaires.

    - JavaScript (Front-end) :
        - Leaflet.js : Librairie de cartographie pour gérer la carte interactive.
        - Axios : Librairie pour les requêtes HTTP vers l'API TimeZoneDB.


4. Installation

    Pour lancer l'api :

    - Installer fastapi : (sudo) pip install "fastapi[standard]"
    - Être dans le dossier Api/ : cd path/Api
    - Exécuter la commande suivante : fastapi dev main.py
    - Vous pouvez alors visualiser l'application sur l'adresse : http://127.0.0.1:8000/map


5. Utilisation

    - Accès à l'API FastAPI :
        - Normalement, vous verrez les urls affichés dans l'invite de commande. Sinon, vous pouvez consulter la documentation de l'API en cliquant sur le lien suivant : https://lucasdev.alwaysdata.net/docs#/

    - Accès à l'interface de la carte :
        - Ouvre le fichier HTML dans un navigateur.
        - Clique sur la carte pour sélectionner un emplacement et obtenir le fuseau horaire correspondant.


5. Améliorations futures possibles

    - Ajouter la gestion des erreurs pour des fuseaux horaires plus précis en cas de zones ambiguës.
    - Ajouter une option pour récupérer l'heure au format 12 heures (AM/PM).
    - Permettre une sélection multiple de fuseaux horaires et la comparaison d'heures.
