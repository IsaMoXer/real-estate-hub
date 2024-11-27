import { useEffect, useState } from "react";
import { where } from 'firebase/firestore';


import { fetchQueryListings } from "../services/apiDb";

export function useSaleListings(){
  const [saleListings, setSaleListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**const complexQuery = await fetchQueryListings([
  where("listingType", "==", "sale"),
  where("bedrooms", ">=", 3),
  where("price", "<", 500000)
], 10); // Also specifying a custom limit */

  const queryConditions = [
    where("listingType", "==", "sale")
  ];

  useEffect(()=>{
    async function loadSaleListings(){
      try {
        setLoading(true);
        const fetchedListings = await fetchQueryListings(queryConditions);
        setSaleListings(fetchedListings);
        setError(null);
      } catch (err) {
        setError(err.message);

      } finally {
        setLoading(false);

      }
    }
    loadSaleListings();
  },[]);

  return {saleListings, loading, error}
  
}