import HomePageListings from "../components/HomePageListings";
import HomeSlider from "../components/HomeSlider";
import Spinner from "../components/Spinner";

import { useLatestListings } from "../hooks/useLatestListings";
import { useOfferListings } from "../hooks/useOfferListings";
import { useRentListings } from "../hooks/useRentListings";
import { useSaleListings } from "../hooks/useSaleListings";

function Home() {
  //IMPROVEMENT: add error handling messages from custom hooks
  const {latestListings, loading} = useLatestListings();
  const {offerListings, loading: offersLoading} = useOfferListings();
  const {rentListings, loading: rentsLoading} = useRentListings();
  const {saleListings, loading: salesLoading} = useSaleListings();

  const isLoading = loading || offersLoading || rentsLoading || salesLoading;

  
  if(isLoading) return <Spinner />

  return <div>
    {/* LATEST LISTINGS SLIDER*/}  
    <HomeSlider listings={latestListings} />

    {/* CONTAINER FOR LISTINGS */}  
    <div className="max-w-6xl mx-auto px-6">

      {/* OFFERS */}  
      <HomePageListings listings={offerListings} heading="Recent Offers" linkTo="/offers" />

      {/* RENTS */}  
      <HomePageListings listings={rentListings} heading="Places for rent" linkTo="/category/rent" />

      {/* SALES */}  
      <HomePageListings listings={saleListings} heading="Places for sale" linkTo="/category/sale" />
      
    </div>
  </div>;
}

export default Home;
