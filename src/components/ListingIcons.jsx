import { FaBath, FaBed, FaChair, FaParking } from "react-icons/fa"

function ListingIcons({listing}) {
  return (
    <ul className="flex items-center gap-4 lg:gap-8 text-xs sm:text-sm">
        {/* BEDS  */}
      <li className="flex items-center gap-2 whitespace-nowrap">
        <FaBed />
        {listing.bedrooms > 1 ? `${listing.bedrooms
      } Beds` : "1 Bed"}
      </li>
      {/* BATHS */}
      <li className="flex items-center gap-2 whitespace-nowrap">
        <FaBath />
        {listing.bathrooms > 1 ? `${listing.bathrooms
      } Baths` : "1 Bath"}
      </li>
      {/* PARKING */}
      <li className="flex items-center gap-2 whitespace-nowrap">
        <FaParking />
        {listing.parking ? "Parking spot" : "No Parking"}
      </li>
      {/* FURNISHED */}
      <li className="flex items-center gap-2 whitespace-nowrap">
        <FaChair />
        {listing.furnished ? "Furnished" : "Not Furnished"}
      </li>
    </ul>
  )
}

export default ListingIcons
