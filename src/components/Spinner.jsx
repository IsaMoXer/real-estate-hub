import spinner from "../assets/svg/spinner.svg";

function Spinner() {
  return (
    <div className="bg-black bg-opacity-50 flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 z-20">
      <div>
        <img className="h-32" src={spinner} alt="loading spinner" />
      </div>
    </div>
  );
}

export default Spinner;
