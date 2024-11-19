import { useState } from "react";
import { toast } from "react-toastify";
import { serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { uploadImage } from "../services/apiStorage";
import { geocodeAddress, validateAddressFormat } from "../utils/helpers";

import InputWithError from "../components/InputWithError";
import ToggleButton from "../components/ToggleButton";
import Spinner from "../components/Spinner";
import { createNewListing } from "../services/apiDb";

function CreateListing() {
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


      async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        const addressValidation = validateAddressFormat(address);
         
        try {
          // Form validation
          if (discountedPrice > regularPrice) {
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
            setFormData(prevState => ({
              ...prevState, 
              latitude: result.latitude,
              longitude: result.longitude,
            }));
          }
      
          // Convert the images to urls & add the imgUrls to the new object
          const imgUrls = await Promise.all(
            Array.from(images).map(uploadImage)
          );
      
          // Prepare the new listing data
          const newListing = {
            ...formData,
            imgUrls, 
            timestamp: serverTimestamp(),
            userRef: user.uid,
          };
      
          delete newListing.images;
          if (!formData.offer) {
            delete newListing.discountedPrice;
          }
      
          // Create the new listing
          const listingRef = await createNewListing(newListing);
          if(!listingRef){
            throw new Error("Failed to create new listing");
          }
      
          const listingId = listingRef.id;
          setIsLoading(false);
          toast.success("Listing added successfully!");
          navigate(`/category/${listingType}/${listingId}`);
      
        } catch (error) {
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

  if (isLoading) return <Spinner />;
  return (
    <section>
      <h2 className="text-center font-bold text-2xl pt-4 mb-6">
        Create a Listing
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
          {/* FULL NAME */}
          <div>
            <p className="text-lg font-semibold mb-2">Listing Title</p>
            <InputWithError
              placeholder="This will appear as your listing title"
              value={listingTitle}
              onChange={onChange}
              type="text"
              id="listingTitle"
              required
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
          {/* IMAGES*/}
          <div className="">
            <p className="text-lg font-semibold">Images</p>
            <p className="text-slate-600 mb-2">
              The first image will be the cover (max 6)
            </p>
            <InputWithError
              onChange={onChange}
              type="file"
              id="images"
              required
              accept=".jpg,.jpeg,.png"
              multiple
              error={errors.images}
            />
          </div>
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full px-7 py-3 font-medium rounded text-white uppercase bg-blue-600 shadow-md hover:shadow-lg hover:bg-blue-700 active:shadow-xl active:bg-blue-800 transition duration-150 ease-in-out active:translate-y-1"
          >
            Create Listing
          </button>
        </form>
      </div>
    </section>
  );
}

export default CreateListing;
