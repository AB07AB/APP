import firebase from 'firebase/app'
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyA9TAo2bHqOuKq8N49ka_3tsnVaPrrhpCg",
  authDomain: "wilyapp-81c33.firebaseapp.com",
  projectId: "wilyapp-81c33",
  storageBucket: "wilyapp-81c33.appspot.com",
  messagingSenderId: "644504348955",
  appId: "1:644504348955:web:541f052f5915e28fa18bbe"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();