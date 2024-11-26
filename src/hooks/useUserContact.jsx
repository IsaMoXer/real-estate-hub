import { useEffect, useState } from "react";
import { fetchUserById } from "../services/apiDb";

export function useUserContact(userRef){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    async function loadUser() {
      try {
        setLoading(true);
        const fetchedUser = await fetchUserById(userRef);
      setUser(fetchedUser);
      setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    if(userRef) {
      loadUser();
    }
  },[userRef]);

  return {user, loading, error};
}