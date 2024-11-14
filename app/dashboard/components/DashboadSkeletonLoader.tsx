export const SkeletonLoading = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - 30% width */}
      <div className="w-[30%] p-4 bg-white border-r">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-[150px] bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-[100px] bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-[80%] bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-[70%] bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-[60%] bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-[75%] bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Main content - 70% width */}
      <div className="w-[70%] p-8">
        <div className="space-y-4 mb-8">
          <div className="h-8 w-[200px] bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-[300px] bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4 mb-6">
            <div className="h-6 w-[150px] bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-[250px] bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-[100px] bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-[200px] bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
