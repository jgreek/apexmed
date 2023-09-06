import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from .medical_records import MedicalRecords
from .medical_records_generator import MedicalRecordGenerator

# Define FastAPI app
app = FastAPI()
CURRENT_DIR = Path(__file__).parent
DATA_DIR = CURRENT_DIR.parent / "data"
# Add CORS settings
origins = [
    "http://localhost:3000",  # Allow frontend origin during development
    "http://your-production-domain.com",  # You might want to add your production domain too
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import MedicalRecords class and instantiate
records = MedicalRecords(Path(DATA_DIR))

# Define Pydantic models
class Record(BaseModel):
    PatientInformation: dict
    VisitInformation: dict
    MedicineInformation: List[dict]
    MedicineUsageDuringVisit: dict
    DoctorInformation: dict

class RecordUpdate(BaseModel):
    record_id: uuid.UUID
    updated_record: Record

# Define FastAPI routes

@app.post("/create_record/")
def create_record(record: Record):
    return {"record_id": records.create_record(record.dict())}

@app.get("/retrieve_records/")
def retrieve_records(start_date: str, end_date: str):
    df = records.retrieve_records(start_date, end_date)
    return df.to_dict('records')


@app.get("/medical_record/{visit_id}")
def read_medical_record(visit_id: str):
    record = records.get_record_by_visit_id(visit_id)
    if record:
        return record
    else:
        raise HTTPException(status_code=404, detail="Record not found")

@app.get("/search_by_doctor/")
def search_by_doctor(doctor_id: uuid.UUID):
    df = records.search_by_doctor(str(doctor_id))
    return df.to_dict('records')

@app.get("/search_by_medicine/")
def search_by_medicine(medicine_id: uuid.UUID):
    df = records.search_by_medicine(str(medicine_id))
    return df.to_dict('records')

@app.put("/update_record/")
def update_record(record_update: RecordUpdate):
    success = records.update_record(str(record_update.record_id), record_update.updated_record.dict())
    if success:
        return {"status": "success", "message": "Record updated successfully."}
    else:
        raise HTTPException(status_code=404, detail="Record not found")

@app.get("/populate_records/")
def populate_records():
    generator = MedicalRecordGenerator(DATA_DIR)
    generator.generate_records(10, 12, wipe=False)
    return {"status": "success", "message": "Record updated successfully."}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
