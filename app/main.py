import uuid
from pathlib import Path
from os import listdir

from fastapi import FastAPI, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from ApexAiAnalyze import ApexAiAnalyze
from medical_records import MedicalRecords
from medical_records_generator import MedicalRecordGenerator
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse

# Define FastAPI app
app = FastAPI()
CURRENT_DIR = Path(__file__).parent
DATA_DIR = CURRENT_DIR.parent / "data"
# Add CORS settings
origins = [
    "http://localhost:3000",  # Allow frontend origin during development,
    "http://localhost:3001",  # Allow frontend origin during development
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


@app.get("/files/{user_id}")
async def get_uploaded_files(user_id: str):
    user_data_dir = DATA_DIR / str(user_id)
    user_data_dir.mkdir(parents=True, exist_ok=True)  # create user directory if it doesn't exist
    return listdir(user_data_dir)


@app.post("/process_ai")
def process_ai(user_id: str):
    user_data_dir = DATA_DIR / str(user_id)
    prompts_path = DATA_DIR / "prompts"
    prompts_path.mkdir(parents=True, exist_ok=True)
    apex_analyze = ApexAiAnalyze(assets_directory=user_data_dir, prompt_path=prompts_path / "prompt.txt",
                                 destination_directory=user_data_dir)
    apex_analyze.process()


@app.post("/upload/")
async def upload_files(user_id: str = Form(...), files: List[UploadFile] = File(...)):
    user_data_dir = DATA_DIR / str(user_id)
    user_data_dir.mkdir(parents=True, exist_ok=True)  # create user directory if it doesn't exist

    for file in files:
        file_location = user_data_dir / file.filename
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())

    return {"info": f"Files uploaded successfully for user {user_id}"}


@app.get("/download/{user_id}/{filename}")
async def download_file(user_id: int, filename: str):
    user_data_dir = DATA_DIR / str(user_id)
    file_path = user_data_dir / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)


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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
