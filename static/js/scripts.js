function downloadData() {
    const weatherData = {
        temperature: document.getElementById('temperature').textContent,
        description: document.getElementById('description').textContent,
        humidity: document.getElementById('humidity').textContent,
        wind_speed: document.getElementById('wind_speed').textContent
    };

    const timezoneData = {
        timezone: document.getElementById('timezone').textContent,
        current_time: document.getElementById('heureActuelle').textContent
    };

    // Envoyer les données au serveur pour créer un fichier CSV
    axios.post('/download/csv', { weather: weatherData, timezone: timezoneData }, { responseType: 'blob' })
        .then(function(response) {
            // Créer un lien pour télécharger le fichier
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
