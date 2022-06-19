import { auth } from '../state/firebaseConfig';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';

const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const logoutUser = () => {
    return signOut(auth);
};

const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
};

const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
};

const subscribeToAuthChanges = (handleAuthChange) => {
    onAuthStateChanged(auth, (user) => handleAuthChange(user))
};

const firebaseAuthService = {
    registerUser,
    loginUser,
    logoutUser,
    loginWithGoogle,
    resetPassword,
    subscribeToAuthChanges
};

export default firebaseAuthService;