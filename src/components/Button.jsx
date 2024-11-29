function Button({ children, ...props }) {
  return (
    <button
      className="w-full px-7 py-3 font-medium text-sm rounded text-white uppercase bg-blue-600 shadow-md hover:shadow-lg hover:bg-blue-700 active:shadow-xl active:bg-blue-800 transition duration-150 ease-in-out active:translate-y-1 flex justify-center items-center"
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;