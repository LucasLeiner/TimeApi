from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import FastAPI, HTTPException, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import logging
import requests
from fastapi.responses import StreamingResponse
import csv
from io import StringIO
from pydantic import BaseModel
from typing import Dict

app = FastAPI()
templates = Jinja2Templates(directory="../templates")
app.mount("/static", StaticFiles(directory="../static"), name="static")

@app.get("/map")
def get_clock(request: Request):
    return templates.TemplateResponse("map.html", {"request": request})

@app.get("/Time/UTC")
def readTime():
    dateString = datetime.utcnow().strftime("%d/%m/%Y")
    timeString = datetime.utcnow().strftime("%H:%M:%S")
    return {"Name": "UTC Time", "Date": dateString, "Time": timeString}

@app.get("/Time/{timezone}")
def get_timezone_time(timezone: str):
    # Remplacer les "-" par "/"
    formatted_timezone = timezone.replace("-", "/")
    
    try:
        tz = ZoneInfo(formatted_timezone)
    except Exception:
        raise HTTPException(status_code=400, detail="Fuseau horaire invalide")

    now_in_tz = datetime.now(tz)
    date_string = now_in_tz.strftime("%d/%m/%Y")
    time_string = now_in_tz.strftime("%H:%M:%S")

    return {"timezone": formatted_timezone, "date": date_string, "time": time_string}


API_KEY_WEATHER = "9fb836bb8dd76bba9c246a52993a9ffd"

@app.get("/weather/{lat}/{lng}")
def get_weather(lat: float, lng: float):
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={API_KEY_WEATHER}&units=metric"
        response = requests.get(url)
        data = response.json()

        if response.status_code != 200:
            logging.error(f"Erreur API météo : {data.get('message', 'Erreur inconnue')}")
            raise HTTPException(status_code=response.status_code, detail=data.get("message", "Erreur API météo"))
        
        weather = {
            "temperature": data["main"]["temp"],
            "description": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"]
        }
        return weather

    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des données météo.")


class DownloadRequest(BaseModel):
    weather: Dict[str, str]
    timezone: Dict[str, str]

@app.post("/download/csv")
def generate_csv(download_request: DownloadRequest):
    csv_buffer = StringIO()
    writer = csv.writer(csv_buffer)

    writer.writerow(["Type", "Clé", "Valeur"])

    for key, value in download_request.weather.items():
        writer.writerow(["Météo", key, value])

    for key, value in download_request.timezone.items():
        writer.writerow(["Fuseau Horaire", key, value])

    csv_buffer.seek(0)

    return StreamingResponse(
        csv_buffer,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=data.csv"}
    )