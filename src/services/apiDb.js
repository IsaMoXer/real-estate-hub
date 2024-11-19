import { addDoc, collection } from "firebase/firestore";

import { db } from "../firebase";

export async function createNewListing(listingData) {
  try {
    const newListingRef = await addDoc(collection(db, "listings"), listingData);
    return newListingRef;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw new Error("Failed to create listing: " + error.message);
  }
}