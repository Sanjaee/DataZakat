// Api/Firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHbYyzdb8eXevMgp0537n7MCB-ql_SMRk",
  authDomain: "zakat-c8687.firebaseapp.com",
  projectId: "zakat-c8687",
  storageBucket: "zakat-c8687.appspot.com",
  messagingSenderId: "595136108499",
  appId: "1:595136108499:web:c86d82463d3c4302eb4126",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
