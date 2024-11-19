export function validateEmailFormat(email) {
  // This regex pattern checks for a basic email format:
  // - One or more characters before the @ symbol
  // - Followed by @ symbol
  // - Followed by one or more characters
  // - Followed by a dot
  // - Followed by 2 to 4 characters for the top-level domain
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/;
  return emailRegex.test(email);
}

export function validatePasswordFormat(password) {
  // This function checks if the password meets the following criteria:
  // - At least 8 characters long
  // - Contains at least one uppercase letter
  // - Contains at least one lowercase letter
  // - Contains at least one number
  // - Contains at least one special character

  if (password.length < 8) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);

  return hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
}

export function validateAddressFormat(address) {
  // Check if the address has at least 10 characters
  if (address.length < 10) {
    return { isValid: false, error: "Address must be at least 10 characters long" };
  }

  // Count the number of commas in the address
  const commaCount = (address.match(/,/g) || []).length;

  // Check if there are at least two commas
  if (commaCount < 2) {
    return { isValid: false, error: "Address must contain at least two commas to separate different fields" };
  }

  // Split the address by commas and trim each part
  const addressParts = address.split(',').map(part => part.trim());

  // Check if each part has at least some content
  const invalidParts = addressParts.filter(part => part.length === 0);
  if (invalidParts.length > 0) {
    return { isValid: false, error: "Each part of the address separated by commas must contain some content" };
  }

  // If all checks pass, the address is valid
  return { isValid: true, error: null };
}


export const geocodeAddress = async (address) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'react-realtor-clone/1.0' // Attribution with your app name and version
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      throw new Error('No results found for the given address');
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

/* export async function getAddress(address){
  try {
    const url = `https://api.positionstack.com/v1/forward?access_key=${process.env.REACT_APP_REALTOR_CLONE_GEOCODING_API_KEY}&query=${address}`;
    const response = await fetch(url);
    const data = await response.json();
 
    console.log('Data from address: ',data.data);
    // Check if the address is found
    if(data.data.length !== 0){
      setFormData(prevState => ({
        ...prevState, 
        latitude: data.data[0].latitude,
        longitude: data.data[0].longitude,
      }))
    }else {
      toast.error("Please, enter a valid address");
      return;
    }
   
    
    const newListing = {
      ...formData,
      //imgUrls, 
      timestamp: serverTimestamp(),
      userRef: user.uid,
    }
    !formData.offer && delete newListing.discountedPrice;
   
    //const result  = await createNewListing(newListing);
  } catch (error) {
    console.error("Error during form submission:", error);
  } finally {
    setIsLoading(false);
  }

} */