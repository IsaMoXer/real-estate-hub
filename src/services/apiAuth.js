import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "../firebase";
import { toast } from "react-toastify";

export async function signUp({ fullName, email, password }) {
  try {
    const auth = getAuth();
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
    console.log("User: ", user);

    // Create a users collection inside the db without sensitive information
    const userDBObject = { fullName, email, timestamp: serverTimestamp() };
    await setDoc(doc(db, "users", user.uid), userDBObject);
    toast.success("You registered successfully!");
  } catch (error) {
    console.log(error.message);
    toast.error("User could NOT be registered");
    //throw new Error("Something went wrong, no user registered");
  }
}
