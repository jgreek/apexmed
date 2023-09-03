"use client";
import {useState, useEffect} from 'react';
import Link from "next/link";

export default function Page() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const limit = 10;

    useEffect(() => {
        async function fetchData() {
            // Modify this line to hit the correct endpoint.
            const res = await fetch(`http://localhost:8000/retrieve_records?start_date=2022-01-01&end_date=2023-12-31`);
            const json = await res.json();
            setData(json);
        }

        fetchData();
    }, [page]);

    const headers = [
        "Date of Procedure",
        "Patient ID",
        "Doctor Name",
        "Medications Used",
        "Usage",
        "Edit" // Edit button header
    ];

    return (
        <div className="container mx-auto px-4 py-6 text-gray-800">
            <div className="overflow-x-auto">

                <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
                    <thead>
                    <tr>
                        {headers.map(header => (
                            <th
                                key={header}
                                className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((record, index) => (
                        <tr key={`record_${index}`}>
                            <td className="py-2 px-4">{record.VisitInformation.VisitDate}</td>
                            <td className="py-2 px-4">{record.PatientInformation.PatientID}</td>
                            <td className="py-2 px-4">{record.DoctorInformation.DoctorName}</td>
                            <td className="py-2 px-4">{record.MedicineInformation.map(med => med.MedicineName).join(", ")}</td>
                            <td className="py-2 px-4">{record.MedicineUsageDuringVisit.Usage}</td>
                            <td className="py-2 px-4">
                                <Link href={`/surgeries/edit?id=${record.VisitInformation.VisitID}`} legacyBehavior>
                                    <a className="text-blue-500 hover:text-blue-700 underline">Edit</a>
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex my-4 space-x-4">
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Previous
                </button>
                <button onClick={() => setPage((prev) => prev + 1)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Next
                </button>
            </div>
        </div>
    );
}
