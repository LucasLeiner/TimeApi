from Api.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_get_clock_success():
    """
    Test pour vérifier que la page HTML de l'horloge est servie correctement.

    Vérifie que :
    - La réponse a un code 200.
    - Le contenu est du type HTML.
    - Le HTML contient les balises attendues.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]

def test_read_time_success():
    """
    Test pour vérifier que le temps UTC est renvoyé correctement.

    Vérifie que :
    - La réponse a un code 200.
    - Les champs "Name", "Date" et "Time" sont présents dans la réponse JSON.
    - Le champ "Name" a la valeur attendue.
    """
    response = client.get("/Time/UTC")
    assert response.status_code == 200
    data = response.json()
    assert "Name" in data
    assert data["Name"] == "UTC Time"
    assert "Date" in data
    assert "Time" in data

def test_read_time_format():
    """
    Test pour vérifier que les champs 'Date' et 'Time' respectent le format attendu.

    Vérifie que :
    - 'Date' suit le format DD/MM/YYYY.
    - 'Time' suit le format HH:MM:SS.
    """
    response = client.get("/Time/UTC")
    data = response.json()
    assert len(data["Date"].split("/")) == 3
    assert len(data["Time"].split(":")) == 3

def test_get_timezone_time_valid():
    """
    Test pour vérifier que le temps pour une zone horaire valide est renvoyé correctement.

    Vérifie que :
    - La réponse a un code 200.
    - Les champs "timezone", "date" et "time" sont présents dans la réponse JSON.
    - Le champ "timezone" a la valeur attendue.
    """
    response = client.get("/Time/Europe-Paris")
    assert response.status_code == 200
    data = response.json()
    assert "Date" in data
    assert "Time" in data

def test_get_timezone_time_invalid():
    """
    Test pour vérifier qu'une zone horaire invalide retourne une erreur 400.

    Vérifie que :
    - La réponse a un code 400.
    - La réponse JSON contient le détail de l'erreur.
    """
    response = client.get("/Time/Invalid-Timezone")
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Fuseau horaire invalide"

def test_get_timezone_time_edge_case():
    """
    Test pour vérifier que le temps pour une zone horaire limite (e.g., UTC) est renvoyé correctement.

    Vérifie que :
    - La réponse a un code 200.
    - Le champ "timezone" est défini comme "UTC".
    """
    response = client.get("/Time/UTC")
    assert response.status_code == 200
    data = response.json()
    assert "Date" in data
    assert "Time" in data

def test_generate_csv_success():
    """
    Test pour vérifier que la génération de CSV fonctionne avec des données valides.

    Vérifie que :
    - La réponse a un code 200.
    - Le fichier renvoyé est au format CSV.
    - Le contenu du CSV correspond aux données envoyées.
    """
    payload = {
        "weather": {
            "temperature": "15°C",
            "humidity": "80%"
        },
        "timezone": {
            "Europe/Paris": "CET",
            "UTC": "GMT"
        }
    }
    response = client.post("/download/csv", json=payload)
    assert response.status_code == 200
    content_type = response.headers["content-type"].split(";")[0]
    assert content_type == "text/csv", f"Content-Type attendu : text/csv, mais obtenu : {content_type}"
    assert "attachment; filename=data.csv" in response.headers["content-disposition"]
    csv_content = response.content.decode()
    assert "Type,Clé,Valeur" in csv_content
    assert "Météo,temperature,15°C" in csv_content
    assert "Fuseau / Horaire,Europe/Paris,CET" in csv_content

def test_generate_csv_empty_payload():
    """
    Test pour vérifier que la génération de CSV fonctionne avec une charge utile vide.

    Vérifie que :
    - La réponse a un code 200.
    - Le CSV ne contient que l'en-tête.
    """
    payload = {
        "weather": {},
        "timezone": {}
    }
    response = client.post("/download/csv", json=payload)
    assert response.status_code == 200
    csv_content = response.content.decode()
    assert "Type,Clé,Valeur" in csv_content
    assert len(csv_content.splitlines()) == 1

def test_generate_csv_missing_field():
    """
    Test pour vérifier qu'une charge utile partielle renvoie une erreur de validation (422).

    Vérifie que :
    - La réponse a un code 422.
    """
    payload = {
        "weather": {
            "temperature": "15°C"
        }
    }
    response = client.post("/download/csv", json=payload)
    assert response.status_code == 422

def test_generate_csv_invalid_format():
    """
    Test pour vérifier qu'une charge utile mal formée renvoie une erreur de validation (422).

    Vérifie que :
    - La réponse a un code 422.
    """
    payload = {
        "weather": "Not a dict",
        "timezone": "Not a dict"
    }
    response = client.post("/download/csv", json=payload)
    assert response.status_code == 422

def test_404_error():
    """
    Test pour vérifier qu'une route inexistante retourne une erreur 404.

    Vérifie que :
    - La réponse a un code 404.
    - Le message d'erreur contient "Not Found".
    """
    response = client.get("/nonexistent-route")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Not Found"

def test_method_not_allowed():
    """
    Test pour vérifier qu'une méthode HTTP non autorisée retourne une erreur 405.

    Vérifie que :
    - La réponse a un code 405.
    - Le message d'erreur contient "Method Not Allowed".
    """
    response = client.put("/Time/UTC")
    assert response.status_code == 405
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Method Not Allowed"
