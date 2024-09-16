from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import FastAPI, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi import Request

app = FastAPI()
templates = Jinja2Templates(directory="/")

@app.get("/ok")
def get_clock(request: Request):
    return templates.TemplateResponse("templates/clock.html", {"request": request})



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

