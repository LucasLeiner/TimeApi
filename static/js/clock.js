document.addEventListener("DOMContentLoaded", function () {
    let hours, minutes, seconds, timezoneOffset, secondsDisplay = 0;
    let intervalId;

    /**
     * Retourne une promesse qui résout avec l'heure actuelle (UTC) en tant qu'objet { hours, minutes, seconds }.
     * Si une erreur se produit, la promesse est rejetée avec un message d'erreur.
     */
    function getInitialTime() {
        return new Promise((resolve, reject) => {
            fetch('https://api.allorigins.win/get?url=https://lucasdev.alwaysdata.net/Time/UTC')
                .then(response => response.json())
                .then(data => {
                    const responseData = JSON.parse(data.contents);
                    const time = responseData.Time;
                    const [h, m, s] = time.split(':').map(Number);
                    resolve({ hours: h, minutes: m, seconds: s });
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération de l'heure UTC : ", error);
                    reject("Erreur lors de la récupération de l'heure");
                });
        });
    }

    /**
     * Démarrage de l'horloge.
     * Récupère l'heure actuelle (UTC) en appelant getInitialTime(), puis lance la mise à jour de l'horloge toutes les secondes.
     * Si une erreur se produit, affiche un message d'erreur dans le noeud HTML #horloge.
     */
    function startClock() {
        getInitialTime().then(({ hours: h, minutes: m, seconds: s }) => {
            hours = h;
            minutes = m;
            seconds = s;

            intervalId = setInterval(updateClock, 1000);
            updateClock();
        }).catch(error => {
            console.log(error);
            document.getElementsById("heureActuelle").textContent = "Erreur de récupération de l'heure.";
        });
    }

    /**
     * Met à jour l'affichage de l'horloge.
     * Incrémente les secondes, puis met à jour les minutes et les heures si nécessaire.
     * Ensuite, calcule les angles de rotation pour les aiguilles de l'horloge (secondes, minutes, heures) en prenant en compte le décalage horaire du fuseau.
     * Enfin, applique ces angles de rotation aux éléments HTML correspondants.
     */
    function updateClock() {
        seconds++;
        if (seconds % 60 === 0) {
            minutes++;
        }
        if (minutes % 60 === 0) {
            minutes = 0;
            hours++;
        }
        if (hours % 24 === 0) {
            hours = 0;
        }

        secondsDisplay = seconds;
        if (seconds >= 60) {
            secondsDisplay = seconds % 60;
        }
    
        const secondAngle = seconds * 6;
        const minuteAngle = minutes * 6 + seconds * 0.1;
        const hourAngle = (hours % 12) * 30 + minutes * 0.5;
    
        document.querySelector('.second-hand').style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;
        document.querySelector('.minute-hand').style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
        document.querySelector('.hour-hand').style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;

        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondsDisplay.toString().padStart(2, '0')}`;

        document.getElementById("heureActuelle").innerHTML = formattedTime;
    }
    

    /**
     * Mets à jour l'horloge en fonction du fuseau horaire sélectionné.
     * Fait une requête GET à l'API de l'application avec le fuseau horaire en paramètre.
     * Si la requête réussit, met à jour l'heure actuelle, le décalage horaire et lance une nouvelle boucle d'horloge.
     * Si la requête échoue, affiche un message d'erreur dans l'élément HTML id="horloge".
     * @param {string} timezone - Le fuseau horaire sélectionné.
     */
    function timezoneChanged(timezone) {
        timezone = timezone.replace('/', '-');
        fetch(`https://api.allorigins.win/get?url=https://lucasdev.alwaysdata.net/Time/${timezone}`)
            .then(response => response.json())
            .then(data => {
                const responseData = JSON.parse(data.contents);

                if (!responseData || !responseData.time) {
                    console.error("L'heure n'est pas disponible ou a un format invalide.");
                    const horlogeElement = document.getElementById("horloge");
                    if (horlogeElement) {
                        horlogeElement.textContent = "Erreur lors de la récupération de l'heure.";
                    }
                    return;
                }
    
                const time = responseData.time;
                
                if (typeof time === 'string' && time.includes(':')) {
                    const [h, m, s] = time.split(':').map(Number);
    
                    hours = h;
                    minutes = m;
                    seconds = s;
                    timezoneOffset = responseData.timezoneOffset || 0;
    
                    clearInterval(intervalId);
                    intervalId = setInterval(updateClock, 1000);
                    updateClock();
                } else {
                    console.error("Le format de l'heure est invalide :", time);
                    const horlogeElement = document.getElementById("heureActuelle");
                    if (horlogeElement) {
                        horlogeElement.textContent = "Erreur format heure.";
                    }
                }
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'heure pour le fuseau horaire sélectionné : ", error);
                const horlogeElement = document.getElementById("heureActuelle");
                if (horlogeElement) {
                    horlogeElement.textContent = "Erreur lors de la récupération de l'heure.";
                }
            });
    }

    /**
     * Retourne un objet contenant l'heure actuelle (UTC) et le décalage horaire du fuseau.
     * L'objet contient les propriétés suivantes :
     * - hours : L'heure actuelle (UTC).
     * - minutes : Les minutes actuelles (UTC).
     * - seconds : Les secondes actuelles (UTC).
     * - timezoneOffset : Le décalage horaire du fuseau horaire actuel.
     * @returns {Object} L'objet contenant l'heure actuelle et le décalage horaire.
     */
    function exportTime() {
        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            timezoneOffset: timezoneOffset,
        };
    }
    window.exportTime = exportTime;
    
    startClock();

    window.timezoneChanged = timezoneChanged;
});
