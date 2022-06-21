import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";
import firebaseStorageService from '../service/firebase-storage';

function ImagePreview({ basePath, existingImageUrl, handleUploadFinish, handleUploadCancel }) {

    const [uploadProgress, setUploadProgress] = useState(-1);
    const [imageUrl, setImageUrl] = useState("");

    const fileInputRef = useRef();

    useEffect(() => {
        if (existingImageUrl) {
            setImageUrl(existingImageUrl);
        }
        else {
            setUploadProgress(-1);
            setImageUrl("");
            fileInputRef.current.value = null;
        }

    }, [existingImageUrl]);

    async function handleFileChanged(e) {
        const files = e.target.files;
        const file = files[0];

        if (!file) {
            alert("File select failed. Please try again");
            return
        }

        const genefratedFileId = uuidv4();
        try {
            const downloadUrl = await firebaseStorageService.uploadFile(
                file,
                `${basePath}/${genefratedFileId}`,
                setUploadProgress
            );
            setImageUrl(downloadUrl);
            handleUploadFinish(downloadUrl);
        } catch (error) {
            setUploadProgress(-1);
            fileInputRef.current.value = null;
            alert(error.message);
            throw error;
        }
    }

    function handleCancelImageClick() {
        firebaseStorageService.deleteFile(imageUrl);
        fileInputRef.current.value = null;
        setImageUrl("");
        setUploadProgress(-1);
        handleUploadCancel();
    }

    return (
        <div className="image-upload-preview-container">
            <input
                type={"file"}
                accept="image/*"
                onChange={handleFileChanged}
                ref={fileInputRef}
                hidden={uploadProgress > -1 || imageUrl}
            />
            {
                !imageUrl && uploadProgress > 1 ? (
                    <div>
                        <label htmlFor='file'>Upload Progress</label>
                        <progress id="file" value={uploadProgress} max="100">
                            {uploadProgress}%
                        </progress>
                        <span>{uploadProgress}</span>
                    </div>
                ) : null
            }
            {
                imageUrl ? (
                    <div className='image-preview'>
                        <img src={imageUrl} alt={imageUrl} className="image" />
                        <button type='button' className='primary-button' onClick={handleCancelImageClick}>Cancel Image</button>
                    </div>
                ) : null
            }
        </div>
    )
};

export default ImagePreview;