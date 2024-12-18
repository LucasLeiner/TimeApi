from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import FastAPI, HTTPException, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import logging
# import requests
from fastapi.responses import StreamingResponse
import csv
from io import StringIO
from pydantic import BaseModel
from typing import Dict

app = FastAPI()
templates = Jinja2Templates(directory="../templates")
app.mount("/static", StaticFiles(directory="../static"), name="static")

@app.get("/")
def get_clock(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

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
        writer.writerow(["Fuseau / Horaire", key, value])

    csv_buffer.seek(0)

    return StreamingResponse(
        csv_buffer,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=data.csv"}
    )