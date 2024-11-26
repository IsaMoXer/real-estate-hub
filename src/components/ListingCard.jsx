import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import Moment from "react-moment";

import { formatPrice } from "../utils/helpers";
import { HiPencil, HiTrash } from "react-icons/hi";

function ListingCard({listingId, listing, onEdit, onDelete}) {
  // CONSOLE!
  //console.log('Listing: ', listing);  
  const displayPrice = listing.offer ? listing.discountedPrice : listing.regularPrice;

  return (
    <li className="w-full relative bg-white mb-8 sm:mb-0 flex flex-col shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150">
       <Moment className="absolute top-2 left-2 bg-blue-600 text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
          fromNow>{listing.timestamp?.toDate()}</Moment>
      <Link className="contents" to={`/category/${listing.listingType}/${listingId}`}>
      {/* IMAGE CONTAINER */}
        <div className="">
          <img className="aspect-[4/3] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"src={listing.imgUrls[0]} alt="house exterior"loading="lazy"/>
        </div>
       
      {/* TEXT CONTAINER */}
        <div className="w-full p-4">
          {/* address */}
          <div className="flex justify-start items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-600"/>
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">{listing.address}</p>
          </div>
          {/* Title */}
          <p className="font-semibold text-xl truncate">{listing.listingTitle}</p>
          {/* Price */}
          <p className="text-slate-500 mt-2 font-semibold">
            ${formatPrice(displayPrice)}
            {listing.listingType === "rent" && " / month"}
          </p>
          {/* BED BATH CONTAINER */}
         {/*  <div className="flex justify-between items-center mt-3"> */}
            <div className="flex justify-start items-center gap-2 font-bold text-xs mt-4">
              <p>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}</p>
              <p>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}</p>
            </div>
            
          {/* </div> */}
        </div>
      </Link>
      {/* EDIT AND DELETE CONTAINER */}
      <div className="absolute bottom-3 right-3 flex justify-end items-center gap-3 text-lg">
        <HiPencil onClick={onEdit} className="cursor-pointer hover:scale-125 text-gray-500 hover:text-gray-900 transition-all duration-200 ease-in-out"/>
        <HiTrash onClick={onDelete} className="text-red-400 cursor-pointer hover:scale-125 hover:text-red-600 transition-all duration-200 ease-in-out"/>
      </div>
    </li>
  )
}

export default ListingCard;