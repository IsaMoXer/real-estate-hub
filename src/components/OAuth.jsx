import { FcGoogle } from "react-icons/fc";

function OAuth() {
  return (
    <button className="bg-red-700 text-white uppercase flex justify-center items-center px-7 py-3 rounded shadow-md gap-3 hover:bg-red-800 transition duration-200 ease-in-out hover:shadow-lg active:bg-red-900 active:shadow-lg text-sm font-medium">
      <FcGoogle className="bg-white rounded-full text-2xl" />
      Continue with Google
    </button>
  );
}

export default OAuth;
