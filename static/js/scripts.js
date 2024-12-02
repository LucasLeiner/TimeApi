var map = L.map('map').setView([20, 0], 2);
        var apiKey = 'CF92NCXAFCRX';
        var marker, timezoneOffset;
        var intervalId;

        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            noWrap: true
        }).addTo(map);

        
        function getTimezoneFromLatLng(lat, lng) {
            var url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lng}`;
            axios.get(url)
                .then(function (response) {
                    var timezone = response.data.zoneName || "Fuseau inconnu";
                    timezoneOffset = response.data.gmtOffset * 1000; // En millisecondes
                    document.getElementById('timezone').innerText = timezone.replace('/', '-');
                    mettreAJourHorloge(); 

                    
                    if (intervalId) clearInterval(intervalId);
                    intervalId = setInterval(mettreAJourHorloge, 1000);
                })
                .catch(function (error) {
                    console.error("Erreur lors de la récupération du fuseau horaire :", error);
                    document.getElementById('timezone').innerText = "Erreur lors de la récupération du fuseau horaire";
                });
        }

        
        function mettreAJourHorloge() {
            if (timezoneOffset !== undefined) {
                var maintenant = new Date(new Date().getTime() + timezoneOffset);
                var heures = maintenant.getUTCHours();
                var minutes = maintenant.getUTCMinutes();
                var secondes = maintenant.getUTCSeconds();
                
                
                heures = heures < 10 ? '0' + heures : heures;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                secondes = secondes < 10 ? '0' + secondes : secondes;
                
                document.getElementById('heureActuelle').textContent = heures + ':' + minutes + ':' + secondes;
            }
        }

        
        map.on('click', function (e) {
            var lat = e.latlng.lat;
            var lng = e.latlng.lng;

            if (marker) {
                marker.setLatLng([lat, lng]);
            } else {
                marker = L.marker([lat, lng]).addTo(map);
            }

            getTimezoneFromLatLng(lat, lng);
        });


function getWeather(lat, lng) {
    console.log("Appel à getWeather avec les coordonnées :", lat, lng);
    axios.get(`/weather/${lat}/${lng}`)
        .then(function(response) {
            const weather = response.data;
            document.getElementById('temperature').textContent = weather.temperature;
            document.getElementById('description').textContent = weather.description;
            document.getElementById('humidity').textContent = weather.humidity;
            document.getElementById('wind_speed').textContent = weather.wind_speed;
        })
        .catch(function(error) {
            document.getElementById('temperature').textContent = "Erreur";
            document.getElementById('description').textContent = "Erreur";
            document.getElementById('humidity').textContent = "Erreur";
            document.getElementById('wind_speed').textContent = "Erreur";
        });
}

map.on('click', function(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng]).addTo(map);
    }

    getTimezoneFromLatLng(lat, lng);
    getWeather(lat, lng);
});

