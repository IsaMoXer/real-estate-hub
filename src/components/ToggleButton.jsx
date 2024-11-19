// ToggleButton.jsx
function ToggleButton({ id, value, active, onClick, children }) {
  return (
    <button
      type="button"
      id={id}
      value={value}
      onClick={onClick}
      className={`w-full uppercase font-medium text-sm shadow-md rounded px-7 py-3 hover:shadow-lg transition duration-150 ease-in-out active:shadow-xl active:translate-y-1 ${
        active === value ? "bg-slate-600 text-white" : "bg-white text-black"
      }`}
    >
      {children}
    </button>
  );
}

export default ToggleButton;
