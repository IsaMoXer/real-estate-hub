import { useState } from "react";
import { useParams } from "react-router"
import { FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import { formatPrice } from "../utils/helpers";
import { useListing } from "../hooks/useListing";
import { useAuth } from "../hooks/useAuth";
import { useUserContact } from "../hooks/useUserContact";

import Spinner from "../components/Spinner";
import Slider from "../components/Slider";
import Button from "../components/Button";
import ListingIcons from "../components/ListingIcons";
import Contact from "../components/Contact";
import Map from "../components/Map";

function Listing() {
  const[contactLandlord, setContactLandlord] = useState(false);
  const {user} = useAuth();
  const {listingId} = useParams();
  const {listing, loading} = useListing(listingId);
  const {user: contact, loading: loadingContact, error} = useUserContact(listing.userRef);

  // Use optional chaining to safely access properties
  const position = listing?.geolocation ? [listing.geolocation.lat, listing.geolocation.lon] : undefined;

  function handleMessageToLandlord() {
    if(error){
      setContactLandlord(false);
      toast.error("There was an error fetching the landord data, please try again!");
    }
    setContactLandlord(true)
  };
  // Place a guard for loading time
  const displayPrice = listing.offer ? listing.discountedPrice : listing.regularPrice || 0;

  if(loading) return <Spinner />

  return (
    <div>
      <Slider listing={listing} />
      {/* LISTING CONTAINER */}
      <div className="flex flex-col md:flex-row max-w-6xl lg:mx-auto bg-white shadow-lg p-6 rounded-lg m-4 gap-5">
        {/* LISTING INFO BOX */}
        <div className="w-full">
          <p className="text-lg sm:text-2xl font-bold mb-3 text-blue-900">{listing.listingTitle} - $ {formatPrice(displayPrice)} {listing.listingType === "rent" ? " / month" : ""}</p>
          <div className="flex justify-start items-center gap-2 mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-600"/>
          <p>
            {listing.address}
            </p>
          </div>
          {/* RENT/SALE AND OFFER CONTAINER */}
          <div className="flex justify-start items-center gap-4 w-[75%]">
              <p className="bg-red-500 w-full max-w-[200px] rounded-md p-1 text-white font-semibold text-center shadow-md">{listing.listingType === "rent" ? "Rent" : "Sale"}</p>
              {listing.offer && <p className="bg-green-700 w-full max-w-[200px] rounded-md p-1 text-white font-semibold text-center shadow-md">${listing.regularPrice - listing.discountedPrice} discount</p>}
          </div>
          {/* DESCRIPTION */}
          <p className="mt-3 mb-3">
            <span className="font-semibold">Discount - </span>{listing.description}
          </p>
          {/* LIST OF ICONS CONTAINER */}
          <div className="mt-6 mb-3">
            <ListingIcons listing={listing}/>
          </div>
          {/* BUTTON AND MESSAGE CONTAINER */}
          {listing.userRef !== user?.uid && !contactLandlord && (<div className="mt-8">
          <Button onClick={handleMessageToLandlord}>Contact Landlord</Button>
          </div>)}
          {/* LANDLORD MESSAGE */}
          {!loadingContact && contactLandlord && (<Contact listing={listing} contact={contact} onSetContactLandlord={setContactLandlord}/>)}
          
        </div>
        <div className="w-full h-[240px] md:h-auto flex-grow z-10 overflow-x-hidden">
          {!loading && position && (
            <Map position={position} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Listing