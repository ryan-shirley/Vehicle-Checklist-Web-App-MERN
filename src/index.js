import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import firebase from "firebase/app"

// Add the Performance Monitoring library
import "firebase/performance";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCM-FDki3xRjc1K5PLKWW1Rpca3sz6IbwI",
    authDomain: "vehicle-checklist-hgv.firebaseapp.com",
    databaseURL: "https://vehicle-checklist-hgv.firebaseio.com",
    projectId: "vehicle-checklist-hgv",
    storageBucket: "vehicle-checklist-hgv.appspot.com",
    messagingSenderId: "125264638678",
    appId: "1:125264638678:web:731c5ca6a7bffa9ec5cf77",
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Initialize Performance Monitoring and get a reference to the service
firebase.performance();

ReactDOM.render(<App />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
