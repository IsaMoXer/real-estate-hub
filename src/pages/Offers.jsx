import Listings from "../components/Listings";
import Spinner from "../components/Spinner";
import { useOfferListings } from "../hooks/useOfferListings";
import {MAX_LISTINGS} from "../utils/constants";

function Offers() {
  const { offerListings, loading, hasMore, loadMore } = useOfferListings(MAX_LISTINGS);
  
  if (loading && (!offerListings || offerListings.length === 0)) return <Spinner />;

  return <Listings 
    listings={offerListings} 
    listingTitle="Offers" 
    loading={loading}
    hasMore={hasMore}
    onLoadMore={loadMore}
  />;
}

export default Offers;