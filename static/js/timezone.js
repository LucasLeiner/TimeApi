/**
 * Récupère le fuseau horaire pour des coordonnées GPS données.
 * @param {number} lat - La latitude.
 * @param {number} lng - La longitude.
 */
function getTimezoneFromLatLng(lat, lng) {
    console.log(`Coordonnées GPS : lat=${lat}, lng=${lng}`);
    var apiKey = 'CF92NCXAFCRX';
    var timezoneOffset;

    var url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lng}`;
    axios.get(url)
        .then(function (response) {
            var timezone = response.data.zoneName || "Fuseau inconnu";
            console.log("Fuseau horaire :", timezone);
            timezoneOffset = response.data.gmtOffset * 1000;
            document.getElementById('timezone').innerText = timezone.replace('/', '-');
            timezoneChanged(timezone);
        })
        .catch(function (error) {
            console.error("Erreur lors de la récupération du fuseau horaire :", error);
            document.getElementById('timezone').innerText = "Erreur lors de la récupération du fuseau horaire";
        });
}
