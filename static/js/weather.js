/**
 * Récupère les informations météo pour un point de la carte.
 * Met à jour les éléments HTML correspondants avec les informations météo.
 * Si une erreur se produit, met les éléments HTML correspondants à "Erreur".
 * @param {number} lat - La latitude.
 * @param {number} lng - La longitude.
 */
function getWeather(lat, lng) {
    console.log("Appel à getWeather avec les coordonnées :", lat, lng);
    
    // URL de l'API OpenWeatherMap
    const apiKey = "9fb836bb8dd76bba9c246a52993a9ffd";
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
}
