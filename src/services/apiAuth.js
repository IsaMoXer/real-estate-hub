import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "../firebase";
import { toast } from "react-toastify";

const auth = getAuth();

export async function signUp({ fullName, email, password }) {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Add the name of the user to the user object
    await updateProfile(auth.currentUser, {
      displayName: fullName,
    });

    const user = userCredentials.user;

    // Create a users collection inside the db without sensitive information
    const userDBObject = { fullName, email, timestamp: serverTimestamp() };
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, userDBObject);
    toast.success("You registered successfully!");
  } catch (error) {
    console.log(error.message);
    toast.error(`User could NOT be registered: ${error.message}`);
    //throw error;
    return { success: false, error };
  }
}

// Google Authentication
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if the user already exists
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    console.log("Doc Snap: ", docSnap);
    if (!docSnap.exists()) {
      // Create a users collection inside the db without sensitive information
      console.log("User info: ", user.email);
      const userDBObject = {
        fullName: user.displayName,
        email: user.email,
        timestamp: serverTimestamp(),
      };

      await setDoc(docRef, userDBObject);

      toast.success("You registered successfully with your Google account!");
    }

    return { success: true, user };
  } catch (error) {
    console.error(error.message);
    toast.error("Error signing in with Google");
    return { success: false, error };
  }
}
