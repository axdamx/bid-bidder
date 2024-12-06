"use client";

import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="flex h-screen bg-gray-100 animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-r">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          </div>
          {/* Navigation Items */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-96" />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDetailsSkeleton = () => (
  <div className="p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-16 h-16 rounded-full bg-gray-200" />
      <div>
        <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-48" />
      </div>
    </div>
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-12 bg-gray-200 rounded w-full" />
        </div>
      ))}
    </div>
  </div>
);

const AddressSkeleton = () => (
  <div className="p-6 animate-pulse">
    <div className="grid gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-lg p-6">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PaymentSkeleton = () => (
  <div className="p-6 animate-pulse">
    <div className="grid gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-8 bg-gray-200 rounded" />
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OrdersSkeleton = () => (
  <div className="p-6 animate-pulse">
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <div className="h-5 bg-gray-200 rounded w-32" />
            <div className="h-5 bg-gray-200 rounded w-24" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export {
  DashboardSkeleton,
  UserDetailsSkeleton,
  AddressSkeleton,
  PaymentSkeleton,
  OrdersSkeleton,
};

// Default loading component for the dashboard
const Loading = () => <DashboardSkeleton />;
export default Loading;
