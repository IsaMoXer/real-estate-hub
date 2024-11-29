import Spinner from "./Spinner";
import Listings from "./Listings";
import { useSaleListings} from "../hooks/useSaleListings";
import {MAX_LISTINGS} from "../utils/constants";

function Sales() {
  const {saleListings, loading, hasMore, loadMore } = useSaleListings(MAX_LISTINGS);


  if (loading && (!saleListings || saleListings.length === 0)) return <Spinner />;

  return <Listings 
  listings={saleListings} 
  listingTitle="Places for sale" 
  loading={loading}
  hasMore={hasMore}
  onLoadMore={loadMore}
/>;
}

export default Sales
