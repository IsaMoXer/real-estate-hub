import React, { useEffect, useRef } from "react";

export default function InputWithError({
  type,
  id,
  placeholder,
  value,
  onChange,
  className,
  error,
  isEditing,
  ...restProperties
}) {
  const inputClass = isEditing
    ? "bg-red-100 focus:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
    : "";

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out ${
          error ? "border-red-500" : ""
        } ${className || ""} ${inputClass}`}
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...restProperties}
      />
      {error && (
        <p className="absolute text-red-500 text-xs italic mt-1">{error}</p>
      )}
    </div>
  );
}

// When passing references as properties we use the forwardReference
//export default React.forwardRef(InputWithError);
