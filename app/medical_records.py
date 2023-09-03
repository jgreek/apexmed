import json
import pandas as pd
from pathlib import Path
import uuid


class MedicalRecords:
    def __init__(self, assets_directory):
        self.assets_directory = Path(assets_directory)
        self.assets_directory.mkdir(parents=True, exist_ok=True)

    def _get_record_path(self, date):
        year, month, day = date.split("-")
        return self.assets_directory / year / month / day

    def create_record(self, record):
        visit_id = record["VisitInformation"]["VisitID"]  # Use VisitID as the filename
        record_path = self._get_record_path(record["VisitInformation"]["VisitDate"])
        record_path.mkdir(parents=True, exist_ok=True)

        with open(record_path / f"{visit_id}.json", "w") as file:
            json.dump(record, file)
        return visit_id

    def get_record_by_visit_id(self, visit_id):
        """Retrieve a record by its VisitID."""
        for path in self.assets_directory.rglob(f'*/*/*/{visit_id}.json'):
            with open(path, 'r') as file:
                record = json.load(file)
                return record
        return None

    def retrieve_records(self, start_date, end_date):
        start_path = self._get_record_path(start_date)
        end_path = self._get_record_path(end_date)
        records = []

        # Loop through each directory in the date range
        for path in sorted(self.assets_directory.rglob('*.json')):
            if start_path <= path.parent <= end_path:
                with open(path, 'r') as file:
                    records.append(json.load(file))

        return pd.DataFrame(records)

    def search_by_doctor(self, doctor_id):
        records = []
        for path in self.assets_directory.rglob(f'*/*/*/{doctor_id}*.json'):
            with open(path, 'r') as file:
                records.append(json.load(file))
        return pd.DataFrame(records)

    def search_by_medicine(self, medicine_id):
        records = []

        for path in self.assets_directory.rglob('*.json'):
            with open(path, 'r') as file:
                record = json.load(file)
                medicines = record.get('MedicineUsageDuringVisit', {}).get('MedicinesUsed', [])
                for medicine in medicines:
                    if medicine['MedicineID'] == medicine_id:
                        records.append(record)
                        break

        return pd.DataFrame(records)

    def update_record(self, record_id, updated_record):
        date = updated_record["VisitInformation"]["VisitDate"]
        record_path = self._get_record_path(date) / f"{record_id}.json"
        if record_path.exists():
            with open(record_path, "w") as file:
                json.dump(updated_record, file)
            return True
        return False
