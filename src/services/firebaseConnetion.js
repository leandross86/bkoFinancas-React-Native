import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAebl316l6dnWe9daLSrZsV9rDHCDKNH-Y',
  authDomain: 'bkofinancas.firebaseapp.com',
  databaseURL: 'https://bkofinancas.firebaseio.com',
  projectId: 'bkofinancas',
  storageBucket: 'bkofinancas.appspot.com',
  messagingSenderId: '970033569828',
  appId: '1:970033569828:web:e1b0e3f1526d0ad436b8b1',
  measurementId: 'G-JSPB93SZRM'
}
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
