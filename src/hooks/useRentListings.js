import { useEffect, useState, useCallback } from "react";
import { where, startAfter } from 'firebase/firestore';

import { fetchQueryListings } from "../services/apiDb";

export function useRentListings(limit) {
  const [rentListings, setRentListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadListings = useCallback(async (isLoadingMore = false) => {
    try {
      setLoading(true);
      let queryConditions = [
        where("listingType", "==", "rent")
      ];
      
      if (isLoadingMore && lastFetchedListing) {
        queryConditions.push(startAfter(lastFetchedListing));
      }

      const { listings, lastVisible } = await fetchQueryListings(queryConditions, limit);
      
      setRentListings(prev => isLoadingMore ? [...prev, ...listings] : listings);
      setLastFetchedListing(lastVisible);
      setHasMore(listings.length === limit);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit, lastFetchedListing]);

  useEffect(() => {
    loadListings();
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      loadListings(true);
    }
  };

  return { rentListings, loading, error, hasMore, loadMore };
}