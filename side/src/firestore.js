// Your web app's Firebase configuration
import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyC3sYbD22j91tcybNd1t8sJsE3a4hlpgtw",
    authDomain: "chrome-sensor-291917.firebaseapp.com",
    projectId: "chrome-sensor-291917",
    storageBucket: "chrome-sensor-291917.appspot.com",
    messagingSenderId: "854239827973",
    appId: "1:854239827973:web:1a6e5a62bec1aec036e46c"
  };
firebase.initializeApp(firebaseConfig);

export default firebase.firestore()