import { useEffect, useState } from "react";
import { fetchQueryListings } from "../services/apiDb";
import {LATEST_LISTINGS} from "../utils/constants";;

export function useLatestListings(){
  const [latestListings, setLatestListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let queryConditions = [];

  useEffect(()=>{
    async function loadLastestListings(){
      try {
        setLoading(true);
        //const listings  = await fetchLatestListings(5);
        const {listings} = await fetchQueryListings(queryConditions, LATEST_LISTINGS);
        setLatestListings(listings);
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