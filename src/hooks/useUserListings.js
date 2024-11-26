import { useEffect, useState } from "react";
import { fetchUserListings } from "../services/apiDb";

export function useUserListings(userId) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        const fetchedListings = await fetchUserListings(userId);
        setListings(fetchedListings);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadListings();
    }
  }, [userId]);

  const updateListings = (updatedListings) => {
    setListings(updatedListings);
  };


  return { listings, loading, error, updateListings };
}