import {useState, useEffect} from 'react';
import Link from "next/link";
import SurgeriesLayout from "@/pages/surgeries/layout";
import UploadData from '../components/UploadData';
import axios from 'axios';

export default function Page() {
    const BASE_URL = "http://localhost:8000"; // FastAPI server URL
    const userId = "jg23726"; // This will be retrieved dynamically, e.g., from session storage, user context, etc.
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]); // New state to store uploaded files list

    const fetchUploadedFiles = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/files/${userId}`);
            setUploadedFiles(response.data);
        } catch (error) {
            console.error('Error fetching uploaded files:', error);
        }
    };
    useEffect(() => {
        // Fetch uploaded files from the server
        fetchUploadedFiles();
    }, []);

    const handleUpload = (uploadedFiles) => {
        setFiles([...files, ...uploadedFiles]);
    };

    const handleProcessAi = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/process_ai/`);
            // After a successful upload, fetch the list of uploaded files again.
            await fetchUploadedFiles();
            console.log('Files uploaded:', response.data);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    }

    const handleUploadButtonClick = async () => {
        const formData = new FormData();

        formData.append('user_id', userId);  // Include user ID in the form data

        files.forEach(file => {
            formData.append('files', file);
        });

        // Updated endpoint to include user_id
        try {
            const response = await axios.post(`${BASE_URL}/upload/`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            // After a successful upload, fetch the list of uploaded files again.
            await fetchUploadedFiles();
            console.log('Files uploaded:', response.data);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    return (
        <SurgeriesLayout>
            <div>
                <h1>Upload Files</h1>
                <UploadData onUpload={handleUpload}/>
                <button onClick={handleUploadButtonClick}>Upload to Server</button>
                <button onClick={handleProcessAi}>Process AI</button>

                <h2><strong>Uploaded Files</strong></h2>
                <ul>
                    {uploadedFiles.map((file, idx) => ( // Change to uploadedFiles to render the fetched list
                        <li key={`file_${idx}`}>{file}</li>
                    ))}
                </ul>
            </div>
        </SurgeriesLayout>
    );
}
