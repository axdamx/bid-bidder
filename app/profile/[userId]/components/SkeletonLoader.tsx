export const SkeletonLoaderProfile = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="relative w-full h-64 bg-gray-300 rounded-lg overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-500 opacity-50" />
        <div className="absolute bottom-4 left-4 flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
          <div>
            <div className="h-6 bg-gray-400 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-400 rounded w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row mt-8 mb-8">
        {/* Left column: Profile info */}
        <div className="md:w-1/3 md:pr-6 mb-6 md:mb-0">
          {/* Profile Stats */}
          <div className="flex justify-between mb-6">
            {["Posts", "Followers", "Following"].map((stat) => (
              <div key={stat} className="text-center">
                <div className="h-8 w-16 bg-gray-300 rounded mb-1"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="mb-6">
            <div className="h-6 w-24 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <div className="h-6 w-24 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Right column: Horizontal Cards */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2].map((card) => (
              <div
                key={card}
                className="border border-gray-200 rounded-lg p-4 animate-pulse flex flex-col sm:flex-row"
              >
                <div className="w-full sm:w-1/3 h-32 sm:h-auto bg-gray-300 rounded-lg mb-4 sm:mb-0 sm:mr-4"></div>
                <div className="w-full sm:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="h-5 sm:h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 sm:h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 sm:h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 sm:h-4 w-5/6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-6 sm:h-8 w-20 sm:w-24 bg-gray-300 rounded"></div>
                    <div className="h-6 sm:h-8 w-24 sm:w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
