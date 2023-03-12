// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);