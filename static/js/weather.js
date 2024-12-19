/**
 * Récupère les informations météo pour un point de la carte.
 * Met à jour les éléments HTML correspondants avec les informations météo.
 * Si une erreur se produit, met les éléments HTML correspondants à "Erreur".
 * @param {number} lat - La latitude.
 * @param {number} lng - La longitude.
 */
function getWeather(lat, lng) {
    fetch('/static/config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Impossible de charger le fichier config.json");
            }
            return response.json();
        })
        .then(config => {
            const apiKey = config.weatherApiKey;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

            axios.get(url)
                .then(function(response) {
                    const data = response.data;

                    // Mise à jour des éléments HTML avec les données météo
                    document.getElementById('temperature').textContent = `${data.main.temp} °C`;
                    document.getElementById('description').textContent = data.weather[0].description;
                    document.getElementById('humidity').textContent = `${data.main.humidity} %`;
                    document.getElementById('wind_speed').textContent = `${data.wind.speed} m/s`;
                })
                .catch(function(error) {
                    console.error("Erreur lors de la récupération des données météo :", error);

                    // Mise à jour des éléments HTML en cas d'erreur
                    document.getElementById('temperature').textContent = "Erreur";
                    document.getElementById('description').textContent = "Erreur";
                    document.getElementById('humidity').textContent = "Erreur";
                    document.getElementById('wind_speed').textContent = "Erreur";
                });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération de la clé API météo :", error);

            // Mise à jour des éléments HTML en cas d'erreur
            document.getElementById('temperature').textContent = "Erreur API";
            document.getElementById('description').textContent = "Erreur API";
            document.getElementById('humidity').textContent = "Erreur API";
            document.getElementById('wind_speed').textContent = "Erreur API";
        });
}

/**
 * Retourne un objet contenant les informations météo actuelles.
 * L'objet contient les propriétés suivantes :
 * - temperature : La température en degrés Celsius.
 * - description : La description des conditions météorologiques.
 * - humidity : L'humidité relative en pourcentage.
 * - windSpeed : La vitesse du vent en mètres par seconde.
 * @returns {Object} L'objet contenant les informations météo.
 */
function exportWeather() {
    const temperature = document.getElementById('temperature').textContent;
    const description = document.getElementById('description').textContent;
    const humidity = document.getElementById('humidity').textContent;
    const windSpeed = document.getElementById('wind_speed').textContent;

    return {
        temperature,
        description,
        humidity,
        windSpeed,
    };
}