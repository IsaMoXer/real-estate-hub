import { useEffect, useState } from "react";
import { fetchQueryListings } from "../services/apiDb";

export function useLatestListings(){
  const [latestListings, setLatestListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let queryConditions = [];

  useEffect(()=>{
    async function loadLastestListings(){
      try {
        setLoading(true);
        const fetchedListings = await fetchQueryListings(queryConditions, 5);
        setLatestListings(fetchedListings);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadLastestListings();
  },[]);

  return { latestListings, loading, error };
}