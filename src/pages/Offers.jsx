import Listings from "../components/Listings";
import Spinner from "../components/Spinner";
import {useOfferListings} from "../hooks/useOfferListings";

function Offers() {
  const {offerListings, loading} = useOfferListings();
  
  if(loading) return <Spinner />

  return <Listings listings={offerListings} listingTitle="Offers"/>;
}

export default Offers;
