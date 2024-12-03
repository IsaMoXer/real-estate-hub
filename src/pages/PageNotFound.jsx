import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-10">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4">Page not found</h1>
      <Link to="/">
      <button className="button-concave">Go back to homepage &rarr;</button>
      </Link>
    </div>
  );
}

export default PageNotFound;