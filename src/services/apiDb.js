import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";

import { db, storage } from "../firebase";
import { deleteObject, ref } from "firebase/storage";

export async function createNewListing(listingData) {
  try {
    const newListingRef = await addDoc(collection(db, "listings"), listingData);
    return newListingRef;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw new Error("Failed to create listing: " + error.message);
  }
}

export async function fetchUserListings(userId) {
  try {
    const listingsRef = collection(db, "listings");
    const q = query(
      listingsRef, 
      where("userRef", "==", userId),
      orderBy("timestamp", "desc")
    );
    
    const querySnap = await getDocs(q);
    
    const listings = querySnap.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    return listings;

  } catch (error) {
    console.error("Error fetching listings:", error);
    throw new Error("Failed to fetch listings: " + error.message);
  }
}

  export async function deleteListingById(listingID) {
    try {
      // Fetch the listing to get the image URLs
      const listing = await fetchListingById(listingID);
      
      if (!listing) {
        throw new Error("Listing not found");
      }
  
      // Delete images from Storage if they exist
      if (listing.imgUrls && listing.imgUrls.length > 0) {
        await deleteImages(listing.imgUrls);
        } 
     
  
      // Delete the listing document from Firestore
      await deleteDoc(doc(db, "listings", listingID));
  
      return { success: true, message: "Listing successfully deleted" };
    } catch (error) {
      console.error("Error deleting listing:", error);
      throw new Error("Failed to delete listing: " + error.message);
    }
  }

export async function deleteImages(imgUrls) {
  for (const url of imgUrls) {
    const storageRef = ref(storage, url);
    try {
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }
}

export async function updateListing(listingID, newListing){
  try {
    const listingRef = doc(db, "listings", listingID);
    const editedListing = await updateDoc(listingRef, newListing)
    return editedListing;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw new Error("Failed to update listing: " + error.message);
  }
}

export async function fetchListingById(listingID) {
  try {
    const docRef = doc(db, "listings", listingID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // You can choose to throw an error or return null/undefined
      // Throwing an error:
      throw new Error("Listing not found");
      // Or returning null:
      // return null;
    }
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw new Error("Failed to fetch listing: " + error.message);
  }
}

export async function fetchUserById(userId) {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // You can choose to throw an error or return null/undefined
      // Throwing an error:
      throw new Error("User not found");
      // Or returning null:
      // return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user: " + error.message);
  }
}

