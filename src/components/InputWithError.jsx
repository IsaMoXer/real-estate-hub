export default function InputWithError({
  type,
  id,
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div className="relative">
      <input
        className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out ${
          error ? "border-red-500" : ""
        }`}
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && (
        <p className="absolute text-red-500 text-xs italic mt-1">{error}</p>
      )}
    </div>
  );
}
