import { useEffect, useState } from "react";
import { where } from 'firebase/firestore';

import { fetchQueryListings } from "../services/apiDb";

export function useRentListings(){
  const [rentListings, setRentListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let queryConditions = [
    where("listingType", "==", "rent")
  ];

  useEffect(()=>{
    async function loadRentListings(){
      try {
        setLoading(true);
        const fetchedListings = await fetchQueryListings(queryConditions);
        setRentListings(fetchedListings);
        setError(null);
      } catch (err) {
        setError(err.message);

      } finally {
        setLoading(false);

      }
    }
    loadRentListings();
  },[]);

  return {rentListings, loading, error}
  
}