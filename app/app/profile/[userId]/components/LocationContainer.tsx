import { Card } from "@/components/ui/card";

export const Location = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        {/* <MapPin className="h-5 w-5 text-gray-500" /> */}
        <h2 className="text-lg font-semibold">Location</h2>
      </div>
      <p className="text-gray-700 mt-2">KL, Malaysia</p>
    </Card>
  );
};
