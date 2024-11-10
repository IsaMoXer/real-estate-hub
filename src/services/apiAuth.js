import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import { toast } from "react-toastify";

const auth = getAuth();

// Register or Sign Up with Email and Password
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

    if (!docSnap.exists()) {
      // Create a users collection inside the db without sensitive information
      //console.log("User info: ", user.email);
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

// Sign in with Email and Password
export async function signIn(email, password) {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredentials?.user;
    return { success: true, user };
  } catch (error) {
    console.log(error.message);
    toast.error("Invalid credentials, please try again");
    return { success: false, error };
  }
}

// Forgot password with email to reset it
export async function resetPassword(email) {
  try {
    // Check if the user exists in the database (NOTE: no "validate email/true email" functionality so far, only the format)
    const isUserRegistered = await checkUserExistsByEmail(email);

    if (!isUserRegistered) {
      // No user exists with this email
      toast.error("No account found with this email address");
      return { success: false };
    }

    // User exists, so send the password reset email
    await sendPasswordResetEmail(auth, email);
    toast.success("Reset password email was sent");
    return { success: true };
  } catch (error) {
    console.error("Error in reset password process:", error);
    toast.error("Error: reset password email was not sent");
    return { success: false, error };
  }
}

// Helper function to check if a user exists using email before sending reset password email
async function checkUserExistsByEmail(email) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return true;
    } else {
      //console.log("User does not exist.");
      return false;
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    // You might want to throw the error again if you want to handle it in the calling function
    // throw error;
    return false; // or you could return null to indicate an error occurred
  }
}

// Sign out
export const logOut = async () => {
  try {
    await auth.signOut();
    // Handle successful sign out
    toast.success("Logged out successfully!");
    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error("Sign out error:", error);
    toast.error("Error: user could not be logged out");
    return { success: false };
  }
};

// Detects auth changes, used in the AuthContext
export const subscribeToAuthChanges = callback => {
  return onAuthStateChanged(auth, user => {
    callback(user);
  });
};

// Update user profile (both auth obj and users collection)
export const updateUserProfile = async fullName => {
  try {
    // Update auth object in firebase/auth
    await updateProfile(auth.currentUser, {
      displayName: fullName,
    });

    // Update the users collection in firestore
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, {
      fullName,
    });

    // Handle successful update only after both operations are complete
    toast.success("Profile details updated");
    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error("Profile update error:", error);
    toast.error("Error: user could not update the profile details");
    return { success: false, error };
  }
};
