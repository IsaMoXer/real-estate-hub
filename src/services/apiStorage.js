import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import {v4 as uuidv4} from "uuid";

import {storage, auth, db} from "../firebase";

const userId = auth.currentUser?.uid;

export async function uploadImage(image) {
  return new Promise((resolve, reject) => {
    const fileName = `${userId}-${image.name}-${uuidv4()}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // You can use this to show upload progress if desired
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed:", error);
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
}

