import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";

import OAuth from "../components/OAuth";
import InputWithError from "./InputWithError";

import { resetPassword, signIn, signUp } from "../services/apiAuth";
import { validateEmailFormat, validatePasswordFormat } from "../utils/helpers";

function SignForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { fullName, email, password } = formData;

  const location = useLocation();
  const navigate = useNavigate();

  const formType = {
    signUp: location.pathname === "/sign-up",
    signIn: location.pathname === "/sign-in",
    forgotPassword: location.pathname === "/forgot-password",
  };

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

  function validateForm() {
    const newErrors = {};

    if (formType.forgotPassword) {
      if (!email) newErrors.email = "Email is required";
      else if (!validateEmailFormat(email))
        newErrors.email = "Invalid email format";
    } else if (formType.signUp) {
      if (!fullName) newErrors.fullName = "Full name is required";
      if (!email) newErrors.email = "Email is required";
      else if (!validateEmailFormat(email))
        newErrors.email = "Invalid email format";
      if (!password) newErrors.password = "Password is required";
      else if (!validatePasswordFormat(password))
        newErrors.password =
          "Password must include uppercase, lowercase, number, and special character";
    } else if (formType.signIn) {
      if (!email) newErrors.email = "Email is required";
      if (!password) newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      if (formType.forgotPassword) {
        const result = await resetPassword(email);
        // First check if the email is in the database
        if (!result.success) {
          setErrors({
            email: "The email you provided is not registered",
          });
          return;
        }
        // If user exists, send email and return
        return;
      } else if (formType.signUp) {
        const result = await signUp(formData);
        if (result.success) {
          console.log("Signed Up!");
          navigate("/");
        }
      } else if (formType.signIn) {
        const result = await signIn(email, password);
        if (result.success) {
          console.log("Logged in correctly!");
          navigate("/");
        } else {
          setErrors({
            email: "Email or password are not correct",
            password: "Email or password are not correct",
          });
          return console.log("Error signing in!");
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="">
      <h2 className="text-center font-bold text-2xl pt-4">
        {formType.signUp
          ? "Sign Up"
          : formType.signIn
          ? "Sign In"
          : "Forgot Password"}
      </h2>
      <div className="mx-auto flex flex-col px-6 py-12 max-w-6xl gap-16 justify-center items-center lg:flex-row">
        <div className="h-full md:w-[67%] lg:w-[55%]">
          <img
            className="w-full rounded-2xl"
            src="Keys-Sign-in.jpg"
            alt="keys on top of a hand, author: maria-ziegler, source: Unsplash"
          />
        </div>

        <div className="w-full md:w-[67%] lg:w-[45%]">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {formType.signUp && (
              <InputWithError
                type="text"
                id="fullName"
                placeholder="Full name"
                value={fullName}
                onChange={onChange}
                error={errors.fullName}
              />
            )}

            <InputWithError
              type="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={onChange}
              error={errors.email}
            />

            {(formType.signIn || formType.signUp) && (
              <div className="relative">
                <InputWithError
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="password"
                  value={password}
                  onChange={onChange}
                  error={errors.password}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer text-gray-700"
                  onClick={() => setShowPassword(s => !s)}
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </span>
              </div>
            )}

            {/* Navigation links */}
            <div className="flex justify-between text-sm text-nowrap sm:text-base lg:text-lg">
              {formType.signUp ? (
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
                to={formType.forgotPassword ? "/sign-in" : "/forgot-password"}
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                {formType.forgotPassword
                  ? "Sign in instead"
                  : "Forgot password?"}
              </Link>
            </div>

            {/* Submit button */}
            <button
              disabled={isLoading}
              type="submit"
              className="bg-blue-600 text-white uppercase font-medium px-7 py-3 rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800"
            >
              {isLoading
                ? "Loading..."
                : formType.signUp
                ? "Sign up"
                : formType.signIn
                ? "Sign in"
                : "Send reset email"}
            </button>

            {/* Divider */}
            <div className="flex items-center before:border-t before:w-full before:border-gray-300 after:border-t after:w-full after:border-gray-300">
              <p className="font-semibold mx-4">OR</p>
            </div>

            {/* OAuth component */}
            <OAuth formData={formData} />
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignForm;
