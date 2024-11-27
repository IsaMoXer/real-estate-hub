import Spinner from "./Spinner";
import Listings from "./Listings";
import {useRentListings} from "../hooks/useRentListings";

function Rents() {
  const {rentListings, loading} = useRentListings();

   if(loading) return <Spinner />

  return <Listings listings={rentListings} listingTitle="Places for Rent"/>;
}

export default Rents
