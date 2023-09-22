import {useDropzone} from "react-dropzone";
import {useState, useEffect, useCallback} from 'react';

export default function UploadData({onUpload}) {
    const onDrop = useCallback((acceptedFiles) => {
        onUpload(acceptedFiles);
    }, [onUpload]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: '.txt,.csv',
    });

    return (
        <div {...getRootProps()} style={{border: '2px dashed gray', padding: '20px', textAlign: 'center'}}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag and drop txt or csv files here, or click to select files</p>
            }
        </div>
    )
}
