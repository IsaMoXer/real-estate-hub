import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import OAuth from "../components/OAuth";

function SignForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { fullName, email, password } = formData;

  const location = useLocation();
  const isSignUp = location.pathname === "/sign-up";
  const isSignIn = location.pathname === "/sign-in";
  const isForgotPassword = location.pathname === "/forgot-password";

  function onChange(e) {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  return (
    <section className="">
      <h2 className="text-center font-bold text-2xl pt-4">
        {isSignUp ? "Sign Up" : isSignIn ? "Sign In" : "Forgot Password"}
      </h2>
      <div className="mx-auto flex flex-col px-6 py-12 max-w-6xl gap-16 justify-center items-center lg:flex-row">
        <div className="h-full md:w-[67%] lg:w-[55%]">
          <img
            className="w-full rounded-2xl"
            src="Keys-Sign-in.jpg"
            alt="keys on top of a hand, author: maria-ziegler, source: Unsplash"
          />
        </div>

        {/* FORM */}
        <div className="w-full md:w-[67%] lg:w-[45%]">
          <form className="flex flex-col gap-6">
            {isSignUp && (
              <input
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                type="text"
                id="fullName"
                placeholder="Full name"
                value={fullName}
                onChange={onChange}
              />
            )}

            <input
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              type="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={onChange}
            />

            {(isSignIn || isSignUp) && (
              <div className="relative">
                <input
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="password"
                  value={password}
                  onChange={onChange}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer text-gray-700"
                  onClick={() => setShowPassword(s => !s)}
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm text-nowrap sm:text-base lg:text-lg">
              {isSignUp ? (
                <p>
                  Have an account?
                  <Link
                    to="/sign-in"
                    className="text-red-600 hover:text-red-700 ml-1"
                  >
                    Sign in
                  </Link>
                </p>
              ) : (
                <p>
                  Don't have an account?
                  <Link
                    to="/sign-up"
                    className="text-red-600 hover:text-red-700 ml-1"
                  >
                    Register
                  </Link>
                </p>
              )}
              <Link
                to={isForgotPassword ? "/sign-in" : "/forgot-password"}
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                {isForgotPassword ? "Sign in instead" : "Forgot password?"}
              </Link>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white uppercase font-medium px-7 py-3 rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800"
            >
              {isSignUp ? "Sign up" : isSignIn ? "Sign in" : "Send reset email"}
            </button>
            <div className="flex items-center before:border-t before:w-full before:border-gray-300 after:border-t after:w-full after:border-gray-300">
              <p className="font-semibold mx-4">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignForm;
