import ListingCard from "./ListingCard";
import Button from "./Button";
import SpinnerMini from "./SpinnerMini";

function Listings({ listings, listingTitle, loading, hasMore, onLoadMore }) {
  return (
    <div>
      {/* MY LISTINGS CONTAINER */}
      {listings && listings.length > 0 ? (
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-center font-semibold text-2xl pt-4 mb-6">{listingTitle}</h2>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* LISTING CARD ARRAY */}
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing.data} listingId={listing.id} />
            ))}
          </ul>
          {hasMore && (
            <div className="mt-6 flex justify-center items-center">
              <Button onClick={onLoadMore} disabled={loading}>
                {loading ? <SpinnerMini /> : "Load more"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* MESSAGE FOR NO LISTINGS FOUND*/
        <p className="text-center font-semibold sm:text-xl p-4">No listings found!</p>
      )}
    </div>
  );
}

export default Listings;


