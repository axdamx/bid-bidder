import { Card, CardContent } from "@/components/ui/card";
import { SellerReviews } from "@/app/components/SellerReviews";
import { MotionGrid } from "@/app/components/motionGrid";

export const ReviewsTab = ({ userId }: { userId: string }) => {
  return (
    <MotionGrid
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.125 }}
      className="space-y-6"
    >
      <Card>
        <CardContent className="grid gap-4 p-6">
          <div className="space-y-6 mb-6">
            <SellerReviews sellerId={userId} />
          </div>
        </CardContent>
      </Card>
    </MotionGrid>
  );
};
