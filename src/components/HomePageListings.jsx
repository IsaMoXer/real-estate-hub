import { Link } from "react-router-dom";

import ListingCard from "./ListingCard";

function HomePageListings({listings, heading, linkTo}) {
  if(!listings || listings.length === 0) return <p>Loading...</p>
  return (
    <div className="flex flex-col gap-2 mt-10">
      <h2 className="text-2xl font-semibold">{heading}</h2>
      <Link className="w-fit text-blue-600 transform hover:text-blue-800 hover:scale-110 hover:font-semibold transition duration-150 ease-in-out" to={linkTo}>Show more {heading.toLowerCase()}</Link>
      <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
        {listings && listings.map((listing)=>(
          <ListingCard key={listing.id} listing={listing.data} listingId={listing.id}/>
        ))}
      </ul>
    </div>
  )
}

export default HomePageListings;
