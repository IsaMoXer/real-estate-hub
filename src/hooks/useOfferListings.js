import { useEffect, useState } from "react";
import { fetchQueryListings } from "../services/apiDb";
import { where } from 'firebase/firestore';

export function useOfferListings(){
  const [offerListings, setOfferListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let queryConditions = [
    where("offer", "==", true)
  ];

  useEffect(()=>{
    async function loadOfferListings(){
      try {
        setLoading(true);
        const fetchedListings = await fetchQueryListings(queryConditions);
        setOfferListings(fetchedListings);
        setError(null);
      } catch (err) {
        setError(err.message);

      } finally {
        setLoading(false);

      }
    }
    loadOfferListings();
  },[]);

  return {offerListings, loading, error}
  
}