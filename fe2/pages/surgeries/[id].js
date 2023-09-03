import {useRouter} from 'next/router';
import SurgeriesLayout from "@/pages/surgeries/layout";
import {useEffect, useState} from "react";

export default function EditPage() {
    const [record, setRecord] = useState(null);
    const router = useRouter();
    const {id} = router.query; // Getting the ID from the query parameter


    useEffect(() => {
        async function fetchRecord() {
            if (id) {
                const res = await fetch(`http://localhost:8000/medical_record/${id}`);
                const data = await res.json();
                setRecord(data);
            }
        }

        fetchRecord();
    }, [id]);

    const handleSave = async () => {
        // Handle sending the edited data back to the FastAPI endpoint
        // This is a basic example and should be expanded with error handling and validation
        const response = await fetch(`http://localhost:8000/update_record`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        });

        if (response.ok) {
            // Redirect back to the list or show a success message
        }
    };

    if (!record) return <div>Loading...</div>;

    return (
        <SurgeriesLayout>
            <div className="container mx-auto px-4 py-6 text-gray-800">
                <h2 className="text-2xl mb-4">Edit Medical Record</h2>
                <div>{JSON.stringify(record)}</div>
                {/* Here you'll render form fields for each property of the record. Example: */}
                <label className="block mb-2">Date of Procedure</label>
                <input
                    value={record.VisitInformation?.VisitDate}
                    onChange={(e) => setRecord(prev => ({...prev, VisitInformation: {VisitDate: e.target.value}}))}
                    className="border mb-4 p-2"
                />
                {/* Repeat similar blocks for other fields */}
                <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save
                </button>
            </div>
        </SurgeriesLayout>
    );
}

