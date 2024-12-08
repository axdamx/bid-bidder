import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MotionGrid } from "@/app/components/motionGrid";
import { CalendarDays, MapPin } from "lucide-react";

interface AboutTabProps {
  user: any; // Replace 'any' with a proper user type
}

export const AboutTab = ({ user }: AboutTabProps) => {
  return (
    <MotionGrid
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.125 }}
    >
      <Card>
        <CardContent className="grid gap-4 p-6">
          <div>
            <h3 className="font-semibold">About Me</h3>
            {user.about && (
              <p className="text-sm text-muted-foreground mt-3">{user.about}</p>
            )}
          </div>
          <Separator />
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {user.city && (
              <p className="text-sm text-muted-foreground">
                {user.city}, {user.country}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            {user.createdAt && (
              <p className="text-sm text-muted-foreground">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </MotionGrid>
  );
};
