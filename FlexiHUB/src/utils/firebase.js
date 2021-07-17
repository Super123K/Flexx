import firebase from "firebase";
import "firebase/firestore";
var firebaseConfig = {
  apiKey: "AIzaSyCfdvxMq6X0tNGArck19aeCRvGTDuLgBXQ",
  authDomain: "bossdg-ea39a.firebaseapp.com",
  projectId: "bossdg-ea39a",
  storageBucket: "bossdg-ea39a.appspot.com",
  messagingSenderId: "388123766364",
  appId: "1:388123766364:web:6904bf0c7772ca3461c099",
  measurementId: "G-62PX7CSC1G",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
