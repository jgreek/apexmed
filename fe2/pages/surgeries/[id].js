import {useRouter} from 'next/router';
import SurgeriesLayout from "@/pages/surgeries/layout";
import {useEffect, useState} from "react";

export default function EditPage() {
    const [record, setRecord] = useState(null);
    const router = useRouter();
    const {id} = router.query;

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

    const handleInputChange = (path, value) => {
        let obj = record;
        const keys = path.split('.');
        keys.slice(0, -1).forEach(key => obj = obj[key]);
        obj[keys.pop()] = value;
        setRecord({...record});
    }

    const handleSave = async () => {
        const response = await fetch(`http://localhost:8000/update_record`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        });
        if (response.ok) {
            // Redirect or success message
        }
    };

    if (!record) return <div>Loading...</div>;

    return (
        <SurgeriesLayout>
            <div className="container mx-auto px-4 py-6 text-gray-800">
                <h2 className="text-2xl mb-4">Edit Medical Record</h2>
                <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    {/* For demonstration, rendering just a couple of properties. You can extend this for other properties of the record. */}
                    <div className="mb-4">
                        <label className="block mb-2">Date of Procedure</label>
                        <input
                            value={record.VisitInformation?.VisitDate || ''}
                            onChange={e => handleInputChange('VisitInformation.VisitDate', e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>

                    {/* Assume there's another property "PatientName" at the root of the record object. */}
                    <div className="mb-4">
                        <label className="block mb-2">Patient Name</label>
                        <input
                            value={record.PatientInformation.Name || ''}
                            onChange={e => handleInputChange('PatientInformation.Name', e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>

                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        Save
                    </button>
                </form>
            </div>
        </SurgeriesLayout>
    );
}
