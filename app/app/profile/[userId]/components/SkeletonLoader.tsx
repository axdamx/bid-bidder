import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SkeletonLoaderProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <div className="relative h-48 bg-muted">
        <div className="absolute -bottom-16 left-8 flex items-end gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="mb-4 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="mt-20 border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container py-6">
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            {["Listings", "About", "Reviews"].map((tab) => (
              <TabsTrigger key={tab} value={tab.toLowerCase()}>
                <Skeleton className="h-4 w-16" />
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Listings Skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* About Skeleton */}
          <Card className="hidden">
            <CardContent className="grid gap-4 p-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Skeleton */}
          <div className="hidden space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="grid gap-4 p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="grid gap-2 flex-1">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/6" />
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton key={i} className="h-4 w-4" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};
