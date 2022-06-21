import { db } from '../state/firebase-config';
import { collection, doc, query, where, orderBy, limit, startAt, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

const createDocument = (collectionName, document) => {
    const colRef = collection(db, collectionName);
    return addDoc(colRef, document);
};

const queryDocuments = async (collectionName, queryCriteria, orderByCriteria, pageCursor = '', pageSize = 3) => {
    const colRef = collection(db, collectionName);
    const docSnap = await readDocument(collectionName, pageCursor);
    const q = query(colRef, ...queryCriteria.map(criteria => where(...criteria)), ...orderByCriteria.map(order => orderBy(...order)), startAt(docSnap), limit(pageSize));
    return getDocs(q);
}

const readDocument = async (collectionName, docId) => {
    const colRef = collection(db, collectionName);
    if (docId) {
        const docSnap = await getDoc(doc(colRef, docId));
        return docSnap;
    }
    return Promise.resolve('');
}

const updateDocument = (collectionName, docId, newDocument) => {
    const docRef = doc(db, collectionName, docId);
    return updateDoc(docRef, newDocument);
}

const deleteDocument = (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    return deleteDoc(docRef);
}

const firebaseFirestoreService = {
    createDocument,
    queryDocuments,
    updateDocument,
    deleteDocument,
};

export default firebaseFirestoreService;