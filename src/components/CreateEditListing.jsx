import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { serverTimestamp } from "firebase/firestore";
import { useLocation, useNavigate, useParams } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { uploadImage } from "../services/apiStorage";
import { geocodeAddress, hasDataChanged, validateAddressFormat } from "../utils/helpers";
import { createNewListing, deleteImages, updateListing } from "../services/apiDb";
import { useListing } from "../hooks/useListing";

import InputWithError from "./InputWithError";
import ToggleButton from "./ToggleButton";
import Button from "./Button";
import Spinner from "./Spinner";

function CreateEditListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [formData, setFormData] = useState({
    listingType: "rent",
    listingTitle: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: [],
    latitude: 0,
    longitude: 0,
  });

  const { listingId } = useParams();
  const { pathname } = useLocation();

  const formType = {
    createListing: pathname === "/create-listing",
    editListing: pathname === `/edit-listing/${listingId}`, 
    //editListing: pathname.startsWith("/edit-listing/"),
  }

  const [errors, setErrors] = useState({
    discountedPrice: "",
    address: "",
    images: "",
  });

  const {
    listingType,
    listingTitle,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const { listing, loading: isListingLoading, error } = useListing(listingId);
 
  // Check if listing exists and belongs to the user
  useEffect(() => {
    if (!isListingLoading && formType.editListing) {
      if (!listing || listing.length === 0) {
        toast.error("Listing not found");
        navigate("/");
      } else if (listing.userRef !== user.uid) {
        toast.error("You don't have permission to edit this listing");
        navigate("/");
      }
    }
  }, [isListingLoading, listing, formType.editListing, user.uid, navigate])

  // If editing, fill the form with the listing to edit
  useEffect(() => {
    if (formType.editListing && !isListingLoading && listing) {
      // Populate form fields with listing data
      setFormData(prevState => ({
        ...prevState,
        listingType: listing.listingType || "rent",
        listingTitle: listing.listingTitle || "",
        bedrooms: listing.bedrooms || 1,
        bathrooms: listing.bathrooms || 1,
        parking: listing.parking || false,
        furnished: listing.furnished || false,
        address: listing.address || "",
        description: listing.description || "",
        offer: listing.offer || false,
        regularPrice: listing.regularPrice || 0,
        discountedPrice: listing.discountedPrice || 0,
        latitude: listing.geolocation?.lat || 0,
        longitude: listing.geolocation?.lon || 0,
      }));
    }
  }, [formType.editListing, isListingLoading, listing]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const addressValidation = validateAddressFormat(address);
    let geolocation = {};
    let imgUrls = [];
      
    try {
      //IMPROVEMENT: remove zeros from beginning in regular price and discounted price!
      //IMPROVEMENT: create a separate function to validate this form 
      // Form validation
      if (+discountedPrice > +regularPrice) {
        setErrors(prev => ({ ...prev, discountedPrice: "Discount cannot be greater than regular price" }));
        throw new Error("Validation failed");
      }
  
      if (images.length > 6) {
        setErrors(prev => ({ ...prev, images: "Max number of images is 6" }));
        throw new Error("Validation failed");
      }
      
      if (!addressValidation.isValid) {
        setErrors(prev => ({ ...prev, address: addressValidation.error }));
        setIsAddressEditing(true);
        throw new Error("Validation failed");
      }
  
      // Check if the address is correct
      if (isGeolocationEnabled) {
        const result = await geocodeAddress(address);
        if (!result) {
          setErrors(prev => ({ ...prev, address: "Address not found, please try again" }));
          setIsAddressEditing(true);
          throw new Error("Address validation failed");
        }
        geolocation.lat = result.latitude;
        geolocation.lon = result.longitude;
      }
  
      // Convert the images to urls & add the imgUrls to the new object
      imgUrls = await Promise.all(
        Array.from(images).map(uploadImage)
      );

      let newListing = {};

      //IMPROVEMENT: user can choose the cover image
      // When editing the listing, images are not required
      if(formType.editListing && imgUrls.length === 0){
        if(!hasDataChanged(listing, formData)){
          setIsLoading(false);
          toast.error("No changes detected. Listing was not updated.");
          return;
        }
        // do not add the imgUrls to the newListing
        newListing = {
          ...formData,
          geolocation,
          timestamp: serverTimestamp(),
          userRef: user.uid,
        };
      } else {
        newListing = {
          ...formData,
          imgUrls, 
          geolocation,
          timestamp: serverTimestamp(),
          userRef: user.uid,
        };
      }
     
      delete newListing.latitude;
      delete newListing.longitude;
      delete newListing.images;
      if (!formData.offer) {
        delete newListing.discountedPrice;
      }

      // The listing id will be different depending on if the form is for editing or creating
      let newListingId;
  
      // ********** EDIT FUCNTIONALITY ************
      if(formType.editListing){        
        await updateListing(listingId, newListing);
  
      }else if(formType.createListing){
        // ********** CREATE FUCNTIONALITY **********
        // Create the new listing
        const listingRef = await createNewListing(newListing);
        newListingId = listingRef.id;
        if(!listingRef){
          throw new Error("Failed to create new listing");
        }
      }
        setIsLoading(false);
        toast.success(`Listing ${formType.createListing ? "added" : "updated"} successfully!`);
        navigate(`/category/${listingType}/${formType.createListing ? newListingId : listingId}`);

    } catch (error) {
      // If there's an error and we have uploaded new images, delete them
      if (imgUrls.length > 0) {
        await deleteImages(imgUrls);
      }
      setIsLoading(false);
      if (error.message === "Validation failed") {
        toast.error("Please check the form for errors.");
      } else if (error.message === "Address validation failed") {
        toast.error("Address validation failed. Please check your address.");
      } else if (error.message === "Failed to create new listing") {
        toast.error("Failed to create new listing. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }

  function handleClick(e) {
    const { id, value } = e.target;
    setFormData(prevState => {
      if (id === "listingType") {
        // Only update if the clicked button is different from the current state
        return value !== prevState[id]
          ? { ...prevState, [id]: value }
          : prevState;
      } else {
        // For boolean values, only update if the clicked button represents a different state
        const newValue = value === "true"; // Convert string to boolean
        return newValue !== prevState[id]
          ? { ...prevState, [id]: newValue }
          : prevState;
      }
    });
  }

  function onChange(e) {
    if (e.target.files) {
      setFormData(prevState => ({
        ...prevState,
        images: e.target.files,
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
    // Reset errors when changing the input field
    setErrors(prevErrors => ({
      ...prevErrors,
      [e.target.id]: "",
    }));
  }

  if (isLoading || (formType.editListing && isListingLoading)) return <Spinner />;
  return (
    <section>
      <h2 className="text-center font-bold text-2xl pt-4 mb-6">
        {formType.createListing ? "Create a Listing" : "Edit a Listing"}
      </h2>
      <div>
        <form
          onSubmit={handleSubmit}
          className="w-full px-6 max-w-[600px] mx-auto flex flex-col gap-8 mb-10"
        >
          {/* LISTING TYPE */}
          <div>
            <p className="text-lg font-semibold mb-2">Sell/Rent</p>
            <div className="flex items-center justify-center gap-6">
              <ToggleButton
                id="listingType"
                value="sale"
                active={listingType}
                onClick={handleClick}
                onChange={onChange}
              >
                Sell
              </ToggleButton>
              <ToggleButton
                id="listingType"
                value="rent"
                active={listingType}
                onClick={handleClick}
                onChange={onChange}
              >
                Rent
              </ToggleButton>
            </div>
          </div>
          {/* LISTING TITLE */}
          <div>
            <p className="text-lg font-semibold mb-2">Listing Title</p>
            <InputWithError
              placeholder="This will appear as your listing title"
              value={listingTitle}
              onChange={onChange}
              type="text"
              id="listingTitle"
              required
              maxLength="52"
              minLength="10"
            />
          </div>
          {/* BEDS and BATHS*/}
          <div className="flex justify-between items-center gap-6">
            <div className="">
              <p className="text-lg font-semibold mb-2">Beds</p>
              <InputWithError
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onChange}
                min="1"
              />
            </div>
            <div className="">
              <p className="text-lg font-semibold mb-2">Baths</p>
              <InputWithError
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onChange}
                min="1"
              />
            </div>
          </div>
          {/* PARKING */}
          <div>
            <p className="text-lg font-semibold mb-2">Parking Spot</p>
            <div className="flex items-center justify-center gap-6">
              <ToggleButton
                id="parking"
                value={true}
                active={parking}
                onClick={handleClick}
              >
                Yes
              </ToggleButton>
              <ToggleButton
                id="parking"
                value={false}
                active={parking}
                onClick={handleClick}
              >
                No
              </ToggleButton>
            </div>
          </div>

          {/* FURNISHED */}
          <div>
            <p className="text-lg font-semibold mb-2">Furnished</p>
            <div className="flex items-center justify-center gap-6">
              <ToggleButton
                id="furnished"
                value={true}
                active={furnished}
                onClick={handleClick}
              >
                Yes
              </ToggleButton>
              <ToggleButton
                id="furnished"
                value={false}
                active={furnished}
                onClick={handleClick}
              >
                No
              </ToggleButton>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="">
            <p className="text-lg font-semibold mb-2">Address</p>
            <InputWithError
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out "
              type="text"
              id="address"
              error={errors.address}
              value={address}
              onChange={onChange}
              isEditing={isAddressEditing}
              placeholder="Number Street, City, Country"
              required
            />
          </div>

          {/* LATITUDE AND LONGITUDE WHEN GEOLOCATION NOT ENABLED */}
          {!isGeolocationEnabled && (
            <div className="flex justify-between items-center gap-6">
              <div className="w-full">
                <p className="text-lg font-semibold mb-2">Latitude</p>
                <InputWithError
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onChange}
                  min="-90"
                  max="90"
                  required
                />
              </div>
              <div className="w-full">
                <p className="text-lg font-semibold mb-2">Longitude</p>
                <InputWithError
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onChange}
                  min="-180"
                  max="180"
                  required
                />
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="">
            <p className="text-lg font-semibold mb-2">Description</p>
            <textarea
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out "
              type="text"
              id="description"
              value={description}
              onChange={onChange}
              placeholder="Description"
              required
            />
          </div>

          {/* OFFER */}
          <div>
            <p className="text-lg font-semibold mb-2">Offer</p>
            <div className="flex items-center justify-center gap-6">
              <ToggleButton
                id="offer"
                value={true}
                active={offer}
                onClick={handleClick}
              >
                Yes
              </ToggleButton>
              <ToggleButton
                id="offer"
                value={false}
                active={offer}
                onClick={handleClick}
              >
                No
              </ToggleButton>
            </div>
          </div>

          {/* REGULAR PRICE*/}
          <div className="flex justify-center items-end gap-4">
            <div className="w-full">
              <p className="text-lg font-semibold mb-2">Regular Price</p>
              <InputWithError
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                required
                min="1"
              />
            </div>
            <div className="w-full">
              <p className="text-md whitespace-nowrap text-slate-600">
                {listingType === "rent" ? "$ / month" : ""}
              </p>
            </div>
          </div>
          {/* DISCOUNTED PRICE, ONLY WHEN OFFER SET TO TRUE*/}
          {offer && (
            <div className="flex justify-center items-end gap-4">
              <div className="w-full">
                <p className="text-lg font-semibold mb-2">Discounted Price</p>
                <InputWithError
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  error={errors.discountedPrice}
                  onChange={onChange}
                  required={offer}
                  min="1"
                />
              </div>
              <div className="w-full">
                <p className="text-md whitespace-nowrap text-slate-600">
                  {listingType === "rent" ? "$ / month" : ""}
                </p>
              </div>
            </div>
          )}
          {/* IMAGES, not required when editing*/}
          <div className="">
            <p className="text-lg font-semibold">Images</p>
            <p className="text-slate-600 mb-2">
              The first image will be the cover (max 6)
            </p>
            <InputWithError
              onChange={onChange}
              type="file"
              id="images"
              required={formType.createListing}
              accept=".jpg,.jpeg,.png"
              multiple
              error={errors.images}
            />
          </div>
          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
           /*  className="w-full px-7 py-3 font-medium rounded text-white uppercase bg-blue-600 shadow-md hover:shadow-lg hover:bg-blue-700 active:shadow-xl active:bg-blue-800 transition duration-150 ease-in-out active:translate-y-1" */
          >
            {isLoading ? "Loading..."
                : formType.createListing
                ? "Create Listing"
                : formType.editListing
                ? "Edit Listing"
                : "Error"}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default CreateEditListing;
