import Spinner from "./Spinner";
import Listings from "./Listings";
import {useRentListings} from "../hooks/useRentListings";
import {MAX_LISTINGS} from "../utils/constants";

function Rents() {
  const { rentListings, loading, hasMore, loadMore } = useRentListings(MAX_LISTINGS);

  if (loading && (!rentListings || rentListings.length === 0)) return <Spinner />;

  return <Listings 
  listings={rentListings} 
  listingTitle="Places for rent" 
  loading={loading}
  hasMore={hasMore}
  onLoadMore={loadMore}
/>;
}

export default Rents
