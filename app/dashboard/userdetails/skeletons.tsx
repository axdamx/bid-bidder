"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = () => (
  <div className="flex flex-col items-center mb-8">
    <div className="relative mb-4">
      <Skeleton className="w-32 h-32 rounded-full" />
    </div>
    <Skeleton className="h-9 w-[120px]" /> {/* Upload button */}
  </div>
);

export const FieldSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/10 mb-2">
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 rounded-full" /> {/* Icon */}
      <div>
        <Skeleton className="h-4 w-20 mb-2" /> {/* Label */}
        <Skeleton className="h-5 w-32" /> {/* Value */}
      </div>
    </div>
    <Skeleton className="h-8 w-8 rounded-full" /> {/* Edit button */}
  </div>
);

export const SectionSkeleton = ({ fields = 3 }: { fields?: number }) => (
  <div className="mb-8">
    <Skeleton className="h-6 w-48 mb-2" /> {/* Section title */}
    <Skeleton className="h-4 w-64 mb-6" /> {/* Section description */}
    {Array(fields).fill(0).map((_, i) => (
      <FieldSkeleton key={i} />
    ))}
  </div>
);

export const DialogSkeleton = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 w-[425px]">
      <Skeleton className="h-6 w-48 mb-2" /> {/* Title */}
      <Skeleton className="h-4 w-64 mb-6" /> {/* Description */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" /> {/* Label */}
          <Skeleton className="h-10 flex-1" /> {/* Input */}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Skeleton className="h-9 w-[70px]" /> {/* Cancel button */}
        <Skeleton className="h-9 w-[70px]" /> {/* Save button */}
      </div>
    </div>
  </div>
);

export const UserDetailsSkeleton = () => (
  <div className="max-w-2xl mx-auto p-6">
    <div className="bg-white rounded-lg shadow-sm p-8">
      <ProfileSkeleton />
      <SectionSkeleton fields={3} /> {/* Personal Information */}
      <SectionSkeleton fields={2} /> {/* Contact Information */}
    </div>
  </div>
);
