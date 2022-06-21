import { storage } from '../state/firebase-config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const uploadFile = async (file, fullFilePath, progressCallback) => {
    const storageRef = ref(storage, fullFilePath);
    // 'file' comes from the Blob or File API
    const uploadTask = uploadBytesResumable(storageRef, file);
    //monitor upload progress
    uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            progressCallback(progress);
        },
        (error) => {
            // Handle unsuccessful uploads
            console.log(error.message);
            throw error;
        })

    await uploadTask;
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    console.log('File available at', downloadURL);
    return downloadURL;
}

const deleteFile = async (fileDownloadUrl) => {
    const decodedUrl = decodeURIComponent(fileDownloadUrl);
    const startIdx = decodedUrl.indexOf("/o/") + 3;
    const endIdx = decodedUrl.indexOf("?");
    const filePath = decodedUrl.substring(startIdx, endIdx);
    const storageRef = ref(storage, filePath);
    try {
        await deleteObject(storageRef);
    } catch (error) {
        console.log(error.message);
        throw error;
     }
}

const firebaseStorageService = {
    uploadFile,
    deleteFile
};

export default firebaseStorageService;