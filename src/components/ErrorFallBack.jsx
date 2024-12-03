function ErrorFallBack({error, resetErrorBoundary}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-10">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl sm:text-4xl font-bold">Something went wrong 😅</h1>
        <p>{error.message}</p>
      </div>
      <button onClick={resetErrorBoundary} className="button-concave">Go back to homepage &rarr;</button>
    </div>
  );
}

export default ErrorFallBack;