import json
import shutil
import uuid
from pathlib import Path
from datetime import datetime, timedelta
import random
from faker import Faker
CURRENT_DIR = Path(__file__).parent
DATA_DIR = CURRENT_DIR.parent / "data"

class MedicalRecordGenerator:
    def __init__(self, assets_directory):
        self.assets_directory = Path(assets_directory)
        self.fake = Faker()

    def _wipe_directory(self):
        if self.assets_directory.exists() and self.assets_directory.is_dir():
            shutil.rmtree(self.assets_directory)

    def generate_records(self, n, y_months, wipe=False):
        if wipe:
            self._wipe_directory()

        outcomes = [
            # Outcome 1
            "The procedure was completed successfully without any complications. The patient remained hemodynamically stable throughout. There were no signs of bleeding, infections, or allergic reactions. The surgical site was closed in layers without difficulty. The patient was then safely transferred to the recovery room in a stable condition.",
            # Outcome 2
            "The procedure was completed successfully. However, during the process, there was a minor bleed from a branch of the lateral epigastric artery, which was promptly controlled with electrocautery. No major blood loss was noted. The remainder of the procedure was uneventful, and the patient was transferred to the recovery room for close monitoring.",
            # Outcome 3
            "The procedure was more complicated than anticipated due to the presence of extensive adhesions from previous surgeries. Despite careful dissection, there was an inadvertent tear in the small bowel, which required repair. An additional resection of the affected bowel segment was performed, and primary anastomosis was done. The patient will require close monitoring in the ICU and may need further interventions."
        ]

        painkillers = ['Ibuprofen', 'Acetaminophen', 'Naproxen', 'Aspirin', 'Diclofenac']

        for _ in range(n):
            patient_name = self.fake.name()
            doctor_name = self.fake.name()
            visit_date = (datetime.now() - timedelta(days=random.randint(0, y_months * 30))).strftime('%Y-%m-%d')
            medicine_used = random.choice(painkillers)

            patient_id = str(uuid.uuid4())
            visit_id = str(uuid.uuid4())

            record = {
                "PatientInformation": {
                    "PatientID": patient_id,
                    "Name": patient_name,
                    "DOB": self.fake.date_of_birth().strftime('%Y-%m-%d'),
                    "Gender": random.choice(['Male', 'Female']),
                    "ContactInfo": {
                        "Address": self.fake.address().replace('\n', ', '),
                        "Phone": self.fake.phone_number(),
                        "Email": self.fake.email()
                    }
                },
                "VisitInformation": {
                    "VisitID": visit_id,
                    "PatientID": patient_id,
                    "VisitDate": visit_date,
                    "DoctorID": str(uuid.uuid4()),
                    "Diagnosis": "Pain",
                    "ProcedureInfo": f"Administered {medicine_used} for pain relief.",
                    "PostProcedureNotes": random.choice(outcomes).replace("The patient", patient_name)
                },
                "MedicineInformation": [
                    {
                        "MedicineID": str(uuid.uuid4()),
                        "MedicineName": medicine_used,
                        "MedicineType": "Tablet",
                        "DosageInfo": "2 tablets every 6 hours"
                    },
                    {
                        "MedicineID": str(uuid.uuid4()),
                        "MedicineName": random.choice(painkillers),
                        "MedicineType": "Syrup",
                        "DosageInfo": "5ml twice daily"
                    }
                ],
                "MedicineUsageDuringVisit": {
                    "VisitID": visit_id,
                    "MedicinesUsed": [
                        {
                            "UsageID": str(uuid.uuid4()),
                            "MedicineID": str(uuid.uuid4()),
                            "QuantityUsed": "2",
                            "Purpose": f"For pain relief, {medicine_used} administered."
                        }
                    ]
                },
                "DoctorInformation": {
                    "DoctorID": str(uuid.uuid4()),
                    "DoctorName": doctor_name,
                    "Specialization": "General",
                    "ContactInfo": {
                        "Phone": self.fake.phone_number(),
                        "Email": self.fake.email()
                    }
                }
            }

            # Save the generated record
            record_path = self.assets_directory / visit_date.split("-")[0] / visit_date.split("-")[1] / \
                          visit_date.split("-")[2]
            record_path.mkdir(parents=True, exist_ok=True)

            with open(record_path / f"{visit_id}.json", "w") as file:
                json.dump(record, file)


# Usage
if __name__ == "__main__":
    generator = MedicalRecordGenerator(DATA_DIR)
    generator.generate_records(10, 12, wipe=True)
