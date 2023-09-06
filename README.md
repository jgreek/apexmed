# ApexMed
ApexMed (Medicine Optimization During Surgeries) is a solution designed to address inefficiencies in medicine inventory during surgical operations. By harnessing data science, this application derives valuable insights from surgical and inventory records to minimize waste, mitigate costs, and ensure consistent medication availability during surgeries.

## Table of Contents
- [Background](#background)
- [Installation](#installation)
- [Usage](#usage)
- [Data Collection](#data-collection)
- [Contribute](#contribute)
- [License](#license)

## Background
Surgeries require precise administration of medications. However, inefficiencies in tracking, utilizing, and replenishing medicine inventories can lead to waste, increased costs, and potential shortages during critical operations. This project leverages data science to draw actionable insights from surgical and medicine inventory records, ensuring optimal medicine use during surgeries.

## Installation

### Front end
```bash
# Navigate to the frontend directory
cd frontend

# Install the required npm packages
npm install

# To run the development server
npm run dev

```
### Fast API

```# Navigate to the backend directory
cd backend-directory-name

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate the virtual environment
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install required Python packages
pip install -r requirements.txt
```

## Usage
Provide detailed instructions on how to run the application, access endpoints, etc.

```bash
# Example command to run the application
uvicorn app.main:app --reload
```

## Data Collection

1. **Surgical Records**  
   - Objective: Gather comprehensive data on past surgeries.
   - Details:
     - Types of surgeries conducted.
     - Anonymized patient details.
     - Medications administered during each surgery.

2. **Medicine Inventories**  
   - Objective: Maintain an updated record of medicine inventories.
   - Details:
     - Track consumption rates of medicines.
     - Monitor expiry dates to reduce wastage.
     - Understand costs associated with each medicine for better budgeting.

(Include any tools, software, or methods you're using for data collection)

## Contribute
Here's how you can contribute to the project:
- Fork the repository.
- Create a new branch (`git checkout -b feature-branch`).
- Make changes.
- Push to the branch (`git push origin feature-branch`).
- Create a new Pull Request.

## License
This project is licensed under the MIT License. The MIT License is a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.

*license (e.g., MIT, GPL, etc.)*