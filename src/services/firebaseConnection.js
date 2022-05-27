import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage"


const firebaseConfig = {

  apiKey: "AIzaSyAhobRtnYRviySVuNa4UjP3lpdeTghzSKM",

  authDomain: "sistema-e60ff.firebaseapp.com",

  projectId: "sistema-e60ff",

  storageBucket: "sistema-e60ff.appspot.com",

  messagingSenderId: "230397327313",

  appId: "1:230397327313:web:90954ca45625711aee92f0",

  measurementId: "G-LD40KETCSB"

};


// Initialize Firebase se nao tiver nenhum user logado
if(!firebase.apps.length){

    firebase.initializeApp(firebaseConfig);

}

export default firebase;