

export default function OpenNavbar() {
  return (
    <nav className="top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 lg:left-64">
      <div className="px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left side - Mobile menu button and Dashboard title */}
          <div className="flex items-center min-w-0 flex-1">


            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              {/* Page title */}
              <h1 className="ml-1 sm:ml-2 lg:ml-0 text-md sm:text-lg lg:text-2xl font-semibold text-gray-900 truncate">
                POS Transaction History
              </h1>

            </div>
          </div>


        </div>
      </div>
    </nav>
  );
}