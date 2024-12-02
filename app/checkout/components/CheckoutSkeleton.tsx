import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-6xl">
        {/* Header Skeleton */}
        <div className="mb-8 h-8 w-32 animate-enhanced-pulse rounded-md bg-gray-200" />

        {/* Progress Bar Skeleton */}
        <div className="mb-8 h-2 w-full animate-enhanced-pulse rounded-full bg-gray-200" />

        {/* Steps Skeleton */}
        <div className="mb-8 flex justify-center space-x-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className="h-8 w-8 animate-enhanced-pulse rounded-full bg-gray-200" />
              <div className="ml-2 h-4 w-16 animate-enhanced-pulse rounded-md bg-gray-200" />
              {step < 3 && <div className="ml-8 h-px w-8 bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="h-6 w-48 animate-enhanced-pulse rounded-md bg-gray-200" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((input) => (
                    <div key={input} className="space-y-2">
                      <div className="h-4 w-24 animate-enhanced-pulse rounded-md bg-gray-200" />
                      <div className="h-10 w-full animate-enhanced-pulse rounded-md bg-gray-200" />
                    </div>
                  ))}
                </div>
                {[1, 2].map((input) => (
                  <div key={input} className="space-y-2">
                    <div className="h-4 w-32 animate-enhanced-pulse rounded-md bg-gray-200" />
                    <div className="h-10 w-full animate-enhanced-pulse rounded-md bg-gray-200" />
                  </div>
                ))}
                <div className="space-y-2">
                  <div className="h-4 w-48 animate-enhanced-pulse rounded-md bg-gray-200" />
                  <div className="space-y-2">
                    {[1, 2].map((radio) => (
                      <div key={radio} className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-enhanced-pulse rounded-full bg-gray-200" />
                        <div className="h-4 w-48 animate-enhanced-pulse rounded-md bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-6 flex justify-between">
              <div className="h-10 w-24 animate-enhanced-pulse rounded-md bg-gray-200" />
              <div className="h-10 w-24 animate-enhanced-pulse rounded-md bg-gray-200" />
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="h-6 w-32 animate-enhanced-pulse rounded-md bg-gray-200" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-4">
                  <div className="h-24 w-24 animate-enhanced-pulse rounded-md bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-enhanced-pulse rounded-md bg-gray-200" />
                    <div className="h-4 w-24 animate-enhanced-pulse rounded-md bg-gray-200" />
                    <div className="h-4 w-16 animate-enhanced-pulse rounded-md bg-gray-200" />
                  </div>
                </div>
                <div className="h-px w-full bg-gray-200" />
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex justify-between">
                      <div className="h-4 w-24 animate-enhanced-pulse rounded-md bg-gray-200" />
                      <div className="h-4 w-16 animate-enhanced-pulse rounded-md bg-gray-200" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="mx-auto h-6 w-6 animate-enhanced-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-16 mx-auto animate-enhanced-pulse rounded-md bg-gray-200" />
                  <div className="h-4 w-24 mx-auto animate-enhanced-pulse rounded-md bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
