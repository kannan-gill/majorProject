import { doc, getDoc } from "firebase/firestore";

var firebaseConfig = {
    apiKey: "Use Your Api Key Here",
    authDomain: "Use Your authDomain Here",
    databaseURL: "Use Your databaseURL Here",
    projectId: "Use Your projectId Here",
    storageBucket: "Use Your storageBucket Here",
    messagingSenderId: "Use Your messagingSenderId Here",
    appId: "Use Your appId Here"
};

firebase.initializeApp(firebaseConfig);


const docRef = doc(db, "datalogs");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
}