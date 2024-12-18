function downloadData() {
    // Récupérer les données météo
    const weatherData = {
        temperature: document.getElementById('temperature').textContent,
        description: document.getElementById('description').textContent,
        humidity: document.getElementById('humidity').textContent,
        wind_speed: document.getElementById('wind_speed').textContent
    };
    console.log("Données météo à exporter :", weatherData);

    // Récupérer les données de fuseau horaire
    const timezoneData = {
        timezone: document.getElementById('timezone').textContent
    };
    console.log("Données de fuseau horaire à exporter :", timezoneData);

    // Récupérer l'heure actuelle
    const timeData = exportTime();
    console.log("Données d'heure à exporter :", timeData);

    // Fusionner toutes les données
    const exportData = {
        weather: weatherData,
        timezone: timezoneData,
        time: timeData
    };

    // Envoyer les données au serveur pour créer un fichier CSV
    axios.post('/download/csv', exportData, { responseType: 'blob' })
        .then(function(response) {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'data.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(function(error) {
            console.error("Erreur lors du téléchargement des données :", error);
        });
}

const downloadButton = document.getElementById('download-button');
downloadButton.addEventListener('click', downloadData);
