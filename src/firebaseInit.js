// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCe2ftvQaIfE0S_dlpoDnejQ3QSD5qGIlQ',
  authDomain: 'jbmusic-fda5e.firebaseapp.com',
  projectId: 'jbmusic-fda5e',
  storageBucket: 'jbmusic-fda5e.appspot.com',
  messagingSenderId: '463046275074',
  appId: '1:463046275074:web:28732457eb24349e0f771b',
  // measurementId: '${config.measurementId}',
};

// Initialize Firebase
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);
}
export const auth = getAuth();
