import { useEffect, useState } from "react";
import { fetchListingById } from "../services/apiDb";

export function useListing(listingId) {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


useEffect(()=>{
    // Get the Listing based on the ID from URL
    async function loadListing(){
      try{
        setLoading(true);
        const fetchedListing = await fetchListingById(listingId);
        setListing(fetchedListing);
        setError(null);
      }catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (listingId) {
      loadListing();
    }
  
},[listingId]);

return { listing, loading, error };
}