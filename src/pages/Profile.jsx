import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import InputWithError from "../components/InputWithError";
import ListingCard from "../components/ListingCard";
import Spinner from "../components/Spinner";

import { useAuth } from "../hooks/useAuth";
import { logOut, updateUserProfile } from "../services/apiAuth";
import { FcHome } from "react-icons/fc";
import { useUserListings } from "../hooks/useUserListings";
import { deleteListingById } from "../services/apiDb";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const {listings, loading, error, updateListings} = useUserListings(user.uid);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user.displayName,
    email: user.email,
  });

  const [errors, setErrors] = useState({
    fullName: "",
  });

  const { fullName, email } = formData;

  function validateFormEdit() {
    const newErrors = {};
    const trimmedFullName = fullName.trim();

    if (!trimmedFullName) {
      newErrors.fullName = "Full name is required";
    } else if (trimmedFullName === user.displayName.trim()) {
      newErrors.fullName = "You did NOT change the original data";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (isEditing) {
      // We're currently editing and want to save changes
      if (validateFormEdit()) {
        updateUserProfile(fullName);
        setIsEditing(false);
      } else {
        // When we don't want to edit anymore, after validating error (otherwise you are compelled to change your detail)
        setIsEditing(false);
      }
    } else {
      // We're not editing and want to start editing
      setIsEditing(true);
    }
  }

  function onChange(e) {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [e.target.id]: "",
    }));
  }

  function handleSignOut() {
    logOut();
    navigate("/");
  }

  function handleEdit(listingId){
    navigate(`/edit-listing/${listingId}`);
  }
  async function handleDelete(listingId) {
    if (window.confirm("Are you sure you want to delete the listing?")) {
      try {
        // Set a loading state if needed
        setIsDeleting(true);
  
        // Delete from Firebase
        const result = await deleteListingById(listingId);
  
        // After successful deletion, update the listings
        const updatedListings = listings.filter(listing => listing.id !== listingId);
        updateListings(updatedListings);
        
        toast.success(result.message || "Successfully deleted the listing");
      } catch (error) {
        console.error("Error in deleting the listing:", error);
        toast.error(error.message || "Failed to delete the listing. Please try again.");
      } finally {
        // Reset loading state if needed
        setIsDeleting(false);
      }
    }
  }

  return (
    <section>
      <h2 className="text-center font-bold text-2xl pt-4">My Profile</h2>
      {/* USER SETTINGS UPDATE CONTAINER */}
      <div className="w-full px-6 pt-12 max-w-[600px] mx-auto">
        <form className="flex flex-col gap-6">
          <InputWithError
            type="text"
            id="fullName"
            placeholder="Full name"
            value={fullName}
            onChange={onChange}
            error={errors.fullName}
            disabled={!isEditing}
            isEditing={isEditing}
          />
          <InputWithError
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
            disabled
          />

          <div className="flex justify-between items-center whitespace-nowrap text-sm sm:text-lg">
            <p>
              Do you want to change your name?
              <span
                onClick={handleSubmit}
                className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 cursor-pointer ml-1"
              >
                {isEditing ? "Save changes" : "Edit"}
              </span>
            </p>
            <p
              className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              onClick={handleSignOut}
            >
              Sign out
            </p>
          </div>
        </form>

        <Link
          to="/create-listing"
          className="flex justify-center items-center gap-2 w-full bg-blue-600 hover:bg-blue-700 px-7 py-3 my-6 rounded transition duration-150 ease-in-out font-medium shadow-md hover:shadow-lg active:shadow-xl active:translate-y-1 active:bg-blue-800"
        >
          <FcHome className="bg-red-200 rounded-full p-1 text-3xl border-2" />
          <span className="text-white uppercase font-medium text-sm">
            Sell or rent your home
          </span>
        </Link>
      </div>
      {/* LOADING SPINNER WHEN DELETING */}
      {isDeleting && <Spinner />}
      {/* MY LISTINGS CONTAINER */}
      {listings && listings.length > 0 ? (
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-center font-semibold text-2xl pt-4 mb-6">My Listings</h2>
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {listings.map(listing => <ListingCard key={listing.id} listing={listing.data} listingId={listing.id} onEdit={() => handleEdit(listing.id)} onDelete={() => handleDelete(listing.id)} />)}
        </ul>
      </div>
    ) : (
      /* MESSAGE FOR NO LISTINGS FOUND*/
      <p className="text-center font-semibold sm:text-xl p-4">No listings found!</p>
    )}
    </section>
  );
}

export default Profile;
