import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyASRfmRxbwMjOCHPrKMpbomi50IKv9g580",
  authDomain: "swd-longchim.firebaseapp.com",
  projectId: "swd-longchim",
  storageBucket: "swd-longchim.appspot.com",
  messagingSenderId: "70564732436",
  appId: "1:70564732436:web:2136ca6a5301d462505101",
  measurementId: "G-TD38EC0PJ0"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);