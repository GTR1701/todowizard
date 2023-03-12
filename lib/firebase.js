// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, where, getDocs, query, limit } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyALfDJMCDWvKNhVbDxXsozD9l2iJD3ROs4",
    authDomain: "todo-wizard-bfd29.firebaseapp.com",
    projectId: "todo-wizard-bfd29",
    storageBucket: "todo-wizard-bfd29.appspot.com",
    messagingSenderId: "625637820211",
    appId: "1:625637820211:web:199c637ab063b70a80e046",
    measurementId: "G-27N87GGR38"
};
function createFirebaseApp(config) {
    try {
        return getApp();
    } catch {
        return initializeApp(config);
    }
}

const firebaseApp = createFirebaseApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(firebaseApp);
export async function getUserWithUsername(username) {

    const q = query(
        collection(firestore, 'users'),
        where('username', '==', username),
        limit(1)
    )
    const userDoc = (await getDocs(q)).docs[0];
    return userDoc;
}

export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        dataPrzyjazdu: data?.dataPrzyjazdu.toMillis() || 0,
        dataWyjazdu: data?.dataWyjazdu.toMillis() || 0,
    };
}

// const analytics = getAnalytics(firebaseApp);