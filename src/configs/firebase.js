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

// const firebaseConfig = {
//   apiKey: "AIzaSyAp7q2T07VOPchctK0RVVFfdNU9KAjo1Uc",
//   authDomain: "lachagarden.firebaseapp.com",
//   databaseURL: "https://lachagarden-default-rtdb.firebaseio.com",
//   projectId: "lachagarden",
//   storageBucket: "lachagarden.appspot.com",
//   messagingSenderId: "904516436073",
//   appId: "1:904516436073:web:a348ba6fac45f5076c62f8",
//   measurementId: "G-HMF1YHRT6P" 
// };

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);