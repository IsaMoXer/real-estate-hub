import Spinner from "./Spinner";
import Listings from "./Listings";
import { useSaleListings} from "../hooks/useSaleListings";

function Sales() {
  const {saleListings, loading} = useSaleListings();

  if(loading) return <Spinner />

  return (
    <Listings listings={saleListings} listingTitle="Places for sale" />
  )
}

export default Sales
