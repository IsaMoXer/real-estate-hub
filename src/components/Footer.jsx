function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="text-sm text-center text-slate-600 mt-10 p-8 border border-t-slate-200">
      <p>
      Copyright © {currentYear}. All rights are reserved.
      </p>
    </div>
  )
}

export default Footer
