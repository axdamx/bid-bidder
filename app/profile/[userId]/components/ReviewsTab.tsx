import { Card, CardContent } from "@/components/ui/card";
import { MotionGrid } from "@/app/components/motionGrid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export const ReviewsTab = () => {
  return (
    <div className="space-y-6 mb-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <MotionGrid
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.125 }}
        >
          <Card>
            <CardContent className="grid gap-4 p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="Reviewer" />
                  <AvatarFallback>RV</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">John Doe</span>
                    <span className="text-sm text-muted-foreground">
                      • 2 weeks ago
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Amazing seller! The vintage watch I purchased was exactly as
                described and arrived quickly. Sarah was very communicative
                throughout the process. Highly recommended!
              </p>
            </CardContent>
          </Card>
        </MotionGrid>
      ))}
    </div>
  );
};
