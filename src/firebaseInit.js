import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyCQL8XdBZGn_3kR51MTU3Sz5CF5O9bs0KQ',
  authDomain: 'bibi-307206.firebaseapp.com',
  projectId: 'bibi-307206',
  storageBucket: 'bibi-307206.appspot.com',
  messagingSenderId: '612653883280',
  appId: '1:612653883280:web:d8ce562ca1f9a89f305d15',
  measurementId: 'G-QK8WL1JW0F',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

export const firestorage = firebaseApp.firestorage
