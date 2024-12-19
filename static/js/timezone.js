/**
 * Récupère le fuseau horaire pour des coordonnées GPS données.
 * @param {number} lat - La latitude.
 * @param {number} lng - La longitude.
 */
function getTimezoneFromLatLng(lat, lng) {
    var timezoneOffset;

    // Charger la clé API depuis config.json
    fetch('/static/config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Impossible de charger le fichier config.json");
            }
            return response.json();
        })
        .then(config => {
            const apiKey = config.timezoneApiKey;

            var url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lng}`;
            axios.get(url)
                .then(function (response) {
                    var timezone = response.data.zoneName || "Fuseau inconnu";
                    timezoneOffset = response.data.gmtOffset * 1000;
                    document.getElementById('timezone').innerText = timezone.replace('/', '-');
                    timezoneChanged(timezone);
                })
                .catch(function (error) {
                    console.error("Erreur lors de la récupération du fuseau horaire :", error);
                    document.getElementById('timezone').innerText = "Erreur lors de la récupération du fuseau horaire";
                });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération de la clé API :", error);
            document.getElementById('timezone').innerText = "Erreur lors de la récupération de la clé API";
        });
}
